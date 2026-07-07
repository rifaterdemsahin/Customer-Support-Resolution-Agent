package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime/debug"
	"strconv"
	"strings"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
)

var (
	githubToken  string
	githubRepo   string
	semblanceDir string
)

func main() {
	githubRepo = envOrDefault("GITHUB_REPO", "rifaterdemsahin/Customer-Support-Resolution-Agent")
	semblanceDir = envOrDefault("SEMBLANCE_DIR", "semblance")
	if err := os.MkdirAll(semblanceDir, 0o755); err != nil {
		log.Printf("⚠️  semblance: cannot create dir %q: %v", semblanceDir, err)
	} else {
		log.Printf("✅ semblance: recording caught errors in %s", semblanceDir)
	}

	if err := loadGitHubToken(); err != nil {
		log.Fatalf("Failed to load GitHub token: %v", err)
	}

	port := envOrDefault("PORT", "8080")

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/api/status", handleStatus)
	mux.HandleFunc("/api/errors", handleClientError)
	mux.HandleFunc("/api/upload/audio", handleUploadAudio)
	mux.HandleFunc("/api/upload/image", handleUploadImage)
	mux.Handle("/", http.FileServer(http.Dir("/static")))

	handler := corsMiddleware(recoverer(mux))

	log.Printf("CSRA Backend starting on :%s", port)
	log.Printf("GitHub repo: %s", githubRepo)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func loadGitHubToken() error {
	vaultURL := os.Getenv("AZURE_KEYVAULT_URL")
	secretName := os.Getenv("AZURE_SECRET_NAME")

	if vaultURL != "" && secretName != "" {
		log.Printf("Loading GitHub token from Azure Key Vault: %s (secret: %s)", vaultURL, secretName)

		cred, err := azidentity.NewDefaultAzureCredential(nil)
		if err != nil {
			return fmt.Errorf("azure credential: %w", err)
		}

		client, err := azsecrets.NewClient(vaultURL, cred, nil)
		if err != nil {
			return fmt.Errorf("key vault client: %w", err)
		}

		resp, err := client.GetSecret(context.Background(), secretName, "", nil)
		if err != nil {
			return fmt.Errorf("get secret %q: %w", secretName, err)
		}
		githubToken = *resp.Value
		log.Println("✅ GitHub token loaded from Azure Key Vault")
		return nil
	}

	githubToken = os.Getenv("GITHUB_TOKEN")
	if githubToken == "" {
		return fmt.Errorf("GITHUB_TOKEN not set (set AZURE_KEYVAULT_URL + AZURE_SECRET_NAME or GITHUB_TOKEN env)")
	}
	log.Println("✅ GitHub token loaded from environment")
	return nil
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":     "ok",
		"repo":       githubRepo,
		"configured": githubToken != "",
	})
}

func handleUploadAudio(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		writeError(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	act := r.FormValue("act")
	file, _, err := r.FormFile("file")
	if err != nil {
		writeError(w, "Missing file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		writeError(w, "Failed to read file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	path := fmt.Sprintf("generated-audio/%s-narration.mp3", act)
	if err := pushToGitHub(path, data, fmt.Sprintf("upload: update %s narration audio", act)); err != nil {
		recordError("server", "github-upload", path, "audio upload failed: "+err.Error())
		writeError(w, "GitHub upload failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Audio uploaded: %s (%d bytes)", path, len(data))
	writeSuccess(w, "Audio uploaded to "+path)
}

func handleUploadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		writeError(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	scene := r.FormValue("scene")
	file, _, err := r.FormFile("file")
	if err != nil {
		writeError(w, "Missing file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		writeError(w, "Failed to read file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	path := fmt.Sprintf("generated-images/%s.png", scene)
	if err := pushToGitHub(path, data, fmt.Sprintf("upload: update %s background image", scene)); err != nil {
		recordError("server", "github-upload", path, "image upload failed: "+err.Error())
		writeError(w, "GitHub upload failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Image uploaded: %s (%d bytes)", path, len(data))
	writeSuccess(w, "Image uploaded to "+path)
}

func pushToGitHub(path string, content []byte, message string) error {
	url := fmt.Sprintf("https://api.github.com/repos/%s/contents/%s", githubRepo, path)

	// Check if file exists to get SHA
	sha := getFileSHA(path)

	body := map[string]interface{}{
		"message": message,
		"content": base64.StdEncoding.EncodeToString(content),
		"branch":  "main",
	}
	if sha != "" {
		body["sha"] = sha
	}

	jsonBody, _ := json.Marshal(body)
	req, err := http.NewRequest("PUT", url, bytes.NewReader(jsonBody))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+githubToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("http request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GitHub API error %d: %s", resp.StatusCode, string(respBody))
	}

	return nil
}

func getFileSHA(path string) string {
	url := fmt.Sprintf("https://api.github.com/repos/%s/contents/%s?ref=main", githubRepo, path)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+githubToken)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != 200 {
		return ""
	}
	defer resp.Body.Close()

	var result struct {
		SHA string `json:"sha"`
	}
	json.NewDecoder(resp.Body).Decode(&result)
	return result.SHA
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

func writeSuccess(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "message": msg})
}

// recoverer is the global server-side error catcher. Any panic raised while
// serving a request is recovered, recorded into the semblance/ folder, and
// returned to the client as a clean 500 instead of crashing the process.
func recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				msg := fmt.Sprintf("panic: %v\n%s", rec, debug.Stack())
				recordError("server", "panic", r.Method+" "+r.URL.Path, msg)
				log.Printf("❌ PANIC recovered %s %s: %v", r.Method, r.URL.Path, rec)
				writeError(w, "Internal server error (recovered)", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

// recordError appends one tab-separated line to semblance/<source>-errors.log.
// source is "server" or "client". This is the durable record of every caught
// error on both sides of the system.
func recordError(source, kind, page, msg string) {
	dir := semblanceDir
	if dir == "" {
		dir = "semblance"
	}
	if err := os.MkdirAll(dir, 0o755); err != nil {
		log.Printf("semblance: cannot create dir: %v", err)
		return
	}
	path := filepath.Join(dir, source+"-errors.log")
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		log.Printf("semblance: cannot open %s: %v", path, err)
		return
	}
	defer f.Close()
	oneLine := strings.ReplaceAll(strings.ReplaceAll(msg, "\n", " ⏎ "), "\t", " ")
	fmt.Fprintf(f, "%s\t%s\t%s\t%s\t%s\n", time.Now().UTC().Format(time.RFC3339), source, kind, page, oneLine)
}

// handleClientError receives JSON error reports from the client-side Error
// Sentinel and durably records them in semblance/client-errors.log.
func handleClientError(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, "Failed to read body: "+err.Error(), http.StatusBadRequest)
		return
	}
	var p struct {
		Type string `json:"type"`
		TS   string `json:"ts"`
		Page string `json:"page"`
		Data struct {
			Message  string `json:"message"`
			Filename string `json:"filename"`
			Line     int    `json:"line"`
			Col      int    `json:"col"`
			Stack    string `json:"stack"`
			Src      string `json:"src"`
			Tag      string `json:"tag"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &p); err != nil {
		writeError(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}
	d := p.Data
	var parts []string
	if d.Message != "" {
		parts = append(parts, d.Message)
	}
	if d.Tag != "" {
		parts = append(parts, "tag="+d.Tag)
	}
	if d.Src != "" {
		parts = append(parts, "src="+d.Src)
	}
	if d.Filename != "" {
		parts = append(parts, "at "+d.Filename+":"+strconv.Itoa(d.Line)+":"+strconv.Itoa(d.Col))
	}
	if d.Stack != "" {
		parts = append(parts, "\n"+d.Stack)
	}
	if p.TS == "" {
		p.TS = time.Now().UTC().Format(time.RFC3339)
	}
	page := p.Page
	if page == "" {
		page = r.Header.Get("Referer")
	}
	recordError("client", p.Type, page, p.TS+" "+strings.Join(parts, " "))
	log.Printf("📥 client error [%s] %s: %s", p.Type, page, d.Message)
	writeSuccess(w, "recorded")
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

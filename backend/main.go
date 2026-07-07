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

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
)

var (
	githubToken string
	githubRepo  string
)

func main() {
	githubRepo = envOrDefault("GITHUB_REPO", "rifaterdemsahin/Customer-Support-Resolution-Agent")

	if err := loadGitHubToken(); err != nil {
		log.Fatalf("Failed to load GitHub token: %v", err)
	}

	port := envOrDefault("PORT", "8080")

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/api/status", handleStatus)
	mux.HandleFunc("/api/upload/audio", handleUploadAudio)
	mux.HandleFunc("/api/upload/image", handleUploadImage)

	handler := corsMiddleware(mux)

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

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

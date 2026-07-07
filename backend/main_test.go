package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestRecovererRecordsPanic verifies the global server-side error catcher
// recovers from a handler panic, returns a clean 500, and durably records the
// panic (with stack) into semblance/server-errors.log.
func TestRecovererRecordsPanic(t *testing.T) {
	dir := t.TempDir()
	semblanceDir = dir

	panicHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("boom from test")
	})
	srv := httptest.NewServer(recoverer(panicHandler))
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/boom")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusInternalServerError {
		t.Fatalf("status = %d, want 500; body: %s", resp.StatusCode, body)
	}
	if !strings.Contains(string(body), "Internal server error") {
		t.Fatalf("body = %s", body)
	}

	data, err := os.ReadFile(filepath.Join(dir, "server-errors.log"))
	if err != nil {
		t.Fatalf("read server-errors.log: %v", err)
	}
	if !strings.Contains(string(data), "panic: boom from test") {
		t.Fatalf("server log missing panic message:\n%s", data)
	}
	if !strings.Contains(string(data), "GET /boom") {
		t.Fatalf("server log missing request path:\n%s", data)
	}
}

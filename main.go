package main

import (
    "api"
    "cache"
    "fmt"
    "net/http"
    "scraper"
    "time"
)

func main() {

    scraper.Init()

    serverMux := http.NewServeMux()
    serverMux.HandleFunc("/", redirectToTLS)
    server := &http.Server{
        Addr: ":8080",
        Handler: serverMux,
        ReadTimeout: 10 * time.Second,
        WriteTimeout: 10 * time.Second,
        MaxHeaderBytes: 1 << 20,
    }

    serverTLSMux := http.NewServeMux()
    cache.Start(serverTLSMux)
    serverTLSMux.HandleFunc("/api/getAddress", api.GetAddress)
    serverTLSMux.HandleFunc("/api/rescan", api.Rescan)
    serverTLSMux.HandleFunc("/api/search", api.Search)
    serverTLS := &http.Server{
        Addr: ":8443",
        Handler: serverTLSMux,
        ReadTimeout: 10 * time.Second,
        WriteTimeout: 10 * time.Second,
        MaxHeaderBytes: 1 << 20,
    }

    fmt.Println("Server started")
    c := make(chan int)
    go serverTLS.ListenAndServeTLS("server.crt", "server.key")
    go server.ListenAndServe()
    <-c
}

func redirectToTLS(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, "https://localhost:8443" + r.URL.Path, http.StatusMovedPermanently)
}

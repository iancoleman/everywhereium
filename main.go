package main

import (
    "api"
    "cache"
    "fmt"
    "net/http"
    "os"
    "scraper"
    "time"
)

func main() {

    scraper.Init()

    serverMux := http.NewServeMux()
    serverMux.HandleFunc("/", redirectToTLS)
    server := &http.Server{
        Addr: os.Getenv("EVERYWHEREIUM_HTTP_PORT"),
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
        Addr: os.Getenv("EVERYWHEREIUM_TLS_PORT"),
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
    http.Redirect(w, r, "https://" + os.Getenv("HOST") + r.URL.Path, http.StatusMovedPermanently)
}

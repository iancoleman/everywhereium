package main

import (
    "fmt"
    "net/http"
    "os"
    "time"
)

func main() {

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
    serverTLSMux.Handle("/", http.FileServer(http.Dir("static")))
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

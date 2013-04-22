package main

import (
    "api"
    "cache"
    "fmt"
    "net/http"
    "scraper"
)

func main() {
    scraper.Init()
    cache.Start()

    http.HandleFunc("/api/getAddress", api.GetAddress)
    http.HandleFunc("/api/rescan", api.Rescan)
    http.HandleFunc("/api/search", api.Search)

    fmt.Println("Server started")
    http.ListenAndServe(":8000", nil)
    //http.ListenAndServeTLS(":8000", "server.crt", "server.key", nil)
}

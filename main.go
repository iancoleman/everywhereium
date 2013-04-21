package main

import (
    "bitcoin"
    "cache"
    "db"
    "fmt"
    "net/http"
)

func getAddress(w http.ResponseWriter, r *http.Request) {
    // Get the site being tipped
    r.ParseForm()
    if _,ok := r.Form["site"]; !ok {
        w.WriteHeader(400)
        fmt.Fprintf(w, "Missing site parameter. Append ?site=http://example.com to your url.")
        return
    }
    site := r.Form["site"][0]
    // Do some jsonrpc to armoryd
    address := bitcoin.GetNewAddress()
    // Save the result in the database
    db.Write("INSERT INTO everywhereium (site, receive_address) VALUES ($1, $2)", site, address)
    // Write the result to the response
    fmt.Fprintf(w, address)
}

func rescan(w http.ResponseWriter, r *http.Request) {
    // Read the specified website
    // See if it contains the required meta tag
    // If so mark the received payment to be paid to the address on the site
    // If not return the content that was received with the error 'no meta tag'
}

func search(w http.ResponseWriter, r *http.Request) {
    // Find matches in the database for the specified url
    // Return the matches in json format
}

func main() {

    cache.Start()

    http.HandleFunc("/getAddress", getAddress)
    http.HandleFunc("/rescan", rescan)
    http.HandleFunc("/search", search)

    fmt.Println("Server started")
    http.ListenAndServe(":8000", nil)
}

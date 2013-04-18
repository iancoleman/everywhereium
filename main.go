package main

import (
    "cache"
    "fmt"
    "net/http"
)

func getAddress(w http.ResponseWriter, r *http.Request) {
    // Do some jsonrpc to armoryd
    // Save the result in the database
    // Write the result to the response
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

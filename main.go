package main

import (
    "bitcoin"
    "cache"
    "db"
    "fmt"
    "io/ioutil"
    "net/http"
    "scraper"
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
    r.ParseForm()
    if _,ok := r.Form["site"]; !ok {
        w.WriteHeader(400)
        fmt.Fprintf(w, "Missing site parameter. Append ?site=http://example.com to your url.")
        return
    }
    site := r.Form["site"][0]
    // See if the site is in the database
    query := `SELECT COUNT(*) FROM everywhereium WHERE site=$1`
    rows := db.Read(query, site)
    rowCount := 0
    for rows.Next() {
        err := rows.Scan(&rowCount)
        if err != nil {
            panic(err)
        }
    }
    if rowCount == 0 {
        w.WriteHeader(404)
        fmt.Fprintf(w, "No tips found for site " + site)
        return
    }
    // Read the specified website
    response, err := http.Get(site)
    if err != nil {
        w.WriteHeader(400)
        fmt.Fprintf(w, "Unable to read the site at " + site)
        return
    }
    defer response.Body.Close()
    body, err := ioutil.ReadAll(response.Body)
    if err != nil {
        w.WriteHeader(400)
        fmt.Fprintf(w, "Unable to read site at " + site)
        return
    }
    // See if it contains the required meta tag
    address := scraper.FindAddress(body)
    if address == nil {
        w.WriteHeader(400)
        // This error text should be jsonic.
        fmt.Fprintf(w, "Unable to find an address at the site " + site + " in the <body> tag in " + string(body))
        return
    }
    // Mark the received payment to be paid to the address on the site
    query = `UPDATE everywhereium SET parse_time=(extract(epoch from now() at time zone 'utc')*1000000), parse_address=$1, has_been_claimed=FALSE WHERE id IN (SELECT id FROM everywhereium WHERE site=$2) and has_been_claimed IS NULL;`
    db.Write(query, string(address), site)
    fmt.Fprintf(w, string(address))
}

func search(w http.ResponseWriter, r *http.Request) {
    // Find matches in the database for the specified url
    // Return the matches in json format
}

func main() {

    scraper.Init()

    cache.Start()

    http.HandleFunc("/api/getAddress", getAddress)
    http.HandleFunc("/api/rescan", rescan)
    http.HandleFunc("/api/search", search)

    fmt.Println("Server started")
    http.ListenAndServe(":8000", nil)
}

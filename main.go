package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "strings"
    "strconv"
)

var cache map[string]string

func getSiteDetail(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "You made it")
}

func fromCache(w http.ResponseWriter, r *http.Request) {
    key := strings.Trim(r.URL.Path, "/")
    fmt.Println(key)
    if content,ok := cache[key]; ok {
        fmt.Fprintf(w, content)
    } else {
        errorHandler(w, r, http.StatusNotFound)
    }
}

func errorHandler(w http.ResponseWriter, r *http.Request, status int) {
    w.WriteHeader(status)
    fmt.Fprintf(w, cache[strconv.Itoa(status)])
}

func loadCache() {
    cache = make(map[string]string)

    err := filepath.Walk("static", cacheStaticFile)
    if err != nil {
        panic(err)
    }
}

func cacheStaticFile(filename string, f os.FileInfo, err error) error {
    if f.IsDir() {
        return nil
    }
    key := strings.Replace(filename, "static/", "", 1)
    key = key[:strings.LastIndex(key, ".html")]
    fmt.Println("Caching " + filename + " as " + key)
    content, err := ioutil.ReadFile(filename)
    if key == "index" {
        cache[""] = string(content)
        http.HandleFunc("/", fromCache)
        return err
    }
    cache[key] = string(content)
    http.HandleFunc(key, fromCache)
    return err
}

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
    env := os.Getenv("ENV")
    if env == "development" {
        http.Handle("/", http.FileServer(http.Dir("static")))
    } else {
        loadCache()
    }

    http.HandleFunc("/getAddress", getAddress)
    http.HandlerFunc("/rescan", rescan)
    http.HandlerFunc("/search", search)

    fmt.Println("Server started")
    http.ListenAndServe(":8000", nil)
}

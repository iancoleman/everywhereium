package cache

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "strconv"
    "strings"
)

var Map map[string]string

func Start() {
    env := os.Getenv("ENV")
    if env == "development" {
        http.Handle("/", http.FileServer(http.Dir("static")))
    } else {
        loadCache()
    }
}

func loadCache() {
    Map = make(map[string]string)

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
    extension := key[strings.LastIndex(key, "."):]
    if extension == ".html" {
        key = key[:strings.LastIndex(key, extension)]
    }
    fmt.Println("Caching " + filename + " as " + key)
    content, err := ioutil.ReadFile(filename)
    if key == "index" {
        Map[""] = string(content)
        http.HandleFunc("/", fromCache)
        return err
    }
    Map[key] = string(content)
    http.HandleFunc(key, fromCache)
    return err
}

func fromCache(w http.ResponseWriter, r *http.Request) {
    key := strings.Trim(r.URL.Path, "/")
    fmt.Println(key)
    if content,ok := Map[key]; ok {
        fmt.Fprintf(w, content)
    } else {
        errorHandler(w, r, http.StatusNotFound)
    }
}

func errorHandler(w http.ResponseWriter, r *http.Request, status int) {
    w.WriteHeader(status)
    fmt.Fprintf(w, Map[strconv.Itoa(status)])
}


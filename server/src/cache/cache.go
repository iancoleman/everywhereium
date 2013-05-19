package cache

import (
    "net/http"
)

var Map map[string]string
var mux *http.ServeMux

func Start(serveMux *http.ServeMux) {
    mux = serveMux
    mux.Handle("/", http.FileServer(http.Dir("static")))
}

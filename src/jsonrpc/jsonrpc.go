package jsonrpc

import (
    "encoding/json"
    "io/ioutil"
    "net/http"
    "os"
    "strings"
)

var url string

func Call(method string, params []interface{}) []byte {
    data, err := json.Marshal(map[string]interface{}{
        "method": method,
        "params": params,
    })
    if err != nil {
        panic(err)
    }
    url := getUrl()
    resp, err := http.Post(url, "application/json", strings.NewReader(string(data)))
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }
    return body
}

func getUrl() string {
    user := os.Getenv("WALLETUSER")
    password := os.Getenv("WALLETPASSWORD")
    host := os.Getenv("WALLETHOST")
    port := os.Getenv("WALLETPORT")
    url = "http://" + user + ":" + password + "@" + host + ":" + port
    return url
}

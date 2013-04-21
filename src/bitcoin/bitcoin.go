package bitcoin

import (
    "encoding/json"
    "jsonrpc"
)

func GetNewAddress() string {
    response := jsonrpc.Call("getnewaddress", []interface{}{})
    result := []string{}
    err := json.Unmarshal(response, &result)
    if err != nil {
        panic(err)
    }
    return result[0]
}

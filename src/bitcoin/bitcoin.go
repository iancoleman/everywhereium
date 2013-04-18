package bitcoin

import (
    "fmt"
    "jsonrpc"
)

func GetNewAddress() {
    response := jsonrpc.Call("getnewaddress", nil)
    fmt.Println(response)
}

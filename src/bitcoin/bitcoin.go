package bitcoin

import (
    "jsonrpc"
)

func GetNewAddress() string {
    response := jsonrpc.Call("getnewaddress", nil)
    return response["result"].(string)
}

package main

import (
    "fmt"
    "db"
)

func main() {
    db.Write("DROP TABLE IF EXISTS everywhereium")
    createQuery := `CREATE TABLE everywhereium (
        id SERIAL,
        created BIGINT,
        site VARCHAR(2000),
        receive_address VARCHAR(34),
        parse_time BIGINT,
        parse_address VARCHAR(34),
        has_been_claimed BOOLEAN
        )`
    db.Write(createQuery)
    fmt.Println("DONE")
}

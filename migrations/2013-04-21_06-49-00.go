package main

import (
    "fmt"
    "db"
)

func main() {
    db.Write("DROP TABLE IF EXISTS everywhereium")
    createQuery := `CREATE TABLE everywhereium (
        id SERIAL,
        created BIGINT DEFAULT extract(epoch from now() at time zone 'utc') * 1000000,
        site VARCHAR(2000),
        receive_address VARCHAR(34),
        parse_time BIGINT,
        parse_address VARCHAR(34),
        has_been_claimed BOOLEAN
        )`
    db.Write(createQuery)
    fmt.Println("DONE")
}

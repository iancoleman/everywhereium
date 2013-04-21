package db

import (
    "database/sql"
    _ "github.com/bmizerany/pq"
    "os"
)

func Read(query string, args ...interface{}) *sql.Rows {
    db := connect()
    defer db.Close()
    result, err := db.Query(query, args...)
    if err != nil {
        panic(err)
    }
    return result
}

func Write(query string, args ...interface{}) {
    db := connect()
    defer db.Close()
    _, err := db.Exec(query, args...)
    if err != nil {
        panic(err)
    }
}

func connect() *sql.DB {
    connectionString := "user="
    connectionString += os.Getenv("DBUSER")
    connectionString += " password="
    connectionString += os.Getenv("DBPASSWORD")
    connectionString += " host="
    connectionString += os.Getenv("DBHOST")
    connectionString += " port="
    connectionString += os.Getenv("DBPORT")
    connectionString += " dbname="
    connectionString += os.Getenv("DBNAME")
    connectionString += " sslmode="
    connectionString += os.Getenv("DBSSLMODE")
    db, err := sql.Open("postgres", connectionString)
    if err != nil {
        panic(err)
    }
    return db
}

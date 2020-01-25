package main

import (
	"database/sql"
	"log"
	"net/http"
)

var db *sql.DB

func init() {
	tmpDB, err := sql.Open("postgres", "dbname=masterdata user=postgres password=postgres host=localhost sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	db = tmpDB
}

func main() {

	http.HandleFunc("/satker/create", handleCreate)
	log.Fatal(http.ListenAndServe(":8301", nil))
}

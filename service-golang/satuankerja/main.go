package main

import (
	"fmt"
	"database/sql"
	"log"
	"os"
	"net/http"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../../.env")
  if err != nil {
    log.Fatal("Error loading .env file")
		godotenv.Load(".env")
  }

  s3Bucket := os.Getenv("POSTGRESQL_HOST")
	fmt.Println(s3Bucket)
	// http.HandleFunc("/satker/create", handleCreate)
	log.Fatal(http.ListenAndServe(":8301", nil))
}

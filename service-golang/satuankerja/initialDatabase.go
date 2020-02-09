package main

import (
	"fmt"
	"log"
	"os"
  "time"
  "strconv"

	"github.com/joho/godotenv"
	"github.com/jabardigitalservice/picasso-backend/service-golang/db_host"
	"github.com/jabardigitalservice/picasso-backend/service-golang/retry"
)

func Initialize() {
	err := godotenv.Load("../../.env")
  if err != nil {
    log.Fatal("Error loading .env file")
		godotenv.Load(".env")
  }

	postgresHost := os.Getenv("POSTGRESQL_HOST")
	postgresPort, err := strconv.ParseInt(os.Getenv("POSTGRESQL_PORT"), 10, 64)
	postgresUser := os.Getenv("POSTGRESQL_USER")
	postgresPassword := os.Getenv("POSTGRESQL_PASSWORD")
  postgresDB := os.Getenv("POSTGRESQL_DB_MASTER")

  if err != nil {
		log.Println(err)
		return
	}
  addr := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    postgresHost, postgresPort, postgresUser, postgresPassword, postgresDB)

  // Connect to PostgreSQL
	retry.ForeverSleep(2*time.Second, func(attempt int) error {

		repo, err := db.PostgresConnect(addr)
		if err != nil {
			log.Println(err)
			return err
		}
		db.SetRepository(repo)
		return nil
	})
	defer db.Close()
}

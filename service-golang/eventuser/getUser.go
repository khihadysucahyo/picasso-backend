package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/bdwilliams/go-jsonify/jsonify"
	"github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	_ "github.com/lib/pq"
)

func getUser(id string) ([]byte, error) {
	postgresHost := utils.GetEnv("POSTGRESQL_HOST")
	postgresPort, errPort := strconv.ParseInt(utils.GetEnv("POSTGRESQL_PORT"), 10, 64)
	postgresUser := utils.GetEnv("POSTGRESQL_USER")
	postgresPassword := utils.GetEnv("POSTGRESQL_PASSWORD")
	postgresDB := utils.GetEnv("DB_NAME_AUTH")
	if errPort != nil {
		fmt.Println(errPort)
	}
	addr := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		postgresHost, postgresPort, postgresUser, postgresPassword, postgresDB)
	db, err := sql.Open("postgres", addr)
	if err != nil {
		log.Fatal("Failed to open a DB connection: ", err)
	}
	defer db.Close()
	userSql := "SELECT accounts_account.id, accounts_account.email, accounts_account.username, accounts_account.first_name, accounts_account.last_name, accounts_account.id_divisi, accounts_account.divisi, accounts_account.id_jabatan, accounts_account.jabatan FROM accounts_account WHERE accounts_account.id = $1"

	rows, err := db.Query(userSql, id)
	type notFound struct {
		NotFound string
	}
	if err != nil {
		// log the error
		fmt.Println(err)
		usersBytes, _ := json.Marshal(&notFound{NotFound: "NotFound"})
		return usersBytes, nil
	}

	defer rows.Close()
	defer db.Close()

	var response = jsonify.Jsonify(rows)
	usersBytes, _ := json.Marshal(response)
	return usersBytes, nil
}

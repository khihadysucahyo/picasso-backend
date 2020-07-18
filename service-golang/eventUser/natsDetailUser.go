package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"runtime"
	"strconv"
	"time"

	"github.com/bdwilliams/go-jsonify/jsonify"
	"github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	_ "github.com/lib/pq"
	"github.com/nats-io/go-nats"
)

func getUser(id string) ([]byte, error) {
	// Create DB pool
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

func main() {
	subject := "userDetail"
	natsUri := utils.GetEnv("NATS_URI")

	opts := nats.Options{
		AllowReconnect: true,
		MaxReconnect:   5,
		ReconnectWait:  5 * time.Second,
		Timeout:        3 * time.Second,
		Url:            natsUri,
	}
	conn, _ := opts.Connect()
	//defer conn.Close()
	fmt.Println("Subscriber connected to NATS server")

	fmt.Printf("Subscribing to subject %s\n", subject)
	conn.Subscribe(subject, func(msg *nats.Msg) {
		cok, err := getUser(string(msg.Data))
		if err != nil {
			fmt.Println(err)
		}
		conn.Publish(msg.Reply, cok)
	})

	runtime.Goexit()
}

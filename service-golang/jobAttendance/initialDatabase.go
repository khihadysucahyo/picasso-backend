package main

import (
	"time"

	db "github.com/jabardigitalservice/picasso-backend/service-golang/db_host"
	"github.com/jabardigitalservice/picasso-backend/service-golang/retry"
	"go.mongodb.org/mongo-driver/mongo"
)

type ConfigDB struct {
	mongodb *mongo.Database
}

func Initialize() (*ConfigDB, error) {
	addr := "mongodb://localhost:27017"
	config := ConfigDB{}
	// Connect to MongoDB
	retry.ForeverSleep(2*time.Second, func(attempt int) error {
		mongodb := db.InitMongoDB(addr)
		config.mongodb = mongodb
		return nil
	})
	return &config, nil
}

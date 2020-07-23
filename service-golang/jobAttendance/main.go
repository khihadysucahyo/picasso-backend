package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Attendance struct {
	location string
}

func main() {
	log.Println("running")

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	configuration, err := Initialize()

	if err != nil {
		log.Println(err)
	}

	collection := configuration.mongodb.Collection("attendances")
	// matchStage := bson.M{}

	showInfoCursor, err := collection.Aggregate(ctx, mongo.Pipeline{})
	if err != nil {
		panic(err)
	}
	var showsWithInfo []bson.M
	if err = showInfoCursor.All(ctx, &showsWithInfo); err != nil {
		panic(err)
	}
	fmt.Println(showsWithInfo)
}

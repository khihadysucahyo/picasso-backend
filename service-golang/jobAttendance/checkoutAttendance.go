package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func checkoutAttendance() {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	configuration, err := Initialize()

	if err != nil {
		log.Println(err)
	}

	collection := configuration.mongodb.Collection("attendances")
	matchStage := bson.D{{"$match", bson.D{{"officeHours", 0}}}}
	limit := bson.D{{"$limit", 1}} //temporarily limit for debug purpuse

	result, err := collection.Aggregate(ctx, mongo.Pipeline{matchStage, limit})
	if err != nil {
		panic(err)
	}
	var data []bson.M
	if err = result.All(ctx, &data); err != nil {
		panic(err)
	}

	for i := 0; i < len(data); i++ {
		id := data[i]["_id"]

		// startDate := data[i]["startDate"]
		// why return epoch unix? && data type: primivitive.DateTime
		// Founded the logic and code to incrementing endDate for 8.5 hours
		// but stuck in data type converting "primivitive.DateTime" to "Time"

		// for date incrementing purpose
		endDate := time.Unix(1494505756 /*todo startDate*/, 0).Add(time.Hour*time.Duration(8) +
			time.Minute*time.Duration(30) +
			time.Second*time.Duration(0))

		// db update attendaces
		filter := bson.D{{"_id", id}}
		update := bson.D{{"$set",
			bson.D{
				{"officeHours", 8.5},
				{"endDate", endDate},
			},
		}}

		res, err := collection.UpdateOne(
			ctx,
			filter,
			update,
		)
		if err != nil {
			fmt.Println(err)
		}

		fmt.Println(res)
	}

}

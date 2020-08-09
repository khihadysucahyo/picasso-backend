package main

import (
	"log"

	"github.com/appleboy/go-fcm"
)

func main() {
	deviceToken := "device_token"
	msg := &fcm.Message{
		To:       deviceToken,
		Priority: "high",
		Notification: &fcm.Notification{
			Title:       "",
			Body:        "",
			Icon:        "",
			Badge:       "",
			Image:       "",
			Sound:       "",
			ClickAction: "",
			Color:       "",
		},
	}

	// Create a FCM client to send the message.
	client, err := fcm.NewClient(utils.GetEnv("FCM_SERVER_KEY"))
	if err != nil {
		log.Fatalln(err)
	}

	// Send the message and receive the response without retries.
	response, err := client.SendWithRetry(msg, 10)
	if err != nil {
		log.Fatalln(err)
	}

	log.Printf("%#v\n", response)
}

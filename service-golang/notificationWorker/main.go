package main

import (
	"fmt"
	"log"
	"runtime"
	"time"

	"github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/nats-io/go-nats"
	"github.com/robfig/cron"
)

func main() {
	log.Println("running job")
	config, err := Initialize()

	if err != nil {
		log.Println(err)
	}

	subjectSendToAll := "broadcastNotification"
	subjectSendByGroup := "groupNotification"
	natsUri := utils.GetEnv("NATS_URI")
	opts := nats.Options{
		AllowReconnect: true,
		MaxReconnect:   5,
		ReconnectWait:  5 * time.Second,
		Timeout:        3 * time.Second,
		Url:            natsUri,
	}
	conn, _ := opts.Connect()
	fmt.Println("Subscriber connected to NATS server")
	fmt.Printf("Subscribing to subject %s\n", subjectSendToAll)
	fmt.Printf("Subscribing to subject %s\n", subjectSendByGroup)
	conn.Subscribe(subjectSendToAll, func(msg *nats.Msg) {
		sendToAll(config, string(msg.Data))
	})

	conn.Subscribe(subjectSendByGroup, func(msg *nats.Msg) {
		sendByGroup(config, msg.Data)
	})

	c := cron.New()
	c.AddFunc(utils.GetEnv("CHECKIN_CRON_JOB"), func() { cronJobSendToAll(config) })

	c.Start()

	// Added time to see output
	time.Sleep(5 * time.Second)

	c.Stop() // Stop the scheduler (does not stop any jobs already running).
	runtime.Goexit()
}

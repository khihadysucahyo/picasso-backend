package main

import (
	"log"
	"runtime"
	"time"

	"github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/robfig/cron"
)

func main() {
	log.Println("running job")
	config, err := Initialize()

	if err != nil {
		log.Println(err)
	}

	c := cron.New()
	c.AddFunc(utils.GetEnv("CHECKIN_CRON_JOB"), func() { sendToAll(config) })

	c.Start()

	// Added time to see output
	time.Sleep(5 * time.Second)

	c.Stop() // Stop the scheduler (does not stop any jobs already running).
	runtime.Goexit()
}

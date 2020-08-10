package main

import (
	"log"
	"runtime"

	"github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/robfig/cron"
)

func main() {
	config, err := Initialize()

	if err != nil {
		log.Println(err)
	}

	c := cron.New()
	c.AddFunc(utils.GetEnv("CHECKIN_CRON_JOB"), func() { sendToAll(config) })

	c.Start()
	runtime.Goexit()
}

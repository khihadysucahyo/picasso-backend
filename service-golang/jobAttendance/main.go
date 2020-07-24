package main

import (
	"log"
	"runtime"

	"github.com/robfig/cron"
)

func main() {
	log.Println("running job")
	c := cron.New()
	c.AddFunc("@daily", func() { checkoutAttendance() })
	c.Start()
	runtime.Goexit()
}

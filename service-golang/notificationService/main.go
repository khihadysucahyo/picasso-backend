package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	auth "github.com/jabardigitalservice/picasso-backend/service-golang/middleware"
)

func newRouter(config *ConfigDB) (router *mux.Router) {
	router = mux.NewRouter()
	router.HandleFunc("/api/notification/send/all/", config.sendToAll).Methods("POST")
	router.HandleFunc("/api/notification/send/group/{groupID}", config.sendByGroup).Methods("POST")
	return
}

func main() {

	configuration, err := Initialize()
	if err != nil {
		log.Println(err)
	}
	// Run HTTP server
	router := newRouter(configuration)
	if err := http.ListenAndServe(":8304", auth.AuthMiddleware(router)); err != nil {
		log.Fatal(err)
	}
}

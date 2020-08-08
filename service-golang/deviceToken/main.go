package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func newRouter(config *ConfigDB) (router *mux.Router) {
	router = mux.NewRouter()
	router.HandleFunc("/api/device-token", config.listDeviceToken).Methods("GET")
	router.HandleFunc("/api/device-token/create", config.postDeviceToken).Methods("POST")
	router.HandleFunc("/api/device-token/update/{id}", config.putDeviceToken).Methods("PUT")
	router.HandleFunc("/api/device-token/delete/{id}", config.deleteDeviceToken).Methods("DELETE")
	return
}

func main() {

	configuration, err := Initialize()
	if err != nil {
		log.Println(err)
	}
	// Run HTTP server
	router := newRouter(configuration)
	if err := http.ListenAndServe(":8303", router); err != nil {
		log.Fatal(err)
	}
}

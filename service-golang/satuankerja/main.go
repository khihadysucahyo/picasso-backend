package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/jabardigitalservice/picasso-backend/service-golang/middleware"
)

func newRouter(config *Config) (router *mux.Router) {
	router = mux.NewRouter()
	router.HandleFunc("/api/satuan-kerja/", config.listSatuanKerja).Methods("GET")
	router.HandleFunc("/api/satuan-kerja/create", config.postSatuanKerja).Methods("POST")
	return
}

func main() {

	configuration, err := Initialize()
	if err != nil {
		log.Println(err)
	}
	// Run HTTP server
	router := newRouter(configuration)
	if err := http.ListenAndServe(":8301", auth.AuthMiddleware(router)); err != nil {
		log.Fatal(err)
	}
}

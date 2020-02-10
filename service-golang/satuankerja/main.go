package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/jabardigitalservice/picasso-backend/service-golang/middleware"
)

func newRouter(config *Config) (router *mux.Router) {
	router = mux.NewRouter()
	router.HandleFunc("/api/satuan-kerja/", config.listSatuanKerjaHandler).Methods("GET")
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

package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/jabardigitalservice/picasso-backend/service-golang/middleware"
)

func newRouter() (router *mux.Router) {
	router = mux.NewRouter()
	router.HandleFunc("/api/satuan-kerja/", 	listSatuanKerjaHandler).Methods("GET")
	return
}

func main() {

	Initialize()

	// Run HTTP server
	router := newRouter()
	if err := http.ListenAndServe(":8301", auth.AuthMiddleware(router)); err != nil {
		log.Fatal(err)
	}
}

package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/jabardigitalservice/picasso-backend/service-golang/middleware"
)

func newRouter(config *ConfigDB) (router *mux.Router) {
	router = mux.NewRouter()
	router.HandleFunc("/api/satuan-kerja/list", config.listSatuanKerja).Methods("GET")
	router.HandleFunc("/api/satuan-kerja/create", config.postSatuanKerja).Methods("POST")
	router.HandleFunc("/api/satuan-kerja/update/{id}", config.putSatuanKerja).Methods("PUT")
	router.HandleFunc("/api/satuan-kerja/detail/{id}", config.detailSatuanKerja).Methods("GET")
	router.HandleFunc("/api/satuan-kerja/delete/{id}", config.deleteSatuanKerja).Methods("DELETE")
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

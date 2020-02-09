package main

import (
	// "context"
	// "log"
	"net/http"
	// "strconv"

  // "github.com/jabardigitalservice/picasso-backend/service-golang/db_host"
  "github.com/jabardigitalservice/picasso-backend/service-golang/utils"
)


func listSatuanKerjaHandler(w http.ResponseWriter, r *http.Request) {
	// ctx := r.Context()
	// var err error

	// Read parameters
	// skip := uint64(0)
	// skipStr := r.FormValue("skip")
	// take := uint64(100)
	// takeStr := r.FormValue("take")
	// if len(skipStr) != 0 {
	// 	skip, err = strconv.ParseUint(skipStr, 10, 64)
	// 	if err != nil {
	// 		utils.ResponseError(w, http.StatusBadRequest, "Invalid skip parameter")
	// 		return
	// 	}
	// }
	// if len(takeStr) != 0 {
	// 	take, err = strconv.ParseUint(takeStr, 10, 64)
	// 	if err != nil {
	// 		utils.ResponseError(w, http.StatusBadRequest, "Invalid take parameter")
	// 		return
	// 	}
	// }

	// Fetch satuan kerja
	// list, err := db.ListSatuanKerja(ctx, skip, take)
	// if err != nil {
	// 	log.Println(err)
	// 	util.ResponseError(w, http.StatusInternalServerError, "Could not fetch meows")
	// 	return
	// }
  const list = "{ response: ok }"
	utils.ResponseOk(w, list)
}

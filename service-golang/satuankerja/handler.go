package main

import (
	"net/http"
	"strings"

  "github.com/jabardigitalservice/picasso-backend/service-golang/utils"
)


func listSatuanKerjaHandler(w http.ResponseWriter, r *http.Request) {
	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer")
	reqToken = splitToken[1]

	utils.ResponseOk(w, reqToken)
}

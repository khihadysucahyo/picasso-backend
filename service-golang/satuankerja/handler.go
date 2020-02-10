package main

import (
	"net/http"
	"strings"

  "github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/jabardigitalservice/picasso-backend/service-golang/models"
)


func (config *Config)listSatuanKerjaHandler(w http.ResponseWriter, r *http.Request) {
	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer")
	reqToken = splitToken[1]

	var satker []models.SatuanKerja
  config.db.Find(&satker)

	utils.ResponseOk(w, satker)
}

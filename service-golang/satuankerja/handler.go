package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"github.com/dgrijalva/jwt-go"

  "github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/jabardigitalservice/picasso-backend/service-golang/models"
)

func (config *ConfigDB)listSatuanKerja(w http.ResponseWriter, r *http.Request) {
	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer")
	reqToken = splitToken[1]

	var satker []models.SatuanKerja
  config.db.Find(&satker)

	utils.ResponseOk(w, satker)
}

func (config *ConfigDB)postSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
			ctx := r.Context().Value("user")
			sessionUser := ctx.(*jwt.Token).Claims.(jwt.MapClaims)
			decoder := json.NewDecoder(r.Body)
			payload := models.SatuanKerja{}
			if err := decoder.Decode(&payload); err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
			}
			strSession := sessionUser["email"]
			userSession := strSession.(string)
			create := models.SatuanKerja{
				ParentID: payload.ParentID,
				NameParent: payload.NameParent,
				NameSatuanKerja: payload.NameSatuanKerja,
				Description: payload.Description,
				CreatedBy: userSession,
			}
			config.db.Create(&create)
			utils.ResponseOk(w, payload)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

func (config *ConfigDB)putSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
			ctx := r.Context().Value("user")
			sessionUser := ctx.(*jwt.Token).Claims.(jwt.MapClaims)
			decoder := json.NewDecoder(r.Body)
			payload := models.SatuanKerja{}
			if err := decoder.Decode(&payload); err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
			}
			strSession := sessionUser["email"]
			userSession := strSession.(string)
			create := models.SatuanKerja{
				ParentID: payload.ParentID,
				NameParent: payload.NameParent,
				NameSatuanKerja: payload.NameSatuanKerja,
				Description: payload.Description,
				CreatedBy: userSession,
			}
			config.db.Create(&create)
			utils.ResponseOk(w, payload)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

func (config *ConfigDB)deleteSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
			ctx := r.Context().Value("user")
			sessionUser := ctx.(*jwt.Token).Claims.(jwt.MapClaims)
			decoder := json.NewDecoder(r.Body)
			payload := models.SatuanKerja{}
			config.db.Create(&payload)
			utils.ResponseOk(w, payload)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"

  "github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/jabardigitalservice/picasso-backend/service-golang/models"
)

func (config *ConfigDB)listSatuanKerja(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query()["search"][0]
	offset := r.URL.Query()["offset"][0]
	limit := r.URL.Query()["limit"][0]
	var total uint

	offset_int, err := strconv.Atoi(offset)
	if err != nil {
	  offset_int = 0
	}

	limit_int, err := strconv.Atoi(limit)
	if err != nil {
	  limit_int = 20
	}

	var satker []models.SatuanKerja

	config.db.Model(&models.SatuanKerja{}).
	Where("name_satuan_kerja LIKE ?", search).
	Order("created_at DESC").
	Count(&total).
	Limit(limit_int).
	Offset(offset_int).
	Find(&satker)

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
			response := config.db.Create(&create)
			utils.ResponseOk(w, response.Value)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

func (config *ConfigDB)putSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == "PUT" {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
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
				UpdatedBy: userSession,
			}
			response := config.db.Model(&payload).Where("ID = ?", params["id"]).Update(&create)
			utils.ResponseOk(w, response.Value)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

func (config *ConfigDB)deleteSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			payload := models.SatuanKerja{}
			response := config.db.Model(&payload).Where("ID = ?", params["id"]).Delete(&payload)
			utils.ResponseOk(w, response.Value)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

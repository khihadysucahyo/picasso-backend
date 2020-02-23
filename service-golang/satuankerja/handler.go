package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"

  "github.com/jabardigitalservice/picasso-backend/service-golang/utils"
	"github.com/jabardigitalservice/picasso-backend/service-golang/models"
)

func (config *ConfigDB)listSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == utils.MethodGet {
		search := string(r.URL.Query().Get("search"))
		offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
		if err != nil {
				 offset = 0
		}
		limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
		if err != nil {
				limit = 20
		}
		var total uint

		var satker []models.SatuanKerja

		config.db.Model(&models.SatuanKerja{}).
		Where("name_satuan_kerja LIKE ?", "%"+search+"%").
		Order("created_at DESC").
		Count(&total).
		Limit(limit).
		Offset(offset).
		Find(&satker)
		result := &models.Results{
			status: http.StatusOK,
			success: true,
			result: satker,
			_meta: {
				totalCount: total,
	      pageCount: 5,
	      currentPage: offset,
	      perPage: limit,
			},
		}
		fmt.Println(result)

		utils.ResponseOk(w, satker)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

func (config *ConfigDB)postSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == utils.MethodPost {
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
	if r.Method == utils.MethodPut {
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
	if r.Method == utils.MethodDelete {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			payload := models.SatuanKerja{}
			response := config.db.Model(&payload).Where("ID = ?", params["id"]).Delete(&payload)
			utils.ResponseOk(w, response.Value)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

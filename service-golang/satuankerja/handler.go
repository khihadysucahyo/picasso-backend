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
		var total int

		var satker []models.SatuanKerja

		response := config.db.Model(&models.SatuanKerja{}).
		Where("name_satuan_kerja LIKE ?", "%"+search+"%").
		Order("created_at DESC").
		Count(&total).
		Limit(limit).
		Offset(offset).
		Find(&satker)

		metaData := models.MetaData{
			TotalCount: total,
			TotalPage: utils.PageCount(total, limit),
			CurrentPage: utils.CurrentPage(offset, limit),
			PerPage: limit,
		}

		result := models.ResultsData{
			Status: http.StatusOK,
			Success: true,
			Results: response.Value,
			Meta: metaData,
		}

		utils.ResponseOk(w, result)
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
			var parent models.SatuanKerja
			parentID := ""
			if payload.ParentID != "" {
				config.db.Where("ID = ?", payload.ParentID).Find(&parent)
				if parent.NameSatuanKerja != "" {
					parentID = payload.ParentID
				}
			}

			create := models.SatuanKerja{
				ParentID: parentID,
				NameParent: parent.NameSatuanKerja,
				NameSatuanKerja: payload.NameSatuanKerja,
				Description: payload.Description,
				CreatedBy: userSession,
			}
			response := config.db.Create(&create)
			utils.ResponseOk(w, response)
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

			var parent models.SatuanKerja
			parentID := ""
			if payload.ParentID != "" {
				config.db.Where("ID = ?", payload.ParentID).Find(&parent)
				if parent.NameSatuanKerja != "" {
					parentID = payload.ParentID
				}
			}

			create := models.SatuanKerja{
				ParentID: parentID,
				NameParent: parent.NameSatuanKerja,
				NameSatuanKerja: payload.NameSatuanKerja,
				Description: payload.Description,
				CreatedBy: userSession,
			}

			response := config.db.Model(&payload).Where("ID = ?", params["id"]).Update(&create)
			utils.ResponseOk(w, response.Value)
	} else {
		utils.ResponseError(w, http.StatusBadRequest, "Invalid body")
	}
}

func (config *ConfigDB)detailSatuanKerja(w http.ResponseWriter, r *http.Request) {
	if r.Method == utils.MethodGet {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			var response models.SatuanKerja
			config.db.Where("ID = ?", params["id"]).Find(&response)
			result := models.ResultsData{
				Status: http.StatusOK,
				Success: true,
				Results: response,
			}
			utils.ResponseOk(w, result)
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

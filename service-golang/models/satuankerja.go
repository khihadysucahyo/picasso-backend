package models

import (
  "time"

  "github.com/jinzhu/gorm"
  "github.com/jabardigitalservice/picasso-backend/service-golang/models"
)
type IndexPage struct {
	AllSatuanKerja []SatuanKerja
}

type SatuanKerjaPage struct {
	TargetSatuanKerja SatuanKerja
}

//satuan kerja models
type SatuanKerja struct {
  gorm.Model
  ID                int				`json:"id"`
	ParentID         	int				`json:"parent_id"`
	NameParent        string		`json:"name_parent"`
	NameSatuanKerja  	string		`json:"name_satuan_kerja"`
	Description       string		`json:"description"`
	CreatedAt         time.Time	`json:"created_at"`
	CreatedBy         string		`json:"created_by"`
  UpdatedAt         time.Time	`json:"updated_at"`
	UpdatedBy         string		`json:"updated_by"`
}

type ErrorPage struct {
	ErrorMsg string
}

func SaveOne(data interface{}) error {
	common := db.GetDB()
	err := common.Save(data).Error
	return err
}

func (model *SatuanKerja) Update(data interface{}) error {
	common := db.GetDB()
	err := common.Model(model).Update(data).Error
	return err
}

func DeleteArticleModel(condition interface{}) error {
	common := db.GetDB()
	err := common.Where(condition).Delete(SatuanKerja{}).Error
	return err
}

package models

import (
  "encoding/json"
  "time"
  "fmt"
  // "strconv"

  "github.com/jinzhu/gorm"
  "github.com/jabardigitalservice/picasso-backend/service-golang/db_host"
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

func FindManySatuanKerja(name_satuan_kerja, limit, offset string) ([]SatuanKerja, error) {
	common := db.GetDB()
	var cok []SatuanKerja
	// var count int

	// offset_int, err := strconv.Atoi(offset)
	// if err != nil {
	// 	offset_int = 0
	// }
  //
	// limit_int, err := strconv.Atoi(limit)
	// if err != nil {
	// 	limit_int = 20
	// }

  // tx := common.Begin()
	// common.Model(&cok).Count(&count)
	// common.Offset(offset_int).Limit(limit_int).Find(&cok)
  var stker []SatuanKerja
  var b = common.Find(&stker)

  a, err := json.Marshal(b) //get json byte array
  fmt.Println(a)
  // common.Find(&cok)

	// err = tx.Commit().Error
	return cok, err
}

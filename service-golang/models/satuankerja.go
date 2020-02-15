package models

import (
  "time"
  "github.com/jinzhu/gorm"
  "github.com/satori/go.uuid"
)
type IndexPage struct {
	AllSatuanKerja []SatuanKerja
}

type SatuanKerjaPage struct {
	TargetSatuanKerja SatuanKerja
}

//satuan kerja models
type SatuanKerja struct {
  ID                uuid.UUID  `gorm:"type:uuid;primary_key;"`
	ParentID         	uuid.UUID	 `gorm:"type:uuid;null; json:"parent_id"`
	NameParent        string		 `gorm:"size:64" json:"name_parent"`
	NameSatuanKerja  	string		 `gorm:"size:64" json:"name_satuan_kerja, omitempty"`
	Description       string		 `gorm:"size:255" json:"description"`
  CreatedAt         *time.Time `json:"created_at"`
	CreatedBy         string		 `json:"created_by"`
  UpdatedAt         *time.Time `json:"updated_at"`
	UpdatedBy         string		 `json:"updated_by"`
}

type ErrorPage struct {
	ErrorMsg string
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *SatuanKerja) BeforeCreate(scope *gorm.Scope) error {
 uuid := uuid.NewV4()
 return scope.SetColumn("ID", uuid)
}

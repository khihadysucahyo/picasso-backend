package models

import (
  "time"
  "github.com/jinzhu/gorm"
  "github.com/satori/go.uuid"
)

//jabatan models
type Jabatan struct {
  ID                uuid.UUID     `gorm:"type:uuid;primary_key;"`
  SatuanKerja       *SatuanKerja  `gorm:"foreignkey:ID;"`
	NameJabatan  	    string		    `gorm:"size:64" json:"name_jabatan, omitempty"`
	Description       string		    `gorm:"size:255" json:"description"`
  CreatedAt         *time.Time    `json:"created_at"`
	CreatedBy         string		    `json:"created_by"`
  UpdatedAt         *time.Time    `json:"updated_at"`
	UpdatedBy         string		    `json:"updated_by"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *Jabatan) BeforeCreate(scope *gorm.Scope) error {
 uuid := uuid.NewV4()
 return scope.SetColumn("ID", uuid)
}

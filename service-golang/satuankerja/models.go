package main

import "time"

type IndexPage struct {
	AllSatuanKerja []SatuanKerja
}

type SatuanKerjaPage struct {
	TargetSatuanKerja SatuanKerja
}

//satuan kerja models
type SatuanKerja struct {
  id                 int
	parent_id          int
	nama_satuan_kerja  string
	deskripsi          string
	created_at         time.Time
	created_by         string
  updated_at         time.Time
	updated_by         string
}

type ErrorPage struct {
	ErrorMsg string
}

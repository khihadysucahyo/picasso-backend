package main

import (
	"fmt"
	"time"

	"github.com/lib/pq"
)

func createSatuanKerja(parent_id int, nama_satuan_kerja string, deskripsi int, created_at time.Time) (int, error) {
	//Create
	var satkerID int
	err := db.QueryRow(`INSERT INTO books(parent_id, nama_satuan_kerja, deskripsi, created_at) VALUES($1, $2, $3, $4) RETURNING id`, parent_id, nama_satuan_kerja, deskripsi, created_at).Scan(&satkerID)

	if err != nil {
		return 0, err
	}

	fmt.Printf("Last inserted ID: %v\n", satkerID)
	return satkerID, err
}

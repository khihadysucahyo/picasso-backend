package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type PostgresRepository struct {
	db *sql.DB
}

func PostgresConnect(url string) (*PostgresRepository, error) {
	db, err := sql.Open("postgres", url)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return &PostgresRepository{
		db,
	}, nil
}

func (r *PostgresRepository) Close() {
	r.db.Close()
}

package db

// import (
// 	"context"
//
// 	"github.com/jabardigitalservice/picasso-backend/service-golang/models"
// )

type Repository interface {
	Close()
	// InsertSatuanKerja(ctx context.Context, data models.SatuanKerja) error
	// ListSatuanKerja(ctx context.Context, skip uint64, take uint64) ([]models.SatuanKerja, error)
}

var impl Repository

func SetRepository(repository Repository) {
	impl = repository
}

func Close() {
	impl.Close()
}

// func InsertSatuanKerja(ctx context.Context, data models.SatuanKerja) error {
// 	return impl.InsertSatuanKerja(ctx, data)
// }
//
// func ListSatuanKerja(ctx context.Context, skip uint64, take uint64) ([]models.SatuanKerja, error) {
// 	return impl.ListSatuanKerja(ctx, skip, take)
// }

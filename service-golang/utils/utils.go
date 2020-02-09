package utils

import (
	"encoding/json"
	"net/http"
)


func ResponseOk(w http.ResponseWriter, body interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(body)
}

func ResponseError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	body := map[string]string{
		"error": message,
	}
	json.NewEncoder(w).Encode(body)
}

const (
    MethodGet     = "GET"
    MethodHead    = "HEAD"
    MethodPost    = "POST"
    MethodPut     = "PUT"
    MethodDelete  = "DELETE"
    MethodOptions = "OPTIONS"

    StatusOK                   = 200
    StatusCreated              = 201
    StatusAccepted             = 202
    StatusNonAuthoritativeInfo = 203
    StatusNoContent            = 204

    StatusBadRequest           = 400
    StatusUnauthorized         = 401
    StatusForbidden            = 403
    StatusNotFound             = 404
    StatusMethodNotAllowed     = 405
    StatusInternalServerError  = 500
)

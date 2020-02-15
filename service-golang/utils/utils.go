package utils

import (
	"encoding/json"
	"net/http"
	"log"
	"os"

	"github.com/joho/godotenv"
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


func GetEnv(key string) string {
  // load .env file
	switch godotenv.Load() {
	case godotenv.Load("../.env"):
		log.Println("Error loading .env file")
	case godotenv.Load("../../.env"):
		log.Println("Error loading .env file")
	}
  return os.Getenv(key)
}

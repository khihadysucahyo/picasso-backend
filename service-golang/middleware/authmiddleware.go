package auth

import (
    "log"
    "net/http"
    "os"

    "github.com/joho/godotenv"
    "github.com/auth0/go-jwt-middleware"
    "github.com/dgrijalva/jwt-go"
)


// AuthMiddleware is our middleware to check our token is valid. Returning
// a 401 status to the client if it is not valid.
func AuthMiddleware(next http.Handler) http.Handler {
    err := godotenv.Load("../../.env")
    if err != nil {
      log.Fatal("Error loading .env file")
  		godotenv.Load(".env")
    }
    SECRET_KEY := os.Getenv("SECRET_KEY")
    if len(SECRET_KEY) == 0 {
        log.Fatal("HTTP server unable to start, expected an APP_KEY for JWT auth")
    }
    jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
        ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
            return []byte(SECRET_KEY), nil
        },
        SigningMethod: jwt.SigningMethodHS256,
    })
    return jwtMiddleware.Handler(next)
}

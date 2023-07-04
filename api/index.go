package handler

import (
	"fmt"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	emailCookie, err := r.Cookie("email")
	if err != nil {
		fmt.Fprintf(w, "ERR")
		return
	}

	email := emailCookie.Value

	fmt.Fprintf(w, "<h1>Hello %s </h1>", email)
}

package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"text/template"
	"time"
)

func handleCreate(w http.ResponseWriter, r *http.Request) {
	var id = 0
	var err error

	r.ParseForm()
	params := r.PostForm
	idStr := params.Get("id")

	if len(idStr) > 0 {
		id, err = strconv.Atoi(idStr)
		if err != nil {
			renderErrorPage(w, err)
			return
		}
	}

	name := params.Get("nama_satuan_kerja")
	pagesStr := params.Get("pages")
	pages := 0
	if len(pagesStr) > 0 {
		pages, err = strconv.Atoi(pagesStr)
		if err != nil {
			renderErrorPage(w, err)
			return
		}
	}

	createdAtStr := params.Get("created_at")
	var createdAt time.Time

	if len(createdAtStr) > 0 {
		createdAt, err = time.Parse("2006-01-02", created_at)
		if err != nil {
			renderErrorPage(w, err)
			return
		}
	}

	if id == 0 {
		_, err = insertBook(parent_id, nama_satuan_kerja, deskripsi, created_at)
	} else {
		_, err = updateBook(id, parent_id, nama_satuan_kerja, deskripsi, created_at)
	}

	if err != nil {
		renderErrorPage(w, err)
		return
	}

	http.Redirect(w, r, "/", 302)
}

# Makefile — jednolity interfejs uruchamiania (make help listuje cele).
# Recepty MUSZĄ być wcięte TABEM. Statyczne portfolio (źródło bijoupath.com).
# CV PDF generowany z data.json przez WeasyPrint — wymaga bibliotek systemowych
# Pango/Cairo (na macOS: `brew install pango`). Deploy jest automatyczny
# (push na main → GitHub Pages); nie publikuj ręcznie.

VENV := .venv
PY := $(VENV)/bin/python

.DEFAULT_GOAL := help
.PHONY: help install build start clean

help:  ## Pokaż dostępne cele
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install:  ## venv + zależności generatora CV (jinja2, WeasyPrint)
	python3 -m venv $(VENV)
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r tools/cv-generator/requirements.txt

build:  ## Zbuduj Jan_Slezak_CV.pdf z data.json
	$(PY) tools/cv-generator/build_cv.py

start:  ## Podgląd strony lokalnie (http://localhost:8000)
	python3 -m http.server 8000

clean:  ## Usuń venv i podgląd CV
	rm -rf $(VENV) tools/cv-generator/podglad_cv.html

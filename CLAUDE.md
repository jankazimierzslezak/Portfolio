# CLAUDE.md

Wskazówki dla Claude Code przy pracy nad tym repozytorium. Pisz i komentuj
**po polsku** — trzymamy spójność językową.

## Czym jest projekt

Statyczne **portfolio — źródło strony `bijoupath.com`** (repo zdalne `Portfolio`,
hosting GitHub Pages, domena w pliku `CNAME`). Mimo że katalog leży lokalnie w
`archiwum/`, to **aktywnie wdrażana** wersja: push na `main` automatycznie buduje
CV i publikuje stronę (zob. `.github/workflows/deploy.yml`).

Stack: **czysty statyczny front** — HTML + CSS + JS, **bez frameworka i bez
`package.json`**. Treść sterowana danymi z `data.json`; CV (PDF) generowane z tego
samego `data.json` przez **Python + WeasyPrint**.

## Struktura

- `index.html` — strona.
- `css/style.css`, `js/script.js` — style i logika.
- `data.json` — **ŹRÓDŁO PRAWDY** treści: zasila stronę oraz generator CV
  (`personal` + lista `entries`: edukacja, staże, publikacje itd.).
- `tools/cv-generator/` — generator CV → `Jan_Slezak_CV.pdf` z `data.json`:
  `build_cv.py`, `template.html`, `requirements.txt` (WeasyPrint).
- `img/` — grafiki i zdjęcia; `Jan_Slezak_CV.pdf` — wygenerowane CV.
- `CNAME` — `bijoupath.com` (domena GitHub Pages).
- `.github/workflows/deploy.yml` — CI: build CV + deploy na GitHub Pages.

## Polecenia

Najwygodniej przez `make` (`make help` listuje cele). Natywnie:

```bash
# Podgląd lokalny (brak builda strony — to statyczne pliki):
python3 -m http.server --directory .                 # zob. też .claude/launch.json

# Generowanie CV (PDF) z data.json:
pip install -r tools/cv-generator/requirements.txt   # WeasyPrint
python tools/cv-generator/build_cv.py
```

- **Deploy:** automatyczny — push na `main` uruchamia `.github/workflows/deploy.yml`
  (buduje CV i publikuje całość na GitHub Pages). Nie publikuj ręcznie.

## Środowisko

Strona nie wymaga instalacji (brak `package.json`) — hook `SessionStart` jest tu
no-op. Generator CV wymaga Pythona + WeasyPrint (na Linuksie potrzebne biblioteki
systemowe Pango/Cairo — zob. `deploy.yml`).

## Konwencje

- Zmiany treści wprowadzaj w `data.json`, **nie** hardkoduj ich w HTML — to
  wspólne, spójne źródło dla strony i dla CV.

## Utrzymanie tego pliku

Żywa dokumentacja — aktualizuj, gdy zmienia się generowanie CV, deploy albo
struktura `data.json`.

## Git / PR

- Rozwijaj na wskazanym branchu, commituj opisowo.
- **Nie twórz PR-a, dopóki użytkownik wyraźnie nie poprosi.**

# Portfolio — źródło bijoupath.com

Statyczna strona (HTML/CSS/JS, bez frameworka) serwowana na GitHub Pages pod
domeną **bijoupath.com**. Treść strony oraz CV (PDF) pochodzą z jednego pliku
`data.json` (źródło prawdy).

## Szybki start

```bash
make start     # podgląd lokalny (http://localhost:8000)
make install   # venv + WeasyPrint (potrzebne do generowania CV)
make build     # zbuduj Jan_Slezak_CV.pdf z data.json
```

Deploy jest **automatyczny**: push na `main` buduje CV i publikuje stronę
(`.github/workflows/deploy.yml`) — nie publikuj ręcznie. Treść edytuj w
`data.json`. Szczegóły w [CLAUDE.md](CLAUDE.md); `make help` listuje cele.

"""
Builds Jan_Slezak_CV.pdf from the shared data.json (the single source of truth,
also consumed by the website). Run from anywhere in the repo:

    python tools/cv-generator/build_cv.py

On macOS WeasyPrint needs native libraries (pango/cairo/gobject) that are awkward
to install, so the canonical PDF is built on Linux in GitHub Actions on every push
(.github/workflows/deploy.yml). This script is the exact thing CI runs.
"""
import json
import os

from jinja2 import Template
from weasyprint import HTML

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))  # portfolio/

DATA_PATH = os.path.join(ROOT, "data.json")
TEMPLATE_PATH = os.path.join(HERE, "template.html")
OUTPUT_PATH = os.path.join(ROOT, "Jan_Slezak_CV.pdf")
PREVIEW_PATH = os.path.join(HERE, "podglad_cv.html")

# CV section order + which data.json `line` feeds each section heading.
SECTIONS = [
    ("education", "Education"),
    ("work", "Work Experience"),
    ("internships", "Internships"),
    ("publications", "Publications"),
    ("conferences", "Conferences"),
    ("courses", "Courses"),
]


def build_sections(data):
    """Group entries by line, newest first (standard CV ordering)."""
    by_line = {}
    for entry in data["entries"]:
        by_line.setdefault(entry["line"], []).append(entry)
    for items in by_line.values():
        items.sort(key=lambda e: e.get("date") or "", reverse=True)
    return [
        {"title": title, "entries": by_line.get(line, [])}
        for line, title in SECTIONS
    ]


def render(data):
    with open(TEMPLATE_PATH, encoding="utf-8") as f:
        template = Template(f.read())
    return template.render(personal=data["personal"], sections=build_sections(data))


def main():
    print(f"1. Wczytywanie danych: {DATA_PATH}")
    with open(DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)

    print("2. Renderowanie szablonu template.html")
    rendered_html = render(data)
    with open(PREVIEW_PATH, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    print(f"3. Generowanie PDF: {OUTPUT_PATH}")
    HTML(string=rendered_html, base_url=ROOT).write_pdf(OUTPUT_PATH)

    print("\n\U0001f389 Gotowe — CV zbudowane z data.json.")


if __name__ == "__main__":
    main()

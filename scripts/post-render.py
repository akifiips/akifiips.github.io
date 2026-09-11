"""Finalize Quarto HTML with shared navigation and a small, local search index."""
from pathlib import Path
from html.parser import HTMLParser
import json
import os
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist"


class ArticleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.in_title = False
        self.skip = 0
        self.title = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        if tag == "main":
            self.in_main = True
        if tag == "title":
            self.in_title = True
        if tag in ("script", "style"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False
        if tag == "title":
            self.in_title = False
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if self.skip:
            return
        if self.in_main:
            self.text.append(data)
        if self.in_title:
            self.title.append(data)


entries = []
for path in OUT.rglob("*.html"):
    content = path.read_text()
    # Resolve navigation in the HTML as well as JS: works with project subpaths,
    # custom domains, keyboard navigation, and scripts disabled.
    relative_root = os.path.relpath(OUT, path.parent).replace(os.sep, "/")
    content = re.sub(
        r'href="[^"]*" data-site-link="([^"]*)"',
        lambda m: f'href="{relative_root}/{m.group(1)}" data-site-link="{m.group(1)}"',
        content,
    )
    if "assets/site.js" not in content:
        content = content.replace("</body>", f'<script src="{relative_root}/assets/site.js"></script></body>')
    path.write_text(content)
    if "posts" in path.relative_to(OUT).parts:
        parser = ArticleText()
        parser.feed(content)
        entries.append({
            "title": " ".join(parser.title).strip(),
            "href": path.relative_to(OUT).as_posix(),
            "text": re.sub(r"\s+", " ", " ".join(parser.text)).strip(),
        })
(OUT / "search-data.json").write_text(json.dumps(entries, ensure_ascii=False))
(OUT / ".nojekyll").touch()
print(f"Prepared {len(entries)} article(s) for search.")

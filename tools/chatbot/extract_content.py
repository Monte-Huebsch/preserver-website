#!/usr/bin/env python3
"""
Extract chatbot knowledge-base chunks from the preserver.me static site source.

Reads directly from the HTML in this repo (source of truth) rather than the
live site, so it always reflects whatever is about to be deployed. Run this
any time site content changes (homepage, FAQ, use-case cards, or a new blog
post) and re-run embed_and_upsert.py afterwards to refresh the chatbot.

Usage:
    python3 tools/chatbot/extract_content.py

Output:
    tools/chatbot/chunks.json — a list of {id, url, title, text} chunks,
    ready for tools/chatbot/embed_and_upsert.py to embed and upload.
"""
import json
import re
import html
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "chunks.json"

chunks = []


MAX_CHUNK_CHARS = 900  # keeps chunks well under Vectorize's 10KiB metadata cap
# and inside the embedding model's effective context (~512 tokens) so the
# whole chunk actually gets embedded rather than silently truncated.


def add_chunk(chunk_id, url, title, text):
    text = re.sub(r"\s+", " ", text).strip()
    if not text or len(text) < 40:
        return
    if len(text) <= MAX_CHUNK_CHARS:
        chunks.append({"id": chunk_id, "url": url, "title": title, "text": text})
        return
    # Split long pages (homepage, blog posts) into sentence-packed chunks so
    # each one embeds cleanly and retrieval can point at a specific part of
    # the page rather than the whole thing.
    sentences = re.split(r"(?<=[.!?])\s+", text)
    part, buf = 1, ""
    for sentence in sentences:
        if buf and len(buf) + 1 + len(sentence) > MAX_CHUNK_CHARS:
            chunks.append({"id": f"{chunk_id}-{part}", "url": url, "title": title, "text": buf.strip()})
            part += 1
            buf = sentence
        else:
            buf = f"{buf} {sentence}".strip()
    if buf.strip():
        chunks.append({"id": f"{chunk_id}-{part}", "url": url, "title": title, "text": buf.strip()})


def main_text(path):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    main = soup.find("main") or soup.find("body")
    if not main:
        return ""
    for tag in main.find_all(["script", "style", "noscript", "iframe"]):
        tag.decompose()
    return main.get_text(" ", strip=True)


def page_title(path, fallback):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    t = soup.find("title")
    return t.get_text(strip=True) if t else fallback


# ---------------------------------------------------------------------------
# 1. Homepage — one chunk per section is overkill for a single page; the
#    whole page is short enough to embed as one chunk plus the comparison
#    table gets its own chunk since it's dense/tabular.
# ---------------------------------------------------------------------------
home = ROOT / "index.html"
if home.exists():
    add_chunk("home", "https://preserver.me/", page_title(home, "Preserver"), main_text(home))

# ---------------------------------------------------------------------------
# 2. FAQ — one chunk per question. The full FAQ page has faq-category /
#    faq-item / faq-q / faq-a structure.
# ---------------------------------------------------------------------------
faq_path = ROOT / "faq" / "index.html"
if faq_path.exists():
    soup = BeautifulSoup(faq_path.read_text(encoding="utf-8"), "html.parser")
    category = "General"
    idx = 0
    for el in soup.select(".faq-category, .faq-item"):
        if "faq-category" in el.get("class", []):
            category = el.get_text(strip=True)
            continue
        q = el.select_one(".faq-q")
        a = el.select_one(".faq-a")
        if not q or not a:
            continue
        idx += 1
        add_chunk(
            f"faq-{idx}",
            "https://preserver.me/faq/",
            f"FAQ — {category}: {q.get_text(strip=True)}",
            f"Q: {q.get_text(strip=True)} A: {a.get_text(strip=True)}",
        )

# ---------------------------------------------------------------------------
# 3. Use cases — 78 individual cards, parsed straight out of the
#    openModal(title, icon, category, description, bullets, blogUrl, blogTitle)
#    onclick calls, since that's the full per-card content (the visible card
#    text is just a one-line teaser). This is the content llms-full.txt is
#    missing — it only has the 6-category summary.
# ---------------------------------------------------------------------------
uses_path = ROOT / "uses" / "index.html"
if uses_path.exists():
    raw = uses_path.read_text(encoding="utf-8")
    # openModal('Title','icon','Category','Description text...','bullet1|bullet2|...','blogUrl','blogTitle')
    pattern = re.compile(
        r"openModal\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\)",
    )

    def unescape(s):
        s = s.replace("\\'", "'").replace('\\"', '"')
        return html.unescape(s)

    seen = set()
    for m in pattern.finditer(raw):
        title, icon, category, desc, bullets, blog_url, blog_title = (unescape(g) for g in m.groups())
        if title in seen:
            continue
        seen.add(title)
        bullet_list = [b.strip() for b in bullets.split("|") if b.strip()]
        text = f"{category} — {title}. {desc}"
        if bullet_list:
            text += " Typical uses: " + "; ".join(bullet_list) + "."
        if blog_url:
            text += f" Related article: {blog_title} (https://preserver.me{blog_url})."
        add_chunk(
            f"use-{re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')}",
            "https://preserver.me/uses/",
            f"Use case — {category}: {title}",
            text,
        )
    print(f"Extracted {len(seen)} use-case cards (expected 78)")

# ---------------------------------------------------------------------------
# 4. Blog posts — blog index (as an overview chunk) plus full text of every
#    post folder under blog/*/index.html.
# ---------------------------------------------------------------------------
blog_dir = ROOT / "blog"
if blog_dir.exists():
    blog_index = blog_dir / "index.html"
    if blog_index.exists():
        add_chunk("blog-index", "https://preserver.me/blog/", "Blog index", main_text(blog_index))
    for post_dir in sorted(blog_dir.iterdir()):
        post_path = post_dir / "index.html"
        if post_dir.is_dir() and post_path.exists():
            slug = post_dir.name
            add_chunk(
                f"blog-{slug}",
                f"https://preserver.me/blog/{slug}/",
                page_title(post_path, slug),
                main_text(post_path),
            )

print(f"Total chunks: {len(chunks)}")
OUT.write_text(json.dumps(chunks, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {OUT}")

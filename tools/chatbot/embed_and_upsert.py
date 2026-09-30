#!/usr/bin/env python3
"""
Embed chunks.json and upsert into the Cloudflare Vectorize index that backs
the preserver.me site chatbot (functions/api/chat.js).

Uses plain HTTPS calls to the Cloudflare REST API — no wrangler CLI, no
dashboard. Consistent with this repo's deploy rule (commit + push to GitHub
only); this script never touches the live deploy pipeline, it only refreshes
the chatbot's knowledge base.

One-time setup (only needs doing once, ever, unless the index is deleted):
    Create the Vectorize index matching wrangler.toml's index_name
    ("preserver-site-kb") with 768 dimensions / cosine metric, matching the
    @cf/baai/bge-base-en-v1.5 embedding model. See tools/chatbot/README.md
    for the exact one-time curl command.

Every time site content changes (homepage, FAQ, a use-case card, a new blog
post):
    1. python3 tools/chatbot/extract_content.py
    2. python3 tools/chatbot/embed_and_upsert.py

Requires two environment variables (never hardcode these):
    CLOUDFLARE_ACCOUNT_ID   — this project's account ID (74fb136f472fe07d29ccea9db9738a5f)
    CLOUDFLARE_API_TOKEN    — a token scoped to Workers AI (Read) + Vectorize (Edit)

Usage:
    CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... python3 tools/chatbot/embed_and_upsert.py
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

INDEX_NAME = "preserver-site-kb"
EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5"
EMBED_BATCH_SIZE = 20  # keep individual API calls small and reliable

HERE = Path(__file__).resolve().parent
CHUNKS_PATH = HERE / "chunks.json"

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")

if not ACCOUNT_ID or not API_TOKEN:
    sys.exit(
        "Missing CLOUDFLARE_ACCOUNT_ID and/or CLOUDFLARE_API_TOKEN environment variables.\n"
        "See the docstring at the top of this file for what's needed and why."
    )

API_BASE = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}"


def api_request(path, method="GET", body=None, content_type="application/json"):
    url = f"{API_BASE}{path}"
    data = None
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    if body is not None:
        if content_type == "application/json":
            data = json.dumps(body).encode("utf-8")
        else:
            data = body
        headers["Content-Type"] = content_type
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {path} -> HTTP {e.code}: {detail}") from None


def embed_batch(texts):
    result = api_request(f"/ai/run/{EMBEDDING_MODEL}", method="POST", body={"text": texts})
    if not result.get("success", True) and "result" not in result:
        raise RuntimeError(f"Embedding call failed: {result}")
    return result["result"]["data"]


def main():
    if not CHUNKS_PATH.exists():
        sys.exit(f"{CHUNKS_PATH} not found — run extract_content.py first.")
    chunks = json.loads(CHUNKS_PATH.read_text(encoding="utf-8"))
    print(f"Loaded {len(chunks)} chunks from {CHUNKS_PATH}")

    ndjson_lines = []
    for i in range(0, len(chunks), EMBED_BATCH_SIZE):
        batch = chunks[i : i + EMBED_BATCH_SIZE]
        vectors = embed_batch([c["text"] for c in batch])
        for chunk, vector in zip(batch, vectors):
            ndjson_lines.append(
                json.dumps(
                    {
                        "id": chunk["id"],
                        "values": vector,
                        "metadata": {
                            "url": chunk["url"],
                            "title": chunk["title"],
                            "text": chunk["text"],
                        },
                    }
                )
            )
        print(f"  embedded {min(i + EMBED_BATCH_SIZE, len(chunks))}/{len(chunks)}")
        time.sleep(0.2)  # be polite to the free-tier rate limit

    ndjson_body = ("\n".join(ndjson_lines) + "\n").encode("utf-8")

    # Vectorize's HTTP upsert endpoint expects a multipart/form-data upload
    # with the NDJSON as a file field named "vectors".
    boundary = "----preserverchatbotupload"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="vectors"; filename="vectors.ndjson"\r\n'
        f"Content-Type: application/x-ndjson\r\n\r\n"
    ).encode("utf-8")
    body += ndjson_body
    body += f"\r\n--{boundary}--\r\n".encode("utf-8")

    print(f"Upserting {len(ndjson_lines)} vectors into index '{INDEX_NAME}'...")
    result = api_request(
        f"/vectorize/v2/indexes/{INDEX_NAME}/upsert",
        method="POST",
        body=body,
        content_type=f"multipart/form-data; boundary={boundary}",
    )
    print("Done:", json.dumps(result.get("result", result), indent=2)[:500])


if __name__ == "__main__":
    main()

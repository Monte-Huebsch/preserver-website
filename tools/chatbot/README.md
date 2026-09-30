# Site chatbot (replaces Dante AI)

A self-hosted RAG chatbot for preserver.me, running entirely on Cloudflare
Workers AI + Vectorize — the same Cloudflare account that already hosts the
site. No third-party vendor sees visitor conversations, and the free tier
comfortably covers this site's traffic (10,000 Workers AI "neurons"/day,
resets daily).

## How it fits together

```
tools/chatbot/extract_content.py   → reads the HTML in this repo, writes chunks.json
tools/chatbot/embed_and_upsert.py  → embeds chunks.json, upserts into Vectorize
functions/api/chat.js              → the live chat endpoint (Pages Function)
assets/preserver-shared.js         → the chat widget UI, injected on every page
wrangler.toml                      → declares the Vectorize + Workers AI bindings
```

The widget calls `/api/chat`, which embeds the visitor's question, looks up
the closest-matching chunks in Vectorize, and asks a small instruct model to
answer using only that retrieved content (it's told not to invent pricing,
features, or claims that aren't in the retrieved text).

## ⚠️ Re-run this after ANY content change — this is not automatic

**The chatbot only knows what was last indexed. It does not re-read the live
site on its own.** If you edit the homepage, add/change a FAQ question, edit
a use-case card in `uses/index.html`, or publish a new blog post, the
chatbot will keep answering from the *old* content until you re-run:

```bash
python3 tools/chatbot/extract_content.py
CLOUDFLARE_ACCOUNT_ID=74fb136f472fe07d29ccea9db9738a5f \
CLOUDFLARE_API_TOKEN=<token scoped to Workers AI Read + Vectorize Edit> \
python3 tools/chatbot/embed_and_upsert.py
```

That's it — two commands, no wrangler, no dashboard. Do this as a normal
step whenever you change site copy, the same way you'd remember to update
`llms-full.txt`.

Requires `beautifulsoup4` for the extraction step (`pip install beautifulsoup4 --break-system-packages` if not already installed).

## One-time setup (only needed once, ever)

This has NOT been run yet as of the code being added to this repo — the
Vectorize index does not exist yet, so `/api/chat` will error until this is
done.

1. **Create a Cloudflare API token** scoped to:
   - Workers AI — Read
   - Vectorize — Edit
   (Account-scoped, same account as the existing `CLOUDFLARE_API_TOKEN`
   GitHub secret used for Pages deploys — but that token is scoped only to
   Pages, so this needs a separate token or a broadened one.)

2. **Create the Vectorize index** (768 dimensions, cosine metric — must
   match the `@cf/baai/bge-base-en-v1.5` embedding model used everywhere
   else in this pipeline):

   ```bash
   curl -X POST \
     "https://api.cloudflare.com/client/v4/accounts/74fb136f472fe07d29ccea9db9738a5f/vectorize/v2/indexes" \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"name":"preserver-site-kb","config":{"dimensions":768,"metric":"cosine"}}'
   ```

3. **Run the indexing pipeline** (see above) to populate it for the first
   time.

4. **Push to `main`** as normal — the existing GitHub Actions workflow
   (`.github/workflows/deploy.yml`) already runs `wrangler pages deploy`,
   which will pick up the `[[vectorize]]` and `[ai]` bindings from
   `wrangler.toml` automatically. No dashboard step needed.

After that one-time setup, the only ongoing task is the two-command
re-index above, whenever content changes.

## Model choices

- Embeddings: `@cf/baai/bge-base-en-v1.5` (768-dim, used identically by both
  the offline indexing script and the live chat endpoint — these must always
  match or retrieval breaks).
- Chat/answer generation: `@cf/meta/llama-3.2-3b-instruct` (small, cheap,
  Cloudflare-recommended for RAG-style grounded Q&A). Can be swapped for a
  larger model in `functions/api/chat.js` if answer quality needs it — cost
  impact is still tiny at this site's traffic.

## What's indexed (as of this writing)

150 chunks: homepage, the full FAQ (one chunk per question), all 78
individual use-case cards (parsed from the `uses/index.html` modal data —
this is the content `llms-full.txt` doesn't have; that file only has a
6-category summary), and every blog post. Long pages are split into
~900-character chunks so retrieval can point at the specific relevant part
of a page rather than the whole thing.

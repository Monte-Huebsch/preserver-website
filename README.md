# preserver.me — website source

This repository is the static source for [preserver.me](https://preserver.me), the marketing site for the Preserver mobile app. It was assembled by mirroring the live production deployment so this project finally has a version-controlled source of truth.

## What's in here

- Root pages — `index.html`, plus SEO/config files (`sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, `BingSiteAuth.xml`).
- `assets/` — shared stylesheet (`style.css`) and shared JS (`preserver-shared.js`) that injects the nav, footer and cookie banner on every page.
- `blog/` — blog index plus one folder per post.
- `contactus/`, `faq/`, `uses/` — standalone pages.
- `legals/` — privacy, terms, cookies, EULA, disclaimer.
- `white-labeling/` — the white label / enterprise page.
- `ai/` — placeholder page (currently a stub redirect to the homepage; not yet built out).
- `media/uses/` — sales collateral: a PDF carousel and a short demo video for each of ~70 industry verticals. This is a sizeable binary folder (~170MB) — be mindful of that if you fork or clone frequently on a slow connection.
- `wp-content/uploads/2024/01/` — legacy favicon paths kept for compatibility with existing `<link rel="icon">` references.

## How the site works

There's no build step. Every page is plain HTML that loads `/assets/style.css` and `/assets/preserver-shared.js?v=10` at the bottom of `<body>`. The shared JS injects the `<header>`/nav, `<footer>`, and cookie banner into every page at runtime, so the nav only needs to be edited in one place (`assets/preserver-shared.js`) to change it site-wide.

## Deployment

The live site runs on Cloudflare Pages (project name `preserver-me`, custom domain `preserver.me`). This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys to Cloudflare Pages automatically on every push to `main`, using Wrangler.

To enable it, add two repository secrets under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` — a Cloudflare API token scoped to Cloudflare Pages edit permissions for this account.
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID this project lives under.

Once those are set, pushing to `main` will deploy through this pipeline instead of manual/direct uploads.

## Notes

- This is proprietary content for the Preserver product — not an open source project. All rights reserved.
- The contact form on `/contactus/` posts to a `formsubmit.co` endpoint configured with this project's contact email — that's set in the page HTML itself, not as a secret.

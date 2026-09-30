# Social profile consistency rollout — status

Internal tracking notes for the PostEverywhere destination-page rollout (avatars, bios,
and adding Threads to the daily distribution). Not part of the live site — just a shared
record so anyone picking this up knows what's done and what's still needed from Monte.

_Last updated: 2026-09-30_

## Approved design

- Universal avatar: a new simple orange life-ring icon (`#FF4500`), derived from the
  site's existing `assets/preserver-icon.png`, recolored and padded 9% on a white
  background — but **only on brand-identity pages** (Facebook Page, Instagram, Threads).
- LinkedIn, X and YouTube are **personal-identity** accounts. LinkedIn's own upload
  dialog states "we require members to use their real identities" — so Monte's real
  photo was kept as-is on LinkedIn, X, and YouTube. Only bios/descriptions were rewritten
  there.
- Pricing wording standardized everywhere to match the site exactly: "Free to capture,
  AI-ready exports free during beta — beta users keep them free."

## Done

| Platform | Avatar | Bio/description | Notes |
|---|---|---|---|
| Facebook Page | ✅ new orange icon | ✅ rewritten | Verified live |
| LinkedIn (linkedin.com/in/preserver/) | Kept (real photo) | ✅ new headline + About | |
| X (@MonteHuebsch) | Kept (real photo) | ✅ new 159-char bio | Free-tier 160-char bio cap |
| YouTube (@MonteHuebsch) | Kept (real photo) | ✅ new channel description | Also fixed a stale "Observer App" / 0bserver-app.com link → "Preserver" → https://preserver.me |

## Blocked — needs Monte to act

- **TikTok (@monteh03)** — the Chrome session used for this rollout is not logged into
  TikTok directly (only posts via PostEverywhere's own API connection, which can't edit
  profile bio/avatar). Needs Monte to log into TikTok in that browser, then:
  - Avatar → new orange icon
  - Bio → "Capture real-world proof. AI-ready exports. Free to capture, in beta 🚀"
- **Instagram (@preserver.me)** — same issue; only Monte's personal "monte344" account is
  logged in. Meta requires editing @preserver.me's own profile fields directly on
  Instagram (not via the linked Facebook Page). Needs Monte to log into @preserver.me
  directly, then:
  - Avatar → new orange icon
  - Bio → "📍 Capture the real world, export AI-ready data\n🎙️📸🎥📝 auto time+GPS stamped\nFree to capture · AI exports free in beta"
  - Also fix a stray/unset pronoun field noted during the original audit

## Pending — Threads

- Sent Monte a PostEverywhere OAuth connect link (`create_connect_link`, platform
  `threads`) on 2026-09-30 to approve in any browser (10-min expiry).
- Once connected (check `mcp__Post_Every_Where__list_accounts`):
  1. Set avatar (new orange icon) and bio (same as the Instagram bio above).
  2. Add the new Threads `account_id` into the daily/rotating QT-series post
     distribution alongside the existing 6 accounts (LinkedIn 5284, YouTube 5285,
     X 5286, TikTok 5287, Facebook 5288, Instagram 5289) — via future
     `bulk_create_posts`/campaign `account_ids` arrays.

## Other flagged, not yet approved

- Facebook Page cover photo still shows a stale old banner ("A new, FREE app on both
  iOS and Android... Your Diary. Your Journal.") from the original 6-page audit — not
  part of the approved change set, worth raising again if revisited.

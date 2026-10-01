# Social profile consistency rollout — status

Internal tracking notes for the PostEverywhere destination-page rollout (avatars, bios,
and adding Threads to the daily distribution). Not part of the live site — just a shared
record so anyone picking this up knows what's done and what's still needed from Monte.

_Last updated: 2026-10-01_

## Approved design

- Universal avatar: a new simple orange life-ring icon (`#FF4500`), derived from the
  site's existing `assets/preserver-icon.png`, recolored and padded 9% on a white
  background — but **only on brand-identity pages** (Facebook Page, Threads).
- LinkedIn, X, YouTube, and **Instagram (monte344)** are **personal-identity**
  accounts. LinkedIn's own upload dialog states "we require members to use their real
  identities" — so Monte's real photo was kept as-is on all four. Only bios/
  descriptions were rewritten there.
- Pricing wording standardized everywhere to match the site exactly: "Free to capture,
  AI-ready exports free during beta — beta users keep them free."

## Done

| Platform | Account | Avatar | Bio/description | Notes |
|---|---|---|---|---|
| Facebook Page | Preserver.me LLC (id 5288) | ✅ new orange icon | ✅ rewritten | Verified live |
| LinkedIn | linkedin.com/in/preserver/ (id 5284) | Kept (real photo) | ✅ new headline + About | |
| X | @MonteHuebsch (id 5286) | Kept (real photo) | ✅ new 159-char bio | Free-tier 160-char bio cap |
| YouTube | @MonteHuebsch (id 5285) | Kept (real photo) | ✅ new channel description | Also fixed a stale "Observer App" / 0bserver-app.com link → "Preserver" → https://preserver.me |
| Instagram | **@monte344** (id 9904, reconnected 2026-10-01) | Kept (real photo) | ✅ new 3-line bio (📍/🎙️📸🎥📝/pricing) | Plan changed: posting switched from the old disused @preserver.me account to Monte's own active @monte344 account — see "Instagram pivot" below |
| Threads | **@theobserverapp → renamed "Preserver"** (id 9903, connected 2026-10-01) | ✅ new orange icon | ✅ new 3-line bio (same copy as Instagram) | Account rebranded in place — see "Threads" below |

### Instagram pivot (2026-10-01)

The original plan was to edit the long-dormant `@preserver.me` Instagram account directly.
Monte was only ever logged into his personal `@monte344` account in the browser, so the
plan changed: **PostEverywhere's Instagram posting connection was switched from
`@preserver.me` (id 5289) to `@monte344` (id 9904)** via a fresh OAuth connect link, and
`@monte344`'s bio was rewritten to the approved Preserver copy. Per Monte's choice,
`@monte344` keeps its real photo (treated as a personal-identity account, like LinkedIn/
X/YouTube) rather than switching to the orange icon.

The old `@preserver.me` connection (id 5289) is still listed as connected in
PostEverywhere (no API way to disconnect it from here) but should **not** be used in the
daily/rotating distribution going forward — use 9904 instead. Monte may want to manually
disconnect 5289 in the PostEverywhere app at some point to avoid confusion.

### Threads (2026-10-01)

The Threads OAuth connect link ended up authorizing an old, already-existing account
(`@theobserverapp`, "Observer App" branding, generic anonymous avatar, 2 followers,
old legacy posts) rather than a fresh Preserver-branded account. Monte confirmed he
wants to keep and rebrand this account rather than reconnect a different one. Rebrand
completed directly on threads.com:

- Display name: "Observer App" → **"Preserver"** (username stays `theobserverapp` —
  Threads usernames are tied to the linked Instagram account and aren't independently
  editable from this screen)
- Bio: added the same 3-line Preserver bio used on Instagram
- Avatar: new orange life-ring icon

Old legacy posts from the "Observer App" era are still present on the account's thread
history — not removed (out of scope of this rollout; flag if Monte wants them cleaned up).

## Blocked — needs Monte to act

- **TikTok (@monteh03, id 5287)** — the Chrome session used for this rollout is not
  logged into TikTok directly (only posts via PostEverywhere's own API connection,
  which can't edit profile bio/avatar). Needs Monte to log into TikTok in that browser,
  then:
  - Avatar → new orange icon
  - Bio → "Capture real-world proof. AI-ready exports. Free to capture, in beta 🚀"

## Daily/rotating distribution — DONE (2026-10-01)

Monte confirmed he's happy with the Instagram/Threads changes above. All 73 already-
scheduled QT-series posts (through 2026-10-25) were updated via `update_post`:

- `account_ids`: old Instagram 5289 swapped for **9904** (monte344), **9903** (Threads)
  added — now LinkedIn 5284, YouTube 5285, X 5286, TikTok 5287, Facebook 5288,
  Instagram 9904, Threads 9903 on every post.
- Added a `platform_content.threads` override to each post with the same UTM
  convention as the other platforms (`utm_source=threads&utm_medium=social&utm_campaign=qt-video-series&utm_content={slug}`).
  Confirmed this merges into the existing per-platform overrides rather than
  replacing them.
- Verified via `list_posts_advanced`: 0 scheduled posts remain on account 5289; all 73
  now include account 9903.

## Other flagged, not yet approved

- Facebook Page cover photo still shows a stale old banner ("A new, FREE app on both
  iOS and Android... Your Diary. Your Journal.") from the original 6-page audit — not
  part of the approved change set, worth raising again if revisited.
- Threads account carries old "Observer App"-era posts in its history — not cleaned up,
  flag if Monte wants them removed.

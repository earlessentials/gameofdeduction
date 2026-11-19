# DEDUCE

A bilingual English / Bahasa Indonesia detective game using the requested palette:
`#000000` · `#1F1A38` · `#1453A2` · `#8D5499` · `#FBEEF5`.

Twenty-four cases: eighteen standalone investigations across three volumes and six sequential episodes in THE HOLLOW NETWORK. Includes 378 inspectable records, 399 case deductions, four cross-episode challenges, and 168 investigation scenes. Original vector scene illustrations and character portraits are embedded in the UI. All directional arrow decorations have been removed.

## Runtime

A dependency-free Cloudflare Worker serves the interface and protected gameplay endpoints. Cloudflare D1 stores anonymous investigator profiles and separate investigation attempts. A revision-based atomic update enforces at most two active investigations even under concurrent requests. Answer keys, solutions, future evidence and interview responses remain on the server until authorized by progression.

Players choose five A–Z letters; the server assigns three distinct digits. A unique eight-character player ID reopens the same saved investigator from another device without a password. A persistent HttpOnly, SameSite cookie holds a separate device session. Existing anonymous profiles can claim an ID without losing attempts. Sign-in is rate limited. Hosting access remains separate and restricted. PEARL777 is reserved for the owner through the secret control room.

## Develop

Requires Node.js 24 (built-in SQLite for preview) and Python 3 only when regenerating authored case data.

```sh
python3 worker/content/build.py
node scripts/assemble.mjs
node scripts/preview.mjs
```

Open http://127.0.0.1:4317. Local SQLite data is in ignored `.local/preview.sqlite`. Local preview applies the initial migration only to a new local database. Production migrations are applied by Sites during publication.

## Validate and build

```sh
node scripts/assemble.mjs
node tests/game.mjs
node tests/http.mjs
node tests/ui.mjs
node tests/network.mjs
node tests/accounts.mjs
bash scripts/build.sh
node scripts/validate-artifact.mjs
```

Content tests check counts, complete translations, four-option questions, answer keys, reachable evidence references, unlocked stages and 24 full journeys. HTTP tests exercise concurrent active-case creation against SQLite, persistence, investigator isolation and cross-origin rejection. Browser verification covered onboarding, personalized bureau, evidence viewing and pinning, checkpoint submission, EN/ID switching, progress after refresh, notebook autosave, and the mobile workspace.

## Source map

- `worker/content/build.py`: bilingual authored case source and canonical solutions.
- `worker/content.json`: generated server-only content.
- `worker/page.html`: responsive UI, illustrations and client interactions.
- `worker/server.js`: state transitions, authorization and D1 HTTP adapter.
- `worker/index.js`: assembled deployment source; regenerate after edits.
- `drizzle/0000_archive.sql`: D1 schema migration.
- `.openai/hosting.json`: Site identity and DB binding.

Scores start at 100. Each incorrect answer costs 3 and each new hint costs 4, with a floor of zero. Re-reading a hint is free. Archiving retains progress; replay creates a separate attempt and preserves the earlier report. Completing the six cases in any volume unlocks that volume’s downloadable PNG certificate. The active-case limit applies globally across all volumes and the special edition.

Editorial scientific-review notes remain in CONTENT-REVIEW.md. External Google Fonts are optional enhancements; local serif, sans-serif and monospace fallbacks remain available.

## New volumes

Volume II — The Anatomy of Truth (007–012) and Volume III — The Unseen Patterns (013–018) each add six complete bilingual mysteries. Dedicated instruments cover temporal reconstruction, eyewitness geometry, manuscript versions, choice framing, testimony relations, forensic custody, radio samples and bearings, victim/document networks, dispatch systems, dual identities, administrative discrepancies and historical archives. Instrument selection and safe simulation responses are saved in the existing attempt JSON; no database migration is necessary.

`worker/content/volume2.py`, `volume3.py`, `volume2-distractors.py`, and `tool-checkpoints.py` are authoring inputs executed by `build.py`. The SVG and tool source helpers are embedded in `worker/page.html`; when updating them, also update their embedded definitions. `CONTENT-REVIEW.md` records source checks, specialist-review limits and canonical mechanisms.

## The Hollow Network

Episodes 019–024 unlock sequentially after a completed predecessor. Each completion reveals an intelligence node. Four cross-episode deductions, revisable connection ratings, and all original answers persist in the profile JSON. The finale requires review of the first five nodes and the four established connections, then eight ordered reconstruction answers. Completion reveals a declassification report and separate network/domain scores. No schema migration is required.

`worker/content/hollow.py` authors the cases and network challenges; `polish.py` keeps player-facing wording in-universe; `worker/network-engine.js` controls board authorization and history.

## Accounts and owner metrics

The append-only 0001 migration adds player accounts, device sessions, sign-in rate limits and last-seen tracking. Returning sign-in uses the complete ID as an access credential; there is no email/password recovery. Ordinary suffixes use three distinct digits; there are 720 available IDs per letter prefix. Database uniqueness and one atomic assignment query handle concurrent registration.

The unlisted `/control-room` requires a secret fragment link, authenticated against `OWNER_DASHBOARD_KEY` stored as a secret runtime variable. No owner secret is committed or included in the application bundle. The dashboard reports aggregate profiles, registered accounts, players with investigations, online within five minutes, active within 24 hours, and per-case distinct players/attempts/completions. A visible named game page sends a heartbeat every minute. Counts describe accounts and profiles, not verified individual people. The dashboard can link the owner's current investigator to reserved ID PEARL777 without changing progress.

## UI/UX refinement (3 November 2026)

The design system lives in `worker/ui.css` and is embedded by `scripts/assemble.mjs`. `worker/page.html` owns the bilingual component templates and browser interactions. The homepage previews the original six cases and links to the full 24-case archive. A standalone mini-investigation works without a named profile. Selected-case onboarding leads into the chosen file. The bureau separates active, archived and completed files.

The workspace adds a grouped evidence archive, inline source viewer, source comparison, text size control, recent records, up to 30 source-validated highlights, and mobile Evidence/Notebook/Deduction views. `recentEvidence` and `highlights` are optional attempt-JSON fields; no schema migration. Notes are flushed before navigation or game actions. Existing keys, attempts, credentials, questions, scoring and unlock rules remain unchanged.

`worker/public-pages.js` serves crawler-readable public summaries, individual `/cases/001`–`/cases/024` URLs, canonical metadata, JSON-LD, robots.txt, sitemap.xml and a PNG social card. Hash links remain supported. `worker/social-card.png` is a committed asset; regeneration is optional and uses Pillow via `scripts/make-social-card.py`. The bare-domain redirect runs when that hostname reaches this Worker; its DNS must be connected separately.

See `docs/UI-UX-AUDIT.md` for prioritized findings and `docs/UI-UX-REPORT.md` for implementation details and verification limits. Run `node tests/refinement.mjs` alongside the existing suites.

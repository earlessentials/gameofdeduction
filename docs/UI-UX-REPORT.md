# DEDUCE UI/UX implementation report

3 November 2026 · Site: https://www.deduce.my.id/

## Completed changes

- Replaced accumulated CSS overrides with a single token-based midnight-purple design system: 16px body text, 17px evidence text, restrained borders, consistent cards/controls, rounded action buttons, visible focus, reduced motion and 44px touch targets.
- Kept the existing headline and investigative illustration; clarified the 24-case gameplay, added a three-step explanation, recommended case, original-volume preview, no-account mini-investigation, difficulty guide and final call to action.
- Added a sticky, labeled navigation system and mobile menu. Case links have real URLs; ordinary Back/Forward history works.
- Standardized all case cards with discipline, difficulty, premise, reviewed counts, active phase and explicit open/resume/report actions. Added search, edition/difficulty filters and an empty-state reset.
- Rebuilt My Investigations around active, archived and completed work. Kept the two-active-case rule, archive/resume and completed reports.
- Preserved the selected case through player-ID registration. Returning IDs, chosen names, language preferences and existing accounts remain supported.
- Added grouped evidence navigation, recent sources, an inline readable viewer, text enlargement, pinning, two-source comparison, notebook highlights, mobile workspace views, and persistent selected-document keys.
- Prevented debounced notebook drafts from disappearing during language switches or navigation. Server validation accepts only highlights from inspected evidence and limits their size/count.
- Improved selected answers, source-linked correct feedback, current/completed/locked phase labels, case closure, decisive-deduction review and a spoiler-free 1200×630 completion-card preview with PNG download/save support.
- Added server-rendered public case summaries, case-specific titles/descriptions/canonicals, JSON-LD, Open Graph metadata with PNG artwork, robots.txt and sitemap.xml. Existing hash links still work.
- Aligned the private control room's surfaces and reading colors. Its secret, protected analytics endpoints and access behavior were preserved.

## Main files/components

| File | Responsibility |
|---|---|
| `worker/ui.css` | Central design tokens, responsive layout, evidence presentation and accessibility states |
| `worker/page.html` | Navigation, homepage, catalogue, onboarding, bureau, workspace, comparison, preview, reports and history |
| `worker/server.js` | Validated optional recent-evidence/highlight state; public response routing |
| `worker/public-pages.js` | Public rendering, metadata, robots, sitemap, image endpoint and bare-domain redirect |
| `worker/social-card.png` / `scripts/make-social-card.py` | Social preview asset and optional authoring script |
| `worker/owner.html` | Control-room visual alignment |
| `scripts/assemble.mjs` | CSS, public-renderer and asset embedding |
| `tests/ui.mjs` / `tests/refinement.mjs` | Localized render coverage and new interaction/public-route checks |

`worker/index.js` and deployment output are generated. No case narratives, answers, evidence IDs, credentials or schema migrations changed.

## Functional verification

All existing game, network, HTTP, account and UI suites passed. Coverage includes 24 full bilingual journeys, six serialized episodes, hidden-solution protection, sequential stages, concurrent two-case enforcement, account return across devices, legacy progress claims, owner-only analytics, PEARL777 reservation and unique account suffixes.

New checks passed for recent evidence, supported/unsupported highlight validation, note preservation during pin/highlight changes, draft flush before navigation, selected-case onboarding, archive search/empty states, localized preview/reading tools, public summaries without spoilers, case metadata, sitemap, robots, PNG response and redirect response.

A real in-app browser journey registered a fresh local test account from Case 002, opened its selected case, examined all ten records, questioned every available character, answered all eleven deductions, advanced every stage, completed the case at 100/100, and revisited its report. Notes survived an immediate language switch; pinned records survived refresh. Comparison, mobile tabs, history Back and the completion-image preview were checked. The preview image rendered at 1200×630 with title/status/score only.

Homepage, catalogue and workspace were measured at 320, 375, 390, 430, 768, 1024, 1280 and 1440px: no horizontal overflow. Catalogue columns were one on phones, two on tablet and three on larger desktops. Major text-token pairs meet 4.5:1 contrast. Focus, radio semantics, dialog labels, announcements and reduced-motion rules were improved. No new runtime errors appeared in the checked browser logs.

## Remaining limits and next checks

- Browser checks used the available in-app browser. Separate Chrome, Safari, Firefox, Edge, physical iPhone Safari and Android Chrome runs remain recommended; they were not simulated or claimed complete.
- This is not a formal WCAG certification or measured Core Web Vitals audit. Next: device/screen-reader testing and Lighthouse/field performance measurements.
- `www.deduce.my.id` responded successfully. `deduce.my.id` did not resolve during the external check. The Worker redirect is implemented/tested, but the bare hostname needs DNS/hosting connection before that redirect can run.
- Canvas image preview was verified. Automated download-event observation was unavailable in the in-app browser; the card therefore also offers a visible image and mobile save-image instructions.
- Audio/scene diagrams remain backed by readable text. Existing illustrations were retained; richer photographic evidence would require separately authored assets and clue-level review.
- Player IDs remain passwordless access credentials by design. No account recovery system was added in this refinement.

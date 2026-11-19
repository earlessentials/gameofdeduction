# DEDUCE refinement audit

Scope: all 24 existing cases, accounts, Hollow Network, owner dashboard. The brief's six-case references describe the original volume; later volumes remain available. Narrative, answers, evidence identifiers, unlock rules, scores and existing storage keys are preserved.

## Prioritized findings

| Priority | Routes/components | Finding and planned correction |
|---|---|---|
| P1 | Case detail, onboarding | Selected case is lost when anonymous players register. Preserve intent and open that case after registration. |
| P1 | Workspace, evidence modals | Small text and repeated modal opening interrupt source comparison. Add an inline evidence viewer and a grouped archive; retain modal access where useful. |
| P1 | Mobile header/workspace | Navigation disappears, stages scroll horizontally, and all panels stack. Add an accessible menu and Evidence/Notebook/Deduction views. |
| P1 | Notebook/navigation | Debounced text can be lost during a rapid action or language switch. Flush drafts before actions/navigation and retain local drafts until saved. |
| P1 | Global typography | Metadata and supporting text frequently use 8–12px. Establish readable tokens, comfortable line lengths and 44px touch targets. |
| P2 | Homepage | Full 24-case catalogue dominates discovery; primary action opens the bureau instead of a selected investigation. Add a recommended first case, original-volume preview, optional no-account mini-case and difficulty guide. |
| P2 | Catalogue | Cards lack explicit actions/current phase. Add consistent progress, resume/report actions, search, empty states and accessible filter selection. |
| P2 | Global styles | Successive CSS overrides duplicate visual rules and vary radii. Replace with one token-based stylesheet and restrained purple surfaces. |
| P2 | Routing/SEO | replaceState prevents ordinary Back history; hash-only cases have identical metadata; robots/sitemap return app HTML. Preserve hash links, add history handling, crawlable case URLs, server-rendered public summaries and real metadata endpoints. |
| P2 | Evidence organization | Notes/pins persist; recent files and highlights do not exist. Add bounded optional fields to existing attempt JSON, validated server-side. No schema migration. |
| P3 | Completion | Resolution exists but has limited orientation. Improve hierarchy, decisive-deduction review and a downloadable spoiler-free completion card. |
| P3 | Accessibility | Small targets, weak metadata contrast and incomplete motion/menu semantics. Improve contrast, labels, radio states, focus, dialog return focus and reduced-motion support. |

## Preservation boundaries

No case content regeneration, new question answers, score changes, account credential changes, or database migration. New highlights/recent-file fields are optional additions to stored attempt JSON; old attempts remain valid. Public summaries include only catalogue metadata, never evidence bodies or answer keys. Analytics remain protected by the existing owner secret.

## QA plan

Run existing 24-case gameplay, network, account, concurrency/isolation and localized UI checks. Extend tests for draft preservation, onboarding intent, preview reasoning, source highlighting validation, public rendering, metadata and route history. Inspect available browser at 320, 375, 390, 430, 768, 1024, 1280 and 1440px. Report browser-engine/device coverage honestly; no claim of a formal WCAG audit or measured Core Web Vitals without matching evidence.

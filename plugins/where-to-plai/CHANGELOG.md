# Changelog

All notable changes to the **where-to-plai** plugin are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- **Worksheet view**, temporarily. Anthropic's plugin directory currently accepts from community plugins only Markdown, text, JSON, YAML and common image files, so its Python renderer, templates, styles and fonts (and the licenses of the bundled Jinja2, MarkupSafe, Bootstrap and Open Sans) are out. We are working on bringing it back.
- **Pre-built workflow scripts** (`workflows/wf-*.js`): the directory accepts workflow scripts only from Verified organizations. Each workflow now ships as a Markdown blueprint (see Changed); we are working on bringing the scripts back.

### Changed
- Market research (Tier 3), the advisory board and customer discovery now ship their workflow as a Markdown **blueprint** (`references/workflow-blueprint.md` in each skill). In Claude Code, Claude writes the workflow from the blueprint and runs it; elsewhere the skills fall back to subagents as before. The market-research verification now uses three lens agents that each check all figures, instead of three agents per figure.
- Skill and agent frontmatter written the way the directory reads it: `argument-hint` values and skill descriptions are in double quotes (trigger phrases inside a description now use single quotes), and `tools` is a comma-separated string.
- CI: a new check enforces the directory's file rules (file types, no `#!`, plain-text and correctly quoted frontmatter); the render test and the workflow-script syntax check are gone.
- `plugin.json` now sets `icon`, so the directory listing shows the Where to Play logo (the file was in the plugin since 1.0.0 but nothing pointed to it).
- Docs, READMEs, `NOTICE.md`, `PRIVACY.md`, `SECURITY.md` and the GitHub templates updated accordingly.

## [1.0.4] — 2026-11-02

README correction.

### Changed
- READMEs: the status line no longer calls the `persona-*` agents part of the advisory board. The board is the four `advisor-*` agents plus the Score Examiner; the personas are separate optimist/skeptic debate lenses.

## [1.0.3] — 2026-11-02

Repository checks only; the plugin itself is unchanged.

### Changed
- CI: three more checks — Anthropic's directory validation (`claude plugin validate --profile directory --strict`), a render test of the worksheet view under Python 3.9 and 3.13, and a version-consistency check that also runs on release tags.

## [1.0.2] — 2026-11-02

Repository set up as a maintained project rather than a community open-source project.

### Changed
- Removed the Code of Conduct. `CONTRIBUTING.md` is now a short page: feedback and bug reports as issues, pull requests after agreeing on them in an issue, and the rights contributors grant the authors. The build, check and release guide moved to `docs/development.md`.
- READMEs: the "Contributing" section is now "Feedback".
- Docs brought in line with the plugin after a full read-through: agent count and grouping, the `--plugin-dir` path (the plugin subfolder), the advisory board's `board` option (a subset of the five; no "full" option), the market-research tiers and the three-lens number check, the customer-discovery fallback, `worksheet-view` running outside Claude Code, the technology-push entry point, and the changelog's location. `PRIVACY.md` states more precisely that the plugin sends nothing on its own.
- CI runs on `main` and `next` (the old `master` trigger is gone).

## [1.0.1] — 2026-11-02

Listing links and a lighter worksheet view, after the first directory scan.

### Added
- `PRIVACY.md`: the plugin collects, stores and sends no personal data; web research runs through Claude's own tools. `plugin.json` links it as `privacyPolicyUrl`, links the usage guide as `documentationUrl`, and the authors' terms on wheretoplay.co as `termsOfServiceUrl`, so all three show on the directory listing.

### Changed
- READMEs: the credit line links Jörg Müller's website and GitHub handle.
- `worksheet-view`: dropped the legacy Open Sans font formats (`.eot` for old Internet Explorer, SVG fonts for old iOS). The pages keep WOFF2, WOFF and TrueType and look the same.

## [1.0.0] — 2026-11-02

First public release, prepared for Anthropic's plugin directory.

### Changed
- License: CC BY-NC-SA 4.0 for the whole plugin, the same license as the framework on wheretoplay.co, replacing the MIT placeholder. `NOTICE.md` states what the authors expressly permit (use in your own work, also inside companies and in paid teaching or consulting) and what needs their permission (selling the plugin or offering it as a paid product or service). The worksheet view's web-app design is © the authors, included with permission; Bootstrap (MIT) and Open Sans (Apache-2.0) ship with their license texts.
- `worksheet-view`: the renderer runs with plain Python 3.9 or newer and needs nothing installed. Jinja2 3.1.6 and MarkupSafe 3.0.4 ship unmodified in `renderer/_vendor/` (BSD-3-Clause). The stylesheet is split into readable `bootstrap.css` and `app.css`; the rendered pages look the same.
- README: new sections on what the plugin runs, reads and writes, example prompts, and troubleshooting. `SECURITY.md` and the status notes describe version 1.0.
- `where-to-play`: the opening orientation now mentions in a sentence or two that helpers are on hand, among them the five-member advisory board, so the team knows they can call on it later.

Versions before 1.0.0 were developed in a private repository; their tags are not part of this one.

## [0.2.3] — 2026-10-29

### Changed
- Attractiveness Map zones, per the authors' answer: the scale has seven steps (Low · Low–Mid · Mid · Mid–High · High · High–Super High · Super High) and the map's midline sits at Mid–High. Low to Mid counts as low, High to Super High as high, so Mid Potential with High Challenge is plainly Questionable. Only an overall Mid–High lands on the line between two zones; Claude then names both instead of forcing one. Updated in the `attractiveness-map` skill and references, both Worksheet 2 templates, the glossary and the docs.

### Fixed
- `revisit`: the Assumption Map's evidence axis now runs from "have evidence" (left) to "no evidence" (right), as in Bland & Osterwalder's original; the focus is the top-right, and an assumption moves left as evidence comes in.
- Inergio worked example: Worksheet 2 scores re-transcribed from the authors' filled worksheets — an X on the line between two levels is now recorded as the half-step. The RVs' Overall Challenge is Mid–High (was Mid), which is why the opportunity sits on the border of Quick Win and Questionable.
- `worksheet-view`: the instructions now list all seven overall bands, including `highsuper`.

### Removed
- Internal review notes from the shipped references: verification markers, open-question sections, status lines, feedback attributions and project-scope discussion. `adjacent-concepts.md` is rewritten as a neutral note on what sits next to the Navigator and how it hands off. The worked-example list in the Worksheet 2 spec points to the bundled examples instead of source files that don't ship.

## [0.2.2] — 2026-10-29

### Changed
- Advisory board: the three thinker advisors are now anonymous experts named by their function, not after real people: `advisor-jobs-analyst` (Jobs Analyst — jobs to be done / disruption), `advisor-beachhead-strategist` (Beachhead Strategist — beachhead / whole product), `advisor-risk-inverter` (Risk Inverter — inversion / risk). Their lenses and review behaviour are unchanged. Callers passing the previous agent ids in `args.board` must switch to the new ones.

### Removed
- The seven advisors outside the default board, and the `args.board: "full"` option. The board is now the five-member roster; `args.board` still convenes a subset.

## [0.2.1] — 2026-10-16

### Changed
- Tightening pass over all nine `SKILL.md` files (about −12% words): duplicated rules merged, restated principles and long explanations already covered by `references/` cut. Frontmatter (descriptions/triggers) unchanged; method voice kept.

### Fixed
- `agile-focus`: a kept-open option the team names without a role is no longer written untagged; Claude asks what it is kept open for or records "role: to be decided by the team".

## [0.2.0] — 2026-10-15

Addresses the feedback from the authors' end-to-end test run of v0.1.2. Zone boundaries are unchanged, pending the authors' answer.

### Added

- Workspace `CLAUDE.md`, written at setup from `assets/templates/workspace-CLAUDE.md` so the ground rules hold when no Navigator skill is active (the team decides; answer off-topic questions briefly and steer back). An existing `CLAUDE.md` is never overwritten — the guide asks and offers to append.
- Short plain-language openers for Worksheets 1–3, and per-phase lists of helpers worth offering in the `where-to-play` guide.
- Worksheet 2 set-level spread check: when scored opportunities cluster in one band, re-check calibration before reading it as a finding.
- Worksheet 3 learning mode for when no option can be Primary yet: open assumptions per opportunity with a cheap next test, ordered by the team.
- `customer-discovery` saves the full synthetic personas and interviews by default to `<opportunity>-customer-interviews.md`, labelled SYNTHETIC; `worksheet-view` skips these files.

### Changed

- Worksheet 1: a market opportunity is one application × one customer segment (or sub-segment). Re-linking works from the abilities as a whole into an application → segment → sub-segment tree; screening runs per application × (sub-)segment and gives a recommendation, and the team sets each leaf's status (on the set / screened out / parked). Patents are noted as protection, not listed as abilities. `opportunity-discovery` returns the same tree.
- Worksheet 2: guiding questions come first; each opportunity is compared with those already scored; the score and the confidence colour are proposed and asked as two separate questions; uncertainty goes in the colour, not a default "Mid"; sources are shown by default.
- Research: an evidence colour per claim, while the factor-level confidence colour stays the team's call; on surfaces without `Workflow`, a plain-language note on the fallback.
- Synthetic-persona output is always named as a directional assumption to validate with real people, never as research.
- Worksheet 3: every role, keep-open, storage and parallel call is proposed and then decided by the team; every kept-open option is tagged Backup, Growth or both; the Primary is *pursue now* by default and not repeated among the candidates.
- Helpers (research, simulated interviews, the evidence check, debates, the advisory board) are offered in one plain sentence and run only on a yes.
- Renamed `score-challenger` → `score-examiner`: a neutral evidence check of a proposed score against the rubric, the evidence and the other opportunities, in both directions; offered to the team, not started unasked.
- Renamed `persona-explorer` → `persona-optimist`, so the debate pair reads optimist vs. skeptic; `persona-skeptic` also covers the Worksheet 3 stress-test of the candidate Primary.
- Advisory board: the default board is five members, each labelled "Name — lens" (Tal & Gruber — method fidelity, Score Examiner — evidence check, Christensen — jobs to be done / disruption, Moore — beachhead / whole product, Munger — inversion / risk). The full roster is available on request (`args.board: "full"`) or by naming members; the synthesis uses the same labels.
- `worksheet-view`: Worksheet 1 shows every segment as a tree with its status (`status` replaces `isOnSet`; older files still render); the Primary appears once, not again as a Worksheet 3 candidate.

### Fixed
- `opportunity-set`: screening outcomes are worded as recommendations (no ✅/❌, Pass/Fail or tallies); existing strengths such as a customer base count as abilities only for existing companies, not startups (spec Rule 1.6).
- `worksheet-view` renderer: sets up its Jinja2 dependency itself. The data file is read even when saved with a BOM or a Windows encoding, and pages are written as UTF-8.

## [0.1.2] — 2026-07-12

Repository restructure and packaging for public, single-plugin marketplace distribution. No change to the plugin's methodology or behavior.

### Changed

- Moved the plugin into a single-plugin marketplace layout under `plugins/where-to-plai/`, installable via `/plugin marketplace add Where-2-Play/where-to-plai`.
- Rewrote the plugin README for a public audience (Overview, three steps, the three market-research tiers, requirements, status).

### Added

- CI validation of the plugin and marketplace manifests.
- `docs/` — long-form documentation (methodology, skills, agents, workflows, templates, usage, architecture, examples).

## [0.1.1] — 2026-07-06

Post-smoke-test hardening and the "breathing" longitudinal loop.

### Added

- Capability-aware market-research engine selection — three tiers (bundled subagent fallback, built-in `deep-research`, bundled `wf-market-research`) chosen by whether the Claude Code `Workflow` tool is present.
- `customer-discovery` skill and `wf-customer-discovery` workflow — synthetic, skeptical customer interviews that draft a "Compelling reason to buy" (Factor 1) score. Directional only.
- Opt-in coordinated research pass per opportunity in `attractiveness-map`.
- `revisit` — the longitudinal loop that re-opens the worksheets as new evidence arrives, so the navigator "breathes" instead of being filled once.
- Captured Sharon & Marc's teaching spirit as shared guidance for the skills' tone.

### Changed

- Replaced the `worksheet-view` HTML template with a deterministic Python renderer (`skills/worksheet-view/renderer/render.py`).
- Renamed the bundled workflows with a `wf-` prefix so they no longer shadow the skills of the same name.

### Fixed

- Quoted `argument-hint` values so `SKILL.md` frontmatter parses correctly.

## [0.1.0] — 2026-06-27

Initial prototype scaffold for co-creation with the methodology's authors.

### Added

- The three Market Opportunity Navigator worksheets as skills — `opportunity-set` (WS1), `attractiveness-map` (WS2), `agile-focus` (WS3) — plus the `where-to-play` entry-point guide and the `market-research` support skill.
- Working agents — `opportunity-discovery` (WS1), `market-research` (WS2), `score-challenger` (WS2 devil's advocate), and the experimental `persona-explorer` / `persona-skeptic` debate lenses.
- Experimental "Framework plus" advisory board — advisor agents that *channel* (not impersonate) a panel of thinkers, plus a Tal & Gruber duo, convened by the `advisory-board` skill.
- `worksheet-view` skill — renders the filled navigator as web-app-style HTML.
- Bundled Claude-Code workflows for deep research and the advisory board.
- Worksheet templates scaffolded into the project workspace, and the Augury / Inergio / Ceal worked examples (© Sharon Tal & Marc Gruber, bundled with permission) as few-shot references.
- MIT license. © Sharon Tal & Marc Gruber.

## See also

- [README.md](README.md) — plugin overview, installation, and usage.
- [Documentation](../../docs/usage.md) — long-form usage, methodology, and architecture docs.

[Unreleased]: https://github.com/Where-2-Play/where-to-plai/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/Where-2-Play/where-to-plai/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/Where-2-Play/where-to-plai/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Where-2-Play/where-to-plai/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Where-2-Play/where-to-plai/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Where-2-Play/where-to-plai/releases/tag/v1.0.0

---
name: worksheet-view
description: This skill renders the team's filled Market Opportunity Navigator as a set of self-contained HTML pages that look exactly like the Where-to-Play web app. Triggers include "visualize the worksheets", "render the navigator", "show our results like the web app", "present the where-to-play worksheets as HTML", "make the navigator page", "build the worksheet view", "show the dartboard and map". Use it to turn the `where-to-play/*.md` files into a read-only `navigator/` folder with Overview / WS1 / WS2 / WS3 tabs.
argument-hint: [optional: path to the where-to-play folder, defaults to ./where-to-play]
---

# Worksheet View — render the Navigator as web pages

Produce a **one-way, read-only** visual of the team's Market Opportunity Navigator in the
*exact visual language* of the Where-to-Play web app, using the **real app's HTML, CSS, fonts
and images**. This is **presentation, not editing**: it shows what the team has written — it
never scores anything or invents content. The `.md` files stay the single source of truth.

The output is a folder (`where-to-play/navigator/`) of four cross-linked pages plus the shared
style, font and image folders. The pages open by double-click — no server, no network. (They use
relative links, so keep the folder together.)

## Two stages (this is the whole design)

```
where-to-play/*.md  ──①──▶  wtp-data.json  ──②──▶  navigator/ (overview, ws1, ws2, ws3)
                    YOU, with judgment        render.py, deterministic
```

- **① Compaction is YOUR job:** read the worksheets and emit a compact `wtp-data.json` that fits
  the fixed slots.
- **② Rendering is `render.py`'s job:** it maps that JSON to the real app's markup — text into
  slots, scores into the exact CSS classes. You never hand-write HTML.

## What it reads

From the project's `where-to-play/` folder (tolerate missing files — that tab renders empty):

- `01_opportunity-set.md` — Worksheet 1 (abilities + the screened opportunity set)
- `02_attractiveness-map/*.md` — Worksheet 2, one file per opportunity (the 6-factor scoring).
  Skip `<opportunity>-customer-interviews.md` companions (synthetic interview notes from
  `customer-discovery`) — they are not opportunities.
- `02_map-overview.md` — Worksheet 2 placements (each opportunity's zone/bands on the map)
- `03_agile-focus.md` — Worksheet 3 (Primary, candidates, relatedness, investment, dartboard)

## Procedure

1. **Read the worksheets.** Load every file above that exists, in full; do not guess at content
   that is not written down.

2. **Compact faithfully into `wtp-data.json`.** Build one JSON object that matches
   `renderer/schema.md` exactly. The layout has fixed slots (≤8 ability columns, ≤50-char
   customer segments, 4-segment factor scales, the dartboard rings, etc.), so **shorten the
   team's prose to fit using their own words and meaning** — never rewrite intent, never add
   claims. Carry the **whole Worksheet 1 tree** (application → segment → sub-segment), each entry
   with the `status` the team recorded (`onSet` / `screenedOut` / `parked`), not just what made
   the set. Write it to `where-to-play/wtp-data.json`.

3. **Render** with Python 3.9 or newer (nothing to install — its Jinja2 dependency ships in
   `renderer/_vendor/`):

   ```
   python3 "<skill-dir>/renderer/render.py" where-to-play/wtp-data.json where-to-play/navigator
   ```

   On Windows, use `py` instead of `python3`. This writes
   `where-to-play/navigator/{overview,ws1,ws2,ws3}.html` and copies in the style, font and image
   folders. Change nothing in `renderer/` — the templates already carry
   the real app's markup, classes and band/score→class logic.

4. **Tell the user** to open `where-to-play/navigator/overview.html` (double-click); the nav tabs
   switch between **Overview / Worksheet 1 / Worksheet 2 / Worksheet 3**.

## What this view deliberately is *not*

A static mirror, not the web app: no login, editing, autosave, sharing, comments, PDF download,
header chrome or GPT bubble. The only interactivity is the tab nav (plus a WS2 dropdown to switch
between scored opportunities). Inline editing + write-back is a plausible **v2**, intentionally
left out — keeping the worksheets editable keeps the team in the loop.

## Boundaries

- **Never fabricate.** Render only what the worksheets contain — no invented scores, zones,
  abilities, or opportunities.
- **Empty stays empty.** Omit blank fields from the JSON; they render as the app's faint
  placeholders, not as guesses or "TBD".
- **Compaction ≠ authorship.** Shorten to fit the layout; preserve the team's wording and meaning.
- **Enums only.** Map qualitative scores to exactly the values in `renderer/schema.md`
  (`Low/Mid/High/Super High`, band names, `pursueNow/keepOpen/placeInStorage`, …) and check them
  before rendering. For a half-step (e.g. "Low–Mid"), snap the factor to the nearer segment; the
  `overall*` bands carry all seven steps (`low` … `lowmid`, `midhigh`, `highsuper` … `super`);
  `midhigh` sits on the zone boundary.
- **No write-back.** Write only `where-to-play/wtp-data.json` and the `where-to-play/navigator/`
  folder; never edit the worksheet `.md` files.

## Additional resources

- `renderer/schema.md` — the `wtp-data.json` schema (every field, all enum values) and the
  stage-② enum→markup mapping.
- `renderer/wtp-data.example.json` — a complete worked example (the wireless-PdM venture) to copy
  the shape from.
- `renderer/render.py` + `renderer/templates/` + `renderer/static/` — the deterministic renderer
  (real app HTML/CSS/fonts/images).
- A complete filled navigator to model the compaction on:
  `../where-to-play/references/examples/inergio-full-navigator.md`.

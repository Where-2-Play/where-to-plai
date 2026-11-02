# `wtp-data.json` — the renderer contract (stage ① → stage ②)

`render.py` turns this JSON into the 4 faithful Where-to-Play worksheet pages.
**Stage ① (the skill, with judgment)** reads the `.md` worksheets and produces this
object — compacting prose to fit the fixed slots and mapping qualitative scores to the
enums below. **Stage ② (`render.py`, deterministic)** maps it to the real app's markup.
Carry **qualitative enums, not raw integers** — the skill decides the band; the renderer
picks the class.

Run: `python3 render.py <wtp-data.json> <out-dir>` (Windows: `py`; Python 3.9+, nothing to
install — Jinja2 ships in `_vendor/`).

```jsonc
{
  "title": "string",                         // project name

  "abilities": [                             // WS1 top row — up to 8 columns
    { "title": "string",                     // ability name (≤ ~50 chars)
      "properties": ["string", ...] }        // bullet properties; rendered padded to 4 rows
  ],

  "applications": [                          // WS1 application columns (and the × in opportunities)
    { "title": "string", "deletable": false } // deletable=true draws the little delete-icon
  ],

  "opportunities": [                         // an opportunity = one application × one (sub-)segment
    {
      "application": "string",               // MUST equal an applications[].title
      "segment": "string",                   // optional: parent's exact `customer` text → this is a sub-segment
      "customer": "string",                  // the (sub-)segment text (≤ 50 chars)
      "status": "onSet",                     // onSet | screenedOut | parked — see WS1 tree below
      "hasSub": false,                       // true → WS1 shows an empty "Type sub segment here" row
      "noteHeight": 18,                      // sticky-note px height: 18 (1 line) or 27 (2 lines)

      // --- WS2 / map (omit the whole block if the opportunity is unscored) ---
      "overallPotential": "lowmid",          // band → Overview map y-class + WS2 overall bar
      "overallChallenge": "midhigh",         // band → Overview map x-class + WS2 overall bar
      "showInWs2": true,                     // render a WS2 scoring block for this opportunity
      "factors": {                           // each ∈ Low | Mid | High | "Super High"
        "reasonToBuy": "Mid", "marketVolume": "High", "economicViability": "High",
        "implementationObstacles": "Mid", "timeToRevenue": "Low", "externalRisks": "High"
      },

      // --- WS3 ---
      "isCandidate": true,                   // true → a WS3 candidate column
      "isPrimary": false,                    // true → the WS3 Primary (top dropdown)
      "productRelatedness": "tightly",       // none | somewhat | tightly  (WS3 circles)
      "marketRelatedness": "none",
      "backupOption": true,                  // WS3 Backup checkbox
      "growthOption": false,                 // WS3 Growth checkbox
      "agileFocusOption": "pursueNow"        // pursueNow | keepOpen | placeInStorage | null
    }
  ],

  "ws3EmptyColumns": 2                        // # of blank candidate slots to show in WS3
}
```

## Enums (allowed values)

| Field | Allowed values |
|---|---|
| `overallPotential`, `overallChallenge` | `low` · `lowmid` · `mid` · `midhigh` · `high` · `highsuper` · `super` |
| `factors.*` | `Low` · `Mid` · `High` · `Super High` |
| `productRelatedness`, `marketRelatedness` | `none` · `somewhat` · `tightly` |
| `agileFocusOption` | `pursueNow` · `keepOpen` · `placeInStorage` · `null` |
| `status` | `onSet` · `screenedOut` · `parked` |

## How stage ② maps it (for reference — you don't compute these)

- **Overview map dot:** `class="x<overallChallenge> y<overallPotential> box"` (band `low` → no class, i.e. left/bottom edge).
- **Overview dartboard:** ring class from `agileFocusOption` (`pursueNow`→`pursue-now`, …); items distributed into ring slots automatically.
- **WS2 factor scale:** the enum highlights two adjacent segments — `Low`→[0,1], `Mid`→[1,2], `High`→[2,3], `Super High`→[3,4].
- **WS2 overall bars:** band index (`low`=0 … `super`=6) highlights `[i, i+1]`.
- **WS1 tree:** one column per application listing **every** segment in input order; entries with
  `segment` nest under that segment (a `segment` that is not itself an entry renders as a plain
  grouping row). `onSet` → yellow note, `screenedOut` → faint + struck through + "out",
  `parked` → dashed + "parked"; a legend appears when any entry is not on the set.
- **WS3 candidate columns:** every `isCandidate` entry **except the Primary**, which shows only in
  the top row (and on the dartboard via its own `agileFocusOption`, normally `pursueNow`).
- **WS3 relatedness circles:** `none`→1st, `somewhat`→2nd, `tightly`→3rd.

## Stage ① compaction rules (the skill's job)

- **Fit the slots.** Customer segments ≤ 50 chars; ability titles/properties short. Shorten the
  team's prose, never invent or change meaning. Empty stays empty.
- **Keep the whole tree, mark each leaf.** List every segment and sub-segment from Worksheet 1,
  not only the ones on the set, each with the `status` the team recorded (`onSet` / `screenedOut` /
  `parked`; none recorded → omit it, the row renders neutral). Only `onSet` entries reach the
  Overview set; WS1 keeps the breadth visible. Put the status in `status`, not in the `customer`
  text. Older files with `isOnSet` still render (`true` = `onSet`, `false` = `screenedOut`);
  `status` wins when both are present.
- **Scores are the team's qualitative call**, mapped to the nearest enum. If a worksheet field is
  blank, omit the corresponding key (the slot renders empty) — do not guess a score.
- **One Primary** (`isPrimary:true`) and the WS3 candidate set come from Worksheet 3. The Primary
  is never repeated as a candidate column (the renderer skips it even if `isCandidate` is set);
  `pursueNow` on a candidate means "in parallel with the Primary".

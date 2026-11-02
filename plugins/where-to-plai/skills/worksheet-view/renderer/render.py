#!/usr/bin/env python3
"""Stage (2) renderer: compact wtp-data.json -> 4 faithful "Where to Play"
worksheet HTML files matching the real app's markup.

Usage:
    python3 render.py <wtp-data.json> <out-dir>     (Windows: py render.py ...)

Needs Python 3.9 or newer and nothing else: its only dependency, Jinja2
(with MarkupSafe), ships next to this script in _vendor/ and is always the
copy that gets used, so there is nothing to install.

Loads the JSON, renders templates/{overview,ws1,ws2,ws3}.html.j2 into <out-dir>,
and copies the static/ folders into <out-dir> (copy, never read).
"""
import json
import pathlib
import shutil
import sys

# Use the bundled Jinja2/MarkupSafe in _vendor/ (searched first, so an installed
# copy never changes the output) and don't leave .pyc files in the plugin folder.
sys.dont_write_bytecode = True
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent / "_vendor"))

try:
    from jinja2 import Environment, FileSystemLoader, select_autoescape
except ImportError as exc:
    sys.exit("render.py could not load its bundled Jinja2 from the _vendor/ folder next to it "
             f"({exc}). It needs Python 3.9 or newer; check that the plugin's "
             "skills/worksheet-view/renderer/_vendor/ folder is complete, then run "
             "`python3 render.py <wtp-data.json> <out-dir>` again (Windows: `py`).")

HERE = pathlib.Path(__file__).parent
DIST = HERE / "static"

# --- band / level -> markup tokens (derived from dist HTML + verified vs app JS) ---

# Attractiveness-map x/y class.  App JS: 1->lowmid,2->mid,3->midhigh,4->high,
# 5->highsuper,6->super ; band "low" (index 0) yields NO class (empty string).
_BAND_X = {"lowmid": "xlowmid", "mid": "xmid", "midhigh": "xmidhigh",
           "high": "xhigh", "highsuper": "xhighsuper", "super": "xsuper"}
_BAND_Y = {"lowmid": "ylowmid", "mid": "ymid", "midhigh": "ymidhigh",
           "high": "yhigh", "highsuper": "yhighsuper", "super": "ysuper"}
# numeric band index used both for the Tooltip-id and as the overall-bar start slot
BAND_IDX = {"low": 0, "lowmid": 1, "mid": 2, "midhigh": 3, "high": 4,
            "highsuper": 5, "super": 6}

# WS2 factor enum -> first of the two adjacent filled arrow-sections (0-based)
FACTOR_IDX = {"Low": 0, "Mid": 1, "High": 2, "Super High": 3}

# WS3 relatedness -> which of the 3 circle boxes is active (0-based)
RELATEDNESS_IDX = {"none": 0, "somewhat": 1, "tightly": 2}

# agile-focus dartboard ring -> CSS ring class
RING_CLASS = {"pursueNow": "pursue-now", "keepOpen": "keep-open",
              "placeInStorage": "place-in-storage"}

# WS1 leaf status -> marker class on the segment row (on the set = the app's yellow note)
STATUS_CLASS = {"onSet": "", "screenedOut": "wtp-out", "parked": "wtp-parked"}


def opp_status(o):
    """Explicit `status` wins; old files fall back to isOnSet (false = screened out).
    Neither key -> None (listed, not yet screened: neutral grey)."""
    if o.get("status") in STATUS_CLASS:
        return o["status"]
    if "isOnSet" in o:
        return "onSet" if o["isOnSet"] else "screenedOut"
    return None


def ws1_segments(app_title, opps):
    """Application -> segment -> optional sub-segments, in input order.
    An opportunity with `segment` is a sub-segment of that segment; without it,
    `customer` is the segment itself. A segment named only via `segment` is a
    grouping node (no status of its own)."""
    nodes, by_name = [], {}

    def node(name):
        if name not in by_name:
            by_name[name] = {"text": name, "status": None, "hasSub": False, "subs": []}
            nodes.append(by_name[name])
        return by_name[name]

    for o in opps:
        if o.get("application") != app_title:
            continue
        if o.get("segment"):
            node(o["segment"])["subs"].append(
                {"text": o.get("customer", ""), "status": opp_status(o)})
        else:
            n = node(o.get("customer", ""))
            n["status"] = opp_status(o)
            n["hasSub"] = n["hasSub"] or bool(o.get("hasSub"))
    return nodes


def map_box_class(challenge, potential):
    parts = [p for p in (_BAND_X.get(challenge, ""), _BAND_Y.get(potential, "")) if p]
    parts.append("box")
    return " ".join(parts)


def map_box_id(challenge, potential):
    return "Tooltip-%d%d" % (BAND_IDX.get(potential, 0), BAND_IDX.get(challenge, 0))


# --- dartboard slot logic (verbatim from app JS main.c6cbc3cf.js) ---
def _storage_slot(i):                       # place-in-storage ring
    base = "left" if i < 5 else "bottom" if i < 9 else "right" if i < 14 \
        else "top-right-%d" % (i - 13)
    mod = {1: "second", 2: "third", 3: "fourth", 4: "fifth",
           6: "second", 7: "third", 8: "fourth",
           10: "second", 11: "third", 12: "fourth", 13: "fifth"}.get(i, "")
    return base, mod, i >= 14


def _keepopen_slot(i):                       # keep-open ring
    base = "left" if i < 3 else "bottom" if i < 5 else "right" if i < 8 \
        else "top-right-%d" % (i - 7)
    mod = {1: "second", 2: "third", 4: "second",
           6: "second", 7: "third"}.get(i, "")
    return base, mod, i >= 8


def _pursue_slot(i):                         # pursue-now ring
    return "middle-%d" % (i + 1), "", True    # always carries id=Tooltip-pursueNow


def dartboard_items(opps):
    """Return ordered list of dartboard boxes: storage, then keep-open, then pursue-now
    (the order the app renders them)."""
    rings = [
        ("placeInStorage", _storage_slot),
        ("keepOpen", _keepopen_slot),
        ("pursueNow", _pursue_slot),
    ]
    out = []
    for option, slotfn in rings:
        members = [o for o in opps if o.get("agileFocusOption") == option]
        for i, o in enumerate(members):
            base, mod, has_id = slotfn(i)
            cls = " ".join(p for p in ["box", RING_CLASS[option], base, mod] if p)
            out.append({
                "cls": cls,
                "id": ("Tooltip-" + option) if has_id else None,
                "app": o.get("application", ""),
                "customer": o.get("customer", ""),
            })
    return out


def pad(seq, n):
    seq = list(seq)
    return seq + [""] * (n - len(seq)) if len(seq) < n else seq


def build_context(data):
    opps = data.get("opportunities", [])
    apps = data.get("applications", [])

    set_opps = [o for o in opps if opp_status(o) == "onSet"]

    map_opps = [o for o in opps
                if o.get("overallChallenge") and o.get("overallPotential")]
    map_boxes = [{
        "cls": map_box_class(o["overallChallenge"], o["overallPotential"]),
        "id": map_box_id(o["overallChallenge"], o["overallPotential"]),
        "app": o.get("application", ""),
        "customer": o.get("customer", ""),
    } for o in map_opps]

    # WS1: one column per application listing ALL its customer segments as a tree
    # (segment -> sub-segments), each marked on the set / screened out / parked.
    ws1_cols = [{
        "title": a["title"],
        "deletable": a.get("deletable", False),
        "segments": ws1_segments(a["title"], opps),
    } for a in apps]
    ws1_statuses = {s["status"] for c in ws1_cols for n in c["segments"]
                    for s in [n] + n["subs"]}

    abilities = [{"title": ab["title"], "rows": pad(ab.get("properties", []), 4)}
                 for ab in data.get("abilities", [])]

    # WS2: every opportunity flagged showInWs2 (and carrying factor data)
    ws2_opps = []
    for o in opps:
        if not o.get("showInWs2") or "factors" not in o:
            continue
        f = o["factors"]
        ws2_opps.append({
            "app": o.get("application", ""),
            "customer": o.get("customer", ""),
            "factors": {k: FACTOR_IDX[v] for k, v in f.items()},
            "overallPotentialStart": BAND_IDX.get(o.get("overallPotential", "low"), 0),
            "overallChallengeStart": BAND_IDX.get(o.get("overallChallenge", "low"), 0),
        })

    # WS3: the Primary sits in the top row only; candidate columns are the others
    # (the Primary stays on the dartboard via its agileFocusOption).
    primary = next((o for o in opps if o.get("isPrimary")), None)
    candidates = []
    for o in opps:
        if not o.get("isCandidate") or o is primary:
            continue
        candidates.append({
            "app": o.get("application", ""),
            "customer": o.get("customer", ""),
            "product": RELATEDNESS_IDX.get(o.get("productRelatedness"), None),
            "market": RELATEDNESS_IDX.get(o.get("marketRelatedness"), None),
            "backup": bool(o.get("backupOption")),
            "growth": bool(o.get("growthOption")),
            "agile": o.get("agileFocusOption"),
        })

    return {
        "title": data.get("title", ""),
        "set_opps": set_opps,
        "map_boxes": map_boxes,
        "dartboard": dartboard_items(opps),
        "abilities": abilities,
        "ws1_cols": ws1_cols,
        "status_class": STATUS_CLASS,
        "ws1_legend": bool(ws1_statuses & {"screenedOut", "parked"}),
        "ws2_opps": ws2_opps,
        "primary": primary,
        "candidates": candidates,
        "ws3_empty": data.get("ws3EmptyColumns", 0),
    }


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: render.py <wtp-data.json> <out-dir>")
    raw = pathlib.Path(sys.argv[1]).read_bytes()
    try:
        text = raw.decode("utf-8-sig")            # UTF-8, with or without BOM
    except UnicodeDecodeError:
        text = raw.decode("cp1252", errors="replace")  # e.g. saved by a Windows editor
    data = json.loads(text)
    out = pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)

    env = Environment(
        loader=FileSystemLoader(str(HERE / "templates")),
        autoescape=select_autoescape(["html", "j2", "html.j2"], default=True),
        trim_blocks=True, lstrip_blocks=True,
    )
    ctx = build_context(data)
    for name in ("overview", "ws1", "ws2", "ws3"):
        html = env.get_template(name + ".html.j2").render(**ctx)
        (out / (name + ".html")).write_text(html, encoding="utf-8")
        print("rendered", out / (name + ".html"))

    # copy every static/ subfolder as-is (copy, never read)
    for src in sorted(p for p in DIST.iterdir() if p.is_dir()):
        dst = out / src.name
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        print("copied", src.name)


if __name__ == "__main__":
    main()

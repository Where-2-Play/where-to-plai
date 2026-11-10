"""Check the plugin folder against the file rules Anthropic's plugin directory applies to community plugins.

Usage (from the repo root):
    python .github/scripts/check_directory_policy.py plugins/where-to-plai

Fails (exit 1) when:
  - a file is not Markdown, text, JSON, YAML or a PNG/JPEG/GIF/WebP/ICO image
    (LICENSE is allowed without an extension),
  - a file starts with "#!",
  - a text file is not UTF-8 or holds a NUL byte,
  - a frontmatter value in a skill, agent, command or output style is not plain text
    (a YAML list or mapping, e.g. an unquoted `argument-hint: [optional: x]`),
  - a single-line frontmatter value holds a colon, #, bracket, brace or quote without
    being in double quotes.
Needs PyYAML.
"""

import sys
from pathlib import Path

import yaml

TEXT = {".md", ".txt", ".json", ".yaml", ".yml"}
IMAGES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico"}
IGNORED = {".DS_Store"}
FRONTMATTER_DIRS = {"skills", "agents", "commands", "output-styles"}


def main(root):
    root = Path(root)
    problems = []
    for p in sorted(root.rglob("*")):
        if not p.is_file() or p.name in IGNORED:
            continue
        rel = p.relative_to(root)
        ext = p.suffix.lower()
        if ext not in TEXT | IMAGES and p.name != "LICENSE":
            problems.append(f"{rel}: file type not accepted by the directory")
            continue
        data = p.read_bytes()
        if data.startswith(b"#!"):
            problems.append(f"{rel}: starts with #!")
        if ext in IMAGES:
            continue
        if b"\0" in data:
            problems.append(f"{rel}: contains a NUL byte")
            continue
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            problems.append(f"{rel}: not UTF-8")
            continue
        if ext == ".md" and rel.parts[0] in FRONTMATTER_DIRS and text.startswith("---\n"):
            end = text.find("\n---", 4)
            try:
                fm = yaml.safe_load(text[4:end]) or {}
            except yaml.YAMLError as e:
                problems.append(f"{rel}: frontmatter is not valid YAML ({e.__class__.__name__})")
                continue
            for key, value in fm.items():
                if not isinstance(value, str):
                    problems.append(f"{rel}: frontmatter '{key}' is a {type(value).__name__}, not text")
            # The directory wants one `key: value` per line, and any value holding a
            # colon, #, bracket, brace or quote in double quotes. Block scalars
            # (`description: |`, the documented agent format) are left alone.
            for n, line in enumerate(text[4:end].splitlines(), start=2):
                if not line or line[0] in " \t" or ":" not in line:
                    continue
                key, _, value = line.partition(":")
                value = value.strip()
                if not value or value in ("|", ">", "|-", ">-") or (value.startswith('"') and value.endswith('"')):
                    continue
                if any(c in value for c in ':#[]{}"\''):
                    problems.append(f"{rel}: line {n} '{key}' holds a colon, #, bracket or quote; put the value in double quotes")
    for line in problems:
        print("✗ " + line)
    if not problems:
        print(f"✓ {root}: all files and frontmatter values follow the directory's file rules")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "plugins/where-to-plai"))

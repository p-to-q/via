#!/usr/bin/env python3
"""Run the validators bundled with Codex when present on a contributor machine.

GitHub CI does not include Codex's system skills, so CI performs the equivalent
release-shape checks locally. Maintainers also run the official validators
before tagging a release.
"""

import json
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    skill = ROOT / "skills" / "via-route"
    text = (skill / "SKILL.md").read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise SystemExit("SKILL.md is missing YAML frontmatter")
    _, frontmatter, _ = text.split("---", 2)
    metadata = yaml.safe_load(frontmatter)
    if metadata.get("name") != "via-route" or not metadata.get("description"):
        raise SystemExit("invalid Skill name or description")

    plugin = json.loads((ROOT / ".codex-plugin" / "plugin.json").read_text(encoding="utf-8"))
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    if plugin.get("name") != "via":
        raise SystemExit("invalid plugin name")
    if plugin.get("version") != package.get("version"):
        raise SystemExit("plugin and package versions differ")
    if plugin.get("skills") != "./skills/":
        raise SystemExit("plugin skills path is invalid")
    print("release shape valid")


if __name__ == "__main__":
    main()

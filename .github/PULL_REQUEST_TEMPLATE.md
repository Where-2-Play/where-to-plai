## What changed

Briefly describe the change and the motivation (the "why").

## Which component

- [ ] Skill(s)
- [ ] Agent(s)
- [ ] Workflow blueprint (`references/workflow-blueprint.md`)
- [ ] Template(s) or worked example(s)
- [ ] Docs / README
- [ ] Repo tooling / CI

## Checklist

- [ ] We agreed on this change in an issue first: #
- [ ] Ran the local checks in docs/development.md and/or the **Validate
      plugin** CI is green; tested with `claude --plugin-dir plugins/where-to-plai`.
- [ ] Skill/agent frontmatter is intact, and every file in the plugin folder
      follows the directory's file rules (the **Directory file policy** CI step).
- [ ] Updated `plugins/where-to-plai/CHANGELOG.md` and bumped the version in
      `.claude-plugin/marketplace.json` **and**
      `plugins/where-to-plai/.claude-plugin/plugin.json` if this is a
      user-facing change.
- [ ] Respects the **human-in-the-loop** stance — this is **not a strategy
      machine**; nothing here auto-aggregates scores or picks a market for the
      team.
- [ ] **No license changes** (CC BY-NC-SA 4.0, © Sharon Tal & Marc Gruber;
      see `plugins/where-to-plai/NOTICE.md`).
- [ ] Any experimental `persona-*` / `advisor-*` work stays framed as a
      provocation, not a verdict (an anonymous expert lens, not a real person).

## Notes for reviewers

Anything else worth calling out — trade-offs, follow-ups, or open questions.

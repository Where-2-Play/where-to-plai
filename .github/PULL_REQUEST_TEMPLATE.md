## What changed

Briefly describe the change and the motivation (the "why").

## Which component

- [ ] Skill(s)
- [ ] Agent(s)
- [ ] Command / workflow (`wf-*.js`)
- [ ] Template(s) or worked example(s)
- [ ] Renderer (`worksheet-view`)
- [ ] Docs / README
- [ ] Repo tooling / CI

## Checklist

- [ ] Ran local validation (`claude --plugin-dir .`) and/or the **Validate
      plugin** CI is green.
- [ ] Skill/agent frontmatter is intact; any new workflow script passes
      the syntax check (CI step, or CONTRIBUTING.md check 5).
- [ ] Updated the changelog and bumped the version in
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

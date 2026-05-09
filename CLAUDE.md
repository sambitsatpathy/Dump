# India Through Its States — Substack Series

**Project:** Long-form Substack series. 28 posts. One per Indian state. Ordered Northeast → West.

---

## The One Rule

Every post is built around an **anchor reframe** — a single claim that changes how the reader understands the state. A post without a genuine reframe does not publish.

---

## File Layout

```
states/<State Name>/
  0. Reframe Discovery.md   ← Step 0 output + chosen anchor
  1. Raw Material.md        ← Tagged bullets (SERVES / TEXTURE / CUT)
  2. Myth.md                ← Section draft
  3. History.md             ← Section draft
  4. Culture.md             ← Section draft
  5. Present.md             ← Section draft
  6. Hooks.md               ← 10 candidates + chosen hook
  7. Voice Draft.md         ← Combined + humanized
  8. Final Draft.md         ← Publish-ready

docs/reframe-log.md         ← One line per published state
docs/superpowers/specs/     ← Design spec
docs/superpowers/plans/     ← Implementation plan
prompts/                    ← Reusable pipeline prompts
```

---

## Pipeline (5 days per state)

| Day | Work | Output |
|-----|------|--------|
| 1 | Reframe Discovery + Raw Material | Files 0, 1 |
| 2 | Section drafts | Files 2–5 |
| 3 | Hooks + combine | File 6, draft of 7 |
| 4 | **Reframe Test gate** → humanize if pass | File 7 |
| 5 | Final draft + publish + log | File 8, reframe-log.md |

---

## Agents Available

| Agent | Use when |
|-------|----------|
| `reframe-finder` | Finding anchor reframe candidates for a state |
| `section-writer` | Writing a single narrative section (Myth/History/Culture/Present) |
| `humanizer` | Voice injection + imperfection on a combined draft |
| `reframe-tester` | Running all three gate tests before humanizing |

---

## Slash Commands

| Command | Does |
|---------|------|
| `/new-state <State>` | Scans reframe log, shows progress, orients for Day 1 |
| `/reframe-test` | Runs Stranger + Expert + Landing tests on current Voice Draft |
| `/log-reframe` | Appends published state to `docs/reframe-log.md` |
| `/week-status` | Shows which pipeline files exist for the current state |

---

## Prompt Templates

All pipeline prompts live in `prompts/`. Copy and fill `[PLACEHOLDERS]` before running.

```
prompts/0-reframe-discovery.md
prompts/1-raw-material.md
prompts/2-section-writing.md
prompts/3-hook-generation.md
prompts/4-voice-injection.md
prompts/5-imperfection.md
```

---

## Publication Order

NE → East → Central → North → Northwest → Deccan → South

Full schedule: `docs/superpowers/plans/2026-05-06-india-substack-series.md`

---

## Critical Checks

- Before Step 0 on any state: scan `docs/reframe-log.md` — discard candidates that overlap
- Day 4 gate is binary: all 3 tests pass, or return to Day 1
- After publishing: scan previous 5–6 log entries for callback opportunity in next state

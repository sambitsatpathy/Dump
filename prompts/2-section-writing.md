# Step 2 — Section Writing

Run this prompt **once per section** — Myth, History, Culture, Present.
Do not ask for all four in one call. Sections generated together will share rhythm and structure.

**Before running:** Have `states/[STATE NAME]/1. Raw Material.md` open. Use only SERVES and TEXTURE items.

---

## Prompt

```
Write a narrative section:

SECTION: [Myth / History / Culture / Present]
STATE: [STATE NAME]
ANCHOR REFRAME: [YOUR CHOSEN ANCHOR]

Source material (use only items below):
[PASTE SERVES AND TEXTURE ITEMS FROM RAW MATERIAL FOR THIS SECTION]

Tone:
- Story-driven, not encyclopedic
- Slightly opinionated — you have a perspective
- Avoid textbook phrasing

Constraints:
- Do not write an introduction that announces the section
- No conclusion or summary at the end
- Drop the reader directly into the material
- Include at least one detail that would surprise an educated reader
- 300–500 words
```

---

## What to do with the output

1. Check: does the section serve the anchor or drift from it?
2. Check: does it avoid textbook openers ("X is known for...")?3. Trim anything that drifts or repeats material from another section.
4. Save to the appropriate file:
   - Myth → `states/[STATE]/2. Myth.md`
   - History → `states/[STATE]/3. History.md`
   - Culture → `states/[STATE]/4. Culture.md`
   - Present → `states/[STATE]/5. Present.md`

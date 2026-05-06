# Design Spec: India Through Its States — Substack Series Workflow

**Date:** 2026-05-06
**Project:** India Through Its States — Myth, History, Culture
**Status:** Approved

---

## Core Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Target audience | General-interest archive | Each post must work as a standalone entry point |
| Series promise | Unexpected angle + atmosphere + argument | Not comprehensive coverage |
| Load-bearing element | The reframe | A post without a genuine reframe does not publish |
| Structural approach | Inversion Model + Layered Reveal | Find reframe first; make reader arrive at it |

---

## The Rebuilt Pipeline

### STEP 0 — REFRAME DISCOVERY *(new, gates everything)*

Run before any other step.

```
You are researching [STATE NAME] for a long-form piece.

Your only job right now: find the single most surprising thing
about this state that an educated, curious reader would not expect.

Rules:
- Not a quirky fun fact. A reframe — something that changes how
  you understand the state's identity, history, or place in India.
- Give 5 candidates. One sentence each.
- No explanation yet. Just the claims.
```

Pick one anchor. Everything generated in Steps 1–5 is filtered through:
*does this serve the anchor or distract from it?*

---

### STEP 1 — RAW MATERIAL *(modified)*

```
You are a cultural historian and storyteller.

Give me structured raw material for a long-form Substack post on [STATE NAME].

Divide into:
1. 5–7 key mythological narratives
2. Historical timeline (major phases)
3. 8–10 cultural elements (food, festivals, language, art)
4. 3 lesser-known facts
5. 3 tensions or contradictions

Do NOT write an article.
Use bullet points only.
Avoid generic phrasing.

Anchor reframe: [YOUR CHOSEN REFRAME]

For each item, tag it:
- SERVES — directly supports or complicates the anchor
- TEXTURE — adds atmosphere, keep if space allows
- CUT — interesting but pulls away from the anchor
```

Override AI tags where wrong. You now have a prioritized list, not a flat one.

---

### STEP 2 — SECTION WRITING *(modular)*

Run separately for each section. Editorial filter: *is this serving the anchor reframe?*

```
Write a narrative section:

SECTION: [Myth / History / Culture / Present]

Tone:
- Story-driven
- Slightly opinionated
- Avoid textbook tone

Constraints:
- No conclusion
- No repetition
- Include at least one surprising detail
```

---

### STEP 3 — HOOK GENERATION

```
Generate 10 opening hooks for [STATE NAME].

Rules:
- No "Have you ever wondered"
- Start with a place, contradiction, or striking image
- Under 25 words
```

Hook must gesture at the anchor reframe obliquely — not state it.
Manually edit one. The hook is a promise; the post is the delivery.

---

### STEP 4 — VOICE INJECTION

```
Rewrite this draft to sound like a thoughtful human writer.

Add:
- Subjective observations
- Natural transitions
- Sentence variation

Avoid:
- Academic tone
- Repetition
- Overly clean structure
```

---

### STEP 5 — IMPERFECTION LAYER

```
Pick one paragraph and deliberately make it slightly too long —
let one idea overrun into the next.

Then cut one sentence from a different paragraph that feels
"too complete."

Also insert 2–3 conversational lines.
```

Structural imperfection is more convincing than lexical imperfection.

---

## The Reframe Test *(publishing gate)*

Runs on Day 4, before humanizing. Binary: pass or return to Step 0.

### 1. The Stranger Test
Read your anchor reframe to someone who knows nothing about the state.
Do they say "huh, I wouldn't have guessed that"?
If they say "yeah, that makes sense" — it's a fact, not a reframe. Pick another.

### 2. The Expert Test
Would someone who knows the state well find this *interesting* rather than *wrong*?
A reframe isn't a mistake. It's a perspective they may not have articulated.
If an expert would just correct you — rewrite or pick a different anchor.

### 3. The Landing Test
Read the final 200 words of the post. Does the reframe land there, implicitly or explicitly?
If the post ends without the reader feeling the anchor — fix the ending, not the anchor.

**If any test fails:** Don't humanize. Don't publish. Return to Step 0.

---

## Series Memory

### The Reframe Log

After each post publishes, add one line:

```
[STATE] — [ANCHOR REFRAME IN ONE SENTENCE] — [DATE PUBLISHED]
```

**Three functions:**

1. **Prevents repetition** — Scan before Step 0. Discard overlapping candidates.
2. **Generates callbacks** — Every 5–6 posts, one sentence references a previous reframe obliquely.
3. **Reveals the series thesis** — After 10–12 posts, a pattern emerges. That's the spine of the annual synthesis post.

---

## Weekly Execution

| Day | Task |
|-----|------|
| 1 | Step 0 — Reframe Discovery. Pick anchor. |
| 2 | Step 1 — Raw material, filtered and tagged through anchor. |
| 3 | Steps 2–3 — Draft sections, combine. |
| 4 | **Reframe Test gate.** Pass → Steps 4–5, humanize. Fail → return to Day 1. |
| 5 | Publish. Log the reframe. Scan for callback opportunity in next post. |

---

## Humanization Checklist

### Structure
- [ ] Sections uneven in length
- [ ] No predictable intro → body → conclusion
- [ ] Reframe is not stated in the opening paragraph

### Sentence Variation
- [ ] Mix of short + long sentences
- [ ] At least 3 short punchy lines
- [ ] One paragraph deliberately runs slightly long

### Voice
- [ ] 3+ subjective lines
- [ ] 2+ opinions
- [ ] At least 1 line admitting uncertainty

### AI Phrase Removal
Remove: "In conclusion" / "It is important to note" / "Throughout history"

### Texture
- [ ] Specific places mentioned
- [ ] Sensory detail (visual / sound / culture)
- [ ] Local belief or practice included

### Reframe Delivery *(critical)*
- [ ] Reframe lands in final 200 words
- [ ] Reader arrives at it — it is not announced
- [ ] Hook gestured at it without stating it

---

## Success Metric

Each post should leave the reader with one thought they didn't have before. Not information. A thought.

The series should leave the reader, after 10+ posts, with a feeling that India is stranger, more contested, and more interesting than they knew.

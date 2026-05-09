# Step 5 — Imperfection Layer

**Runs immediately after Step 4.** Apply to the voice-injected draft, not the raw combined draft.

---

## Prompt

```
Apply an imperfection layer to this draft. Do not rewrite it — make targeted changes only.

DRAFT:
[PASTE VOICE-INJECTED DRAFT FROM STEP 4]

Make exactly these changes:

1. Find one paragraph that is too smooth and complete. Make it run slightly too long — let one idea spill into the next without a clean stop. Do not fix this. Leave it slightly overgrown.

2. Find one sentence in a different paragraph that feels like a perfect landing — the kind of line that wraps up its paragraph too neatly. Cut it.

3. Insert 2–3 conversational lines at natural breaks. These should sound like something you'd say to a curious friend, not write in an essay:
   - "Not many people know this, but..."
   - "Which is odd, if you think about it."
   - "I'm still not sure what to make of that."
   (Use these as style guides, not as literal insertions.)

4. Add one line where the writer admits they don't fully understand something about this state.

Return only the modified draft. No commentary.
```

---

## What to do with the output

1. Save to `states/[STATE NAME]/7. Voice Draft.md` (replace Step 4 output).
2. Run the Humanization Checklist (in the design spec or via `/reframe-test`).
3. If checklist passes → proceed to Day 5 (Final Draft).

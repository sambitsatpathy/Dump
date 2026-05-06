Start the workflow for a new state. $ARGUMENTS should be the state name exactly as it appears in the states/ folder.

1. Read `docs/reframe-log.md` and display the last 5 logged reframes as a warning list — these anchor angles are off-limits for this state.

2. Read the implementation plan at `docs/superpowers/plans/2026-05-06-india-substack-series.md` and find the week number for this state.

3. Check `states/$ARGUMENTS/` and report which pipeline files currently exist and which are empty:
   - 0. Reframe Discovery.md
   - 1. Raw Material.md
   - 2. Myth.md
   - 3. History.md
   - 4. Culture.md
   - 5. Present.md
   - 6. Hooks.md
   - 7. Voice Draft.md
   - 8. Final Draft.md

4. Based on which files have content, identify the current pipeline stage and tell the user exactly what to do next.

5. Print the Step 0 prompt from `prompts/0-reframe-discovery.md` with [STATE NAME] replaced by the actual state name, ready to copy into a new AI session.

Format the output clearly with headers for each section. End with: "Ready for Day 1. Run the Step 0 prompt above in a fresh session or use the `reframe-finder` agent."

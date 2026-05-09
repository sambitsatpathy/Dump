Run the Reframe Test on the current state's Voice Draft. $ARGUMENTS should be the state name. If no argument is given, ask the user which state they are working on.

Delegate to the `reframe-tester` agent:
- Pass it the state name
- It will read states/$ARGUMENTS/0. Reframe Discovery.md and states/$ARGUMENTS/7. Voice Draft.md
- It will run all three tests and return a verdict

After the agent returns:
- If PASS: confirm the user can proceed to humanization and suggest running the `humanizer` agent
- If FAIL on Test 1 or 2: remind the user the anchor needs replacing, not the draft — return to Day 1
- If FAIL on Test 3 only: the ending needs fixing — the anchor and draft are sound

Do not soften the result. Report it as the agent returned it.

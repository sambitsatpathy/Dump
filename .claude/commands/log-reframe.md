Log a published state to the reframe log. $ARGUMENTS format: "<State Name> | <Anchor Reframe>"

Example: /log-reframe Nagaland | Nagaland's 20th-century insurgency was shaped less by ethnic identity than by a specific Cold War missionary network that most Indian histories omit.

Steps:
1. Parse the state name and anchor reframe from $ARGUMENTS (split on " | ").
2. Read `docs/reframe-log.md`.
3. Append a new row to the table:
   | [STATE] | [ANCHOR REFRAME] | [TODAY'S DATE] |
4. Save the file.
5. Read the last 5 entries in the log and check the next state in the publication order (from `docs/superpowers/plans/2026-05-06-india-substack-series.md`).
6. Ask: is there a callback opportunity? If the next state's topic intersects with any of the last 5 reframes in a meaningful way, suggest a one-sentence callback line. Otherwise say "No callback opportunity identified."
7. Report: "Logged. [N] states published. [28 - N] remaining."

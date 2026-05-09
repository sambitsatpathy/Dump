Show the current status of all 28 states in the series. No arguments needed.

1. Read `docs/reframe-log.md` — collect all published states.
2. Read `docs/superpowers/plans/2026-05-06-india-substack-series.md` — get the full publication order.
3. For each state in order, check `states/<State>/` for which numbered files have content (non-empty).

Report a table:

| # | State | Phase | Status |
|---|-------|-------|--------|
| 1 | Arunachal Pradesh | Northeast | ✅ Published / 🔄 Day N (files 0-N exist) / ⬜ Not started |

Use:
- ✅ Published — appears in reframe-log.md
- 🔄 In progress — show which day based on highest non-empty file number
- ⬜ Not started — all files empty

After the table, show:
- States published: N/28
- Current state in progress: [State] — Day [N]
- Next state: [State]
- Weeks elapsed (based on log dates if available): N
- Projected completion at 1/week: [date]

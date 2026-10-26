# Exchange Holidays Manager: Screen Design Spec

A single page to view, add, edit and delete exchange holidays, with a List view and a Calendar view, both driven by the same filters.

- **Target:** desktop admin page, designed at 1440 px wide, fluid down to about 1340 px before the table scrolls horizontally.
- **Navigation context:** Reference data > Holiday calendars > Exchange holidays.
- **Sample data:** all rows, exchange names, GMI codes and CCP pairings are placeholders. Replace them with your reference data.

---

## 1. Page structure (top to bottom)

1. App bar (56 px)
2. Breadcrumb, title, subtitle and page actions
3. Filter card
4. Results card (toolbar, then List view or Calendar view)
5. Add / edit side panel (overlay)
6. Delete confirmation dialog (overlay)
7. Toast (transient confirmation)

---

## 2. App bar

- Left: logo mark and product name "Reference data".
- Primary nav: Exchanges, Clearing houses, **Holiday calendars** (active, blue underline), Product classes.

## 3. Title row

| Element | Content |
|---|---|
| Breadcrumb | Reference data / Holiday calendars / Exchange holidays |
| Title (H1) | Exchange holidays |
| Subtitle | Manage closures, early closes and late opens by exchange, CCP and product class. |
| Actions (right) | Import CSV (secondary), Export (secondary), **Add holiday** (primary) |

---

## 4. Filters

Five dropdowns in a responsive row, each with a visible label:

| Filter | Options |
|---|---|
| Region | All regions, Americas, EMEA, APAC |
| Product class | All product classes, Interest rates, Equity index, Energy, Metals, Agriculture, FX, Fixed income |
| Exchange | All exchanges, then the exchange master list |
| CCP | All CCPs, then the CCP master list |
| GMI code | All GMI codes, then the GMI code list (monospace) |

Behaviour:

- Filters combine with AND.
- Changing any filter resets the list to page 1.
- Applied filters appear as removable chips under the row, with a **Clear all** link. The chip row is hidden when nothing is applied.
- The search box (see section 5) also counts as an applied filter for the empty state and Clear all.
- Filters apply to both List and Calendar views.

---

## 5. Results card

### 5.1 Toolbar

- **Left, List view:** tabs Upcoming, Past, All, each with a count badge. Counts respect the current filters. "Upcoming" means date on or after today.
- **Left, Calendar view:** previous month, next month, month title (for example "December 2026"), Today button, and a count such as "7 holidays" for the displayed month.
- **Right:** List / Calendar segmented toggle, then a search box ("Search holiday name").

### 5.2 List view

Columns:

| Column | Content |
|---|---|
| Date | Short date (for example 25 Dec 2026) in monospace, weekday below |
| Holiday | Holiday name |
| Type | Badge: Full closure, Early close + time, or Late open + time |
| Exchange | Exchange name, region below |
| GMI | GMI code (monospace) |
| CCP | Clearing house name |
| Product classes | First two classes, plus a "+N" pill if more |
| Status | Badge: Active, Pending approval or Draft |
| Actions | Edit (pencil) and Delete (trash) icon buttons |

Details:

- 10 rows per page. Footer shows "Showing X–Y of Z holidays", previous and next buttons, and "Page N of M". Previous and next are disabled at the ends.
- Sort: date ascending then exchange for Upcoming and All; date descending for Past.
- Empty state: "No holidays match these filters" with **Clear all filters** (only when filters are applied) and **Add holiday**.
- Row hover highlights the row. Edit and Delete buttons carry accessible labels naming the holiday and exchange.

### 5.3 Calendar view

- Month grid, Monday to Sunday, 5 or 6 week rows depending on the month.
- Days outside the month are dimmed but still show their holidays. Weekends are lightly shaded. Today's date is a blue circle.
- Each holiday is a chip showing GMI code, holiday name, and time (for early close or late open). Hovering shows a full tooltip.
- Chip colour by type, with a legend above the grid:
  - Full closure: dark fill, white text
  - Early close: light amber fill, dark amber text
  - Late open: light blue fill, dark blue text
- A day shows up to 3 chips, then "+N more" expands that day in place, and "Show less" collapses it.
- Clicking a chip opens the edit panel. The **+** button on a day opens the add panel with that date pre-filled.

---

## 6. Add / edit panel (right drawer, 500 px)

Title is "Add holiday" or "Edit holiday". Subtitle is "New holidays start as a draft until approved." when adding, or "Last updated <date>" when editing.

| Field | Type | Rules |
|---|---|---|
| Holiday name | Text | Required |
| Date | Date picker | Required |
| Type | Select: Full closure, Early close, Late open | Required, default Full closure |
| Early close time / Late open time | Time | Shown only for Early close or Late open. Required when shown. Hint: exchange local time |
| Exchange | Select | Required |
| Region, CCP, GMI code | Read-only summary block | Filled automatically from the chosen exchange. Note: "Edit these in Exchanges and Clearing houses." |
| Product classes affected | Multi-select toggle chips | At least one required |
| Status | Select: Draft, Pending approval, Active | Default Draft |
| Notes | Textarea | Optional |

Footer:

- Edit mode: **Delete** (red, left), Cancel, **Save changes**.
- Add mode: Cancel, **Add holiday**.

Validation (shown inline on Save, field border turns red):

- "Enter a holiday name."
- "Pick a date."
- "Choose an exchange."
- "Enter a time." (when type is not Full closure)
- "Select at least one product class."

Closing: Cancel, the X button, or clicking the dimmed backdrop. On success the panel closes and a toast shows "Holiday added" or "Changes saved".

---

## 7. Delete confirmation (modal)

- Triggered from the row trash icon, or the Delete button in the edit panel.
- Title: "Delete this holiday?"
- Shows a summary: holiday name, then date, exchange (GMI code) and CCP.
- Body: "This removes the holiday from the exchange calendar. This cannot be undone."
- Buttons: Cancel, **Delete holiday** (red). On confirm, a toast shows "Holiday deleted".

---

## 8. Data model

| Field | Notes |
|---|---|
| id | Unique identifier |
| date | ISO date (YYYY-MM-DD) |
| name | Holiday name |
| type | Full closure, Early close or Late open |
| time | Local time (HH:MM), empty for Full closure |
| exchange | Exchange name |
| gmi | GMI code, derived from exchange |
| ccp | CCP name, derived from exchange |
| region | Americas, EMEA or APAC, derived from exchange |
| products | One or more product classes |
| status | Draft, Pending approval or Active |
| notes | Free text |
| updated | Date of last change |

Assumptions to confirm:

- Region, CCP and GMI code are derived from the exchange, not edited on the holiday.
- One holiday record applies to several product classes at once.
- A holiday belongs to exactly one exchange. Multi-exchange holidays are entered once per exchange.

---

## 9. Visual tokens

**Typeface:** IBM Plex Sans (UI), IBM Plex Mono (dates, GMI codes).

| Token | Value |
|---|---|
| Page background | #F4F5F7 |
| Surface | #FFFFFF |
| Border | #DDE1E7 (cards), #8A93A0 (inputs) |
| Text | #14181F (primary), #5B6472 (secondary), #3F4753 (labels) |
| Accent / primary | #1F4FD8 (hover #173FB0) |
| Danger | #9B1C1C (hover #8F1D1D) |
| Active status | text #14532D on #E6F4EA |
| Pending / early close | text #7A4100 on #FDF0D9 |
| Draft status | text #3F4753 on #EEF0F3 |
| Late open | text #173E9E on #E4ECFD |

Sizing: H1 28 px, body 14 px, labels 12 to 13 px, control height 40 px, icon buttons 44 px (32 px in the calendar day cells), corner radius 6 px for controls and 8 px for cards.

---

## 10. Accessibility

- Every input has a visible label. Required fields are marked with an asterisk.
- Filter chips, product chips and the view toggle use real buttons (product chips and view toggle expose pressed state).
- Icon-only buttons have accessible names.
- Dialogs use dialog roles with titles; the backdrop has a labelled close button.
- Visible focus ring (2 px blue) on all interactive controls.
- Status and type are always conveyed by text as well as colour.
- Text colours meet 4.5:1 contrast on their backgrounds.
- Known exception: calendar chips (26 px) and day "+" buttons (32 px) are smaller than 44 px for density.

---

## 11. Possible next additions

- Bulk select and bulk delete or bulk status change.
- Approval workflow actions for Pending approval items.
- Per-product-class exceptions within one holiday.
- Audit history on the edit panel.
- Dependent filters (choosing a region narrows exchanges, CCPs and GMI codes).

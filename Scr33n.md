# Screen Descriptions — Spec Visualizer & Workflow Editor (Salt DS) (Canonical)

> **Version:** Screen Desc v2 (supersedes v1)
> All v1 screens not explicitly changed carry forward unchanged.

-----

## Design Direction

**Aesthetic: Data / Financial**
`density="high"` · `mode="dark"` · Near-monochrome surfaces, tight gaps, tabular rhythm.

This is a governance and authoring tool used by technical makers and checkers. High density keeps the canvas productive. Dark mode reduces eye strain on long editing sessions. `SaltProvider` wraps the entire app with these settings. Open Sans is the body font; PT Mono is used for version strings, IDs, and JSON diff views.

-----

## 1. App Shell

**Pattern: App Shell / Navigation Shell (Pattern #1)**

The shell uses `SplitLayout` for the top bar and `StackLayout direction="row"` for the body zone.

**Top bar** — a full-width `SplitLayout` with `borderBottom` using `var(--salt-separable-primary-borderColor)` and background `var(--salt-container-secondary-background)`. Height is `var(--salt-size-base)`.

- Left `startItem`: app wordmark as `<H4>` + `<Breadcrumbs>` from `@salt-ds/lab` showing `MyApp / Workflows / submit-order`.
- Right `endItem`: a `<Chip>` showing the user’s role (e.g. `maker`), a **notification bell** `<Button appearance="transparent">` using `<NotificationIcon />` with a small numeric `<Badge>` for unread count positioned top-right of the icon (hidden when count is zero), and a `<Button appearance="transparent">` for the avatar.

Clicking the bell opens the Notification Center drawer (Screen 10). The bell badge count updates in real time as events occur.

**Left sidebar** — a `<StackLayout direction="column">` 220px wide using `var(--salt-separable-primary-borderColor)` as a right border. Uses `<NavigationItem>` from `@salt-ds/core` for each section; active item uses the `active` prop. Section group labels use `<Text styleAs="label">` in `var(--salt-content-secondary-foreground)`.

Navigation items: **Home, Workflows, Nodes, Review Queue, Notifications, Admin** (Admin visible to `admin` role only).

**Body** — `<StackLayout direction="row" style={{ flex: 1 }}>` with the canvas taking remaining space and a collapsible right `<Drawer position="right">` from `@salt-ds/lab` for the property editor.

-----

## 2. Home / App Overview Screen

**Pattern: Dashboard Layout (Pattern #2) + Breadcrumb + Page Header (Pattern #18)**

**Page header** — `<PageHeader>` using `<Breadcrumbs>` + `<H2>` for the app name + `<Text styleAs="notation">` for the last-updated timestamp.

**KPI row** — `<GridLayout columns={4} gap={2}>` with four `<Card>` components: total workflows, total nodes, pending review count, approved count. Each card uses `<Text styleAs="label">` caption + `<H3>` value. The “pending review” card includes a `<StatusIndicator status="warning" />` inline with the count.

**Canvas area** — Workflow View rendered below the KPI row. Each workflow cluster is a `<Card>` rendered inside React Flow as a custom node with `background: var(--salt-container-secondary-background)` and a `<StatusIndicator>` badge in the top-right. Edges between clusters use `var(--salt-separable-primary-borderColor)`.

**Load Spec** button — `<Button appearance="bordered">` using `<UploadIcon />` in the bottom-left.

**Export** button — `<Button sentiment="accented">` in the bottom-right.

-----

## 3. Flow View (Workflow Canvas)

**Patterns: Vertical Navigation Rail (#17) + Slide-in Drawer (#12) + Tabs-based Content Panel (#13) + Filterable List / Search + Results (#10)**

### Canvas filter rail

A horizontal `<FlowLayout gap={2}>` rail sits directly above the canvas area, below the breadcrumb header, with `background: var(--salt-container-secondary-background)` and a bottom border.

Contents left to right:

- `<Input>` with `<SearchIcon />` start adornment, `aria-label="Search canvas"`, 280px wide. Searches node labels, tags, descriptions, and IDs. Matching nodes highlight; non-matching nodes dim to `opacity: 0.3`.
- `<Dropdown>` for **status filter**: All, Draft, Submitted, In Review, Approved, Changes Requested, Rejected — multi-select.
- `<Dropdown>` for **category filter**: All, UI, Logic, Infra, Data, External — multi-select.
- `<Dropdown>` for **tag filter** — populated from tags present in the loaded spec — multi-select.
- `<ToggleButton>` group for **view mode**: Standard | Swim Lanes.
- `<Button appearance="transparent">` with `<RefreshIcon />` labelled “Clear filters” — enabled only when any filter is active.

Active filters render below the rail as dismissable `<Chip onClose={...}>` pills.

### Swim lanes

When “Swim Lanes” is active, the canvas divides into horizontal bands, one per category:

- Left-edge label: `<Text styleAs="label">` category name in `var(--salt-content-secondary-foreground)`.
- Lane separator: `var(--salt-separable-secondary-borderColor)`.
- Lane background alternates between `var(--salt-container-primary-background)` and `var(--salt-container-secondary-background)`.

Nodes auto-position within their category’s lane. Dagre auto-layout respects lane boundaries. Cross-lane edges are allowed and styled identically to in-lane edges.

### Left palette sidebar

`<StackLayout direction="column" gap={0}>` using the Vertical Navigation Rail pattern.

- `<Input>` with `<SearchIcon />` at the top — searches the **node palette** (not the canvas).
- Category sections rendered as `<Accordion>` from `@salt-ds/lab` (UI, Logic, Infra, Data, External).
- Each item: `<StackLayout direction="row" gap={2} align="center">` with a small colored `<StatusIndicator>` category dot + `<Text>` label.

Dragging a node onto the canvas creates a new workflow ref pinned to the **latest APPROVED version**. If no APPROVED version exists, the drag is prevented and a `<Tooltip>` explains why.

### Canvas nodes

Custom React Flow node components built from `<Card>`:

- **Left border** colored by category via a CSS variable override scoped to the node.
- **Header row** — `<StackLayout direction="row" justify="space-between">`:
  - Left: `<Text styleAs="label">` node label + PT Mono `<Text styleAs="notation">` showing the pinned version (e.g. `v1.1.0`).
  - Right: `<Chip>` for lifecycle status (`<StatusIndicator>` + text).
- **Tag row** — `<FlowLayout gap={1}>` of `<Chip appearance="transparent">` tag components.
- **Bottom-right badge row**:
  - **Newer-version indicator** — `<Chip appearance="bordered" sentiment="positive">↑ v1.2.0 available</Chip>` when a newer APPROVED version exists beyond the pinned one. Clicking opens the Workflow Upgrade Dialog (Screen 11).
  - **Comment count badge** — `<Chip>` with `<MessageIcon />` and the unresolved comment count. Hidden when zero. Clicking scrolls the right drawer to the Comments tab for that version.
- **REJECTED nodes** additionally show a `<Tooltip>` on a `<MessageIcon />` button; tooltip content is the reviewer’s most recent comment.

**Status chip colour mapping:**

|Status           |Salt `status` prop|Token                             |
|-----------------|------------------|----------------------------------|
|DRAFT            |`info`            |`--salt-status-info-background`   |
|SUBMITTED        |`info`            |custom accent                     |
|IN REVIEW        |`warning`         |`--salt-status-warning-background`|
|APPROVED         |`success`         |`--salt-status-success-background`|
|CHANGES REQUESTED|`warning`         |`--salt-status-warning-background`|
|REJECTED         |`error`           |`--salt-status-error-background`  |

### Floating toolbar

A `<Card>` with `var(--salt-overlayable-shadow)` floating above the canvas. `<StackLayout direction="row" gap={1}>` of `<Button appearance="transparent">` buttons: Select, Pan, Add Edge, Add Node, Auto-layout, Undo, Redo. Active tool uses `appearance="solid"`.

### Right property panel

A `<Drawer position="right">` from `@salt-ds/lab`. Tabs: **Details, Properties, Lifecycle, Comments, Version**.

**Details tab** — Single Column Form Layout with `<FormField>` + `<FormFieldLabel>` + `<Input>` / `<Textarea>` for: id (read-only, PT Mono), label, description, tags, category.

**Properties tab** — `<Grid>` from `@salt-ds/data-grid` with inline editing.

For categories **with a registered schema**:

- Known keys appear first as typed controls (`<Dropdown>` for enums, `<Input type="number">` for numbers, `<Checkbox>` for booleans).
- Invalid values render with `<FormFieldHelperText validationStatus="error">` showing the schema violation.
- `<StatusIndicator status="error" />` appears in the tab header when any field fails validation.
- Unknown keys render below the known keys (freeform preserved).
- Footer `<Text styleAs="notation">` reads “Schema: /specs/schemas/ui.schema.json” with a link icon.

For **unschematized categories**: pure freeform grid as in v1.

Saving a DRAFT with any validation error is blocked. A `<Dialog>` appears with “Fix now” (returns to the Properties tab, first error focused) or “Discard changes”.

**Lifecycle tab** — read-only summary: status, submittedBy, submittedAt, reviewedBy, reviewedAt, and contextually appropriate action buttons (Submit for Review, Withdraw Submission, etc.).

**Comments tab** — lists all unresolved comments on the currently displayed version. Each comment is a `<Card>` with author avatar, timestamp, body, and inline reply. Comments from a previous review cycle carry a `<Chip appearance="bordered" sentiment="caution">from previous review</Chip>` label. “Add comment” `<Textarea>` + `<Button>` at the bottom. A `<Dropdown>` at the top switches between “Unresolved”, “All”, and “Orphaned” views.

**Version tab** — reflects the versions-array model:

- `<StackLayout direction="column" gap={2}>` list of all versions.
- Each version is a `<Card>`:
  - Header `<SplitLayout>`: left shows PT Mono version + `<StatusIndicator>` + lifecycle status; right shows an overflow `<Menu>` with “View at this version”, “Compare to…”, “Duplicate as new DRAFT” (visible for APPROVED versions only, and only when no DRAFT exists).
  - Body: submittedBy, reviewedBy, reviewedAt as `<Text styleAs="notation">`, short description snippet.
- “Compare versions” `<Button appearance="bordered">` at the top opens a version-picker dialog using the Review Panel diff UI.

### Minimap

Bottom-right, rendered natively by React Flow with border `var(--salt-separable-secondary-borderColor)` and background `var(--salt-container-tertiary-background)`.

-----

## 4. Node Detail View

**Pattern: Slide-in Drawer / Side Panel (#12) + Tabs-based Content Panel (#13)**

A `<Drawer position="right">` at 640px wide overlaying the canvas. Drawer header uses `<SplitLayout>` — left: `<H3>` node label + `<Chip>` status badge + PT Mono version string; right: `<Button appearance="transparent">` close icon.

**Version tab** — full diff view. Diffs are computed between each version and its immediate predecessor in the `versions` array. Each transition is a before/after `<Card>` pair inside `<GridLayout columns={2} gap={2}>`. Diff content uses PT Mono via `font-family: var(--salt-text-code-fontFamily)`. Added lines: `var(--salt-status-success-foreground)`. Removed lines: `var(--salt-status-error-foreground)`. Unchanged lines: `var(--salt-content-secondary-foreground)`.

All other tabs (Details, Properties, Lifecycle, Comments) mirror the right property panel from Screen 3 at the wider drawer breakpoint.

-----

## 5. Maker-Checker — Submission Queue

**Pattern: Data Grid / Table (#3) + Filterable List / Search + Results (#10)**

**Page header** — `<Breadcrumbs>` + `<H2>Review Queue</H2>` + `<Text styleAs="notation">` pending count.

**Filter bar** — `<FlowLayout gap={2}>`:

- `<Input startAdornment={<SearchIcon />}>`
- `<Dropdown>` status filter
- `<Dropdown>` type filter (node / workflow)
- `<Dropdown>` submitter filter
- `<Dropdown>` category scope — when the checker has a scoped role, defaults to their scope but allows widening if permissions allow.

**Main table** — `<Grid>` from `@salt-ds/data-grid` with `density="high"`. Columns: Name, Type, Version (PT Mono cell renderer), Submitted By, Submitted At, Status. Status column: `<StatusIndicator>` + `<Text>` chip. Clicking a row opens the Review Panel as a `<Drawer>`.

-----

## 6. Review Panel

**Pattern: Master-Detail Layout (#4) + Dialog / Confirmation Modal (#11)**

Full-height `<Drawer position="right">` at 60% viewport width. Drawer header: `<SplitLayout>` with spec name + version in `<H3>` and three right-aligned actions: `<Button sentiment="accented">Approve</Button>`, `<Button sentiment="caution" appearance="bordered">Request Changes</Button>`, `<Button sentiment="negative" appearance="bordered">Reject</Button>`.

**Blocking dependency panel** — if reviewing a workflow, a `<Card>` at the top body lists all pinned node refs, their versions, and current lifecycle status. Non-APPROVED refs are highlighted with `<StatusIndicator status="error" />`. The Approve button is disabled with a `<Tooltip>` explaining why.

**Diff body** — `<GridLayout columns={2} gap={0}>`. Left column: previous APPROVED version header “v1.1.0 (current APPROVED)”. Right column: incoming version header “v1.2.0 (incoming)”. Each side renders read-only `<FormField>` blocks. Diff colour scheme matches Node Detail: green / red / muted.

**Comment thread** — `<StackLayout direction="column" gap={2}>` of comment `<Card>` bubbles (author, timestamp, body). Comments from a previous review cycle carry `<Chip appearance="bordered" sentiment="caution">from previous review</Chip>` inline; the maker can mark each as “Resolved” with a `<Button appearance="transparent">`. “Add comment” `<Textarea>` + `<Button appearance="solid">Submit</Button>` at the bottom; each comment can anchor to a specific field via a `<Dropdown>` labelled “Attach to:”.

**Action confirmation** — Approve / Reject / Request Changes each trigger a `<Dialog>`. Non-approvals require a `<Textarea>` comment before the confirm `<Button>` becomes enabled (controlled by empty-state check).

-----

## 7. Version History Viewer

**Pattern: Tabs-based Content Panel (#13) + Master-Detail Layout (#4)**

Accessible from the Version tab of the property panel or node detail drawer.

Vertical timeline: `<StackLayout direction="column" gap={0}>` of version `<Card>`s with left-border accent. Each card: `<SplitLayout>` — left: PT Mono version label + `<Text styleAs="notation">` author and date; right: `<StatusIndicator>` + lifecycle status at that version.

Selecting two entries via `<Checkbox>` enables `<Button appearance="bordered">Compare versions</Button>` — opens the Review Panel diff UI inside a `<Dialog>`.

-----

## 8. Export Modal

**Pattern: Dialog / Confirmation Modal (#11) + Tabs-based Content Panel (#13)**

Triggered by the Export button. `<Dialog>` with `aria-labelledby` pointing to `<H2>Export Spec</H2>`.

Three tabs: **Full**, **Approved Only**, **Delta**. The **Delta** tab carries a `<Chip appearance="bordered" sentiment="caution">Experimental</Chip>` next to its label, reflecting its stretch-goal status.

**Full / Approved Only tab**:

- `<FormField>` + `<FormFieldLabel>Scope</FormFieldLabel>` + `<Dropdown>` (Entire app / Specific workflow / Specific node).
- `<RadioButtonGroup>` for format: JSON or YAML (YAML marked “beta”).
- Read-only `<Textarea>` in PT Mono showing the file tree preview.
- `<DialogActions>`: `<Button sentiment="accented">Download ZIP</Button>` + `<Button appearance="bordered">Cancel</Button>`.

**Delta tab**:

- `<GridLayout columns={2} gap={3}>` with “From version” and “To version” `<Dropdown>`s.
- Same scope picker.
- `<Card>` previewing delta structure as formatted JSON in PT Mono, with added/removed colour tokens.
- `<Banner>` at the top: “Delta export is experimental. Most AI coding agents currently work from full specs; please validate that your target agent benefits from deltas before relying on this export.”
- `<Button sentiment="accented">Download Delta</Button>`.

-----

## 9. Import / Load Screen

**Pattern: File Upload Drop Zone (#16) + Empty State (#8)**

Centred `<Card>` with `var(--salt-overlayable-shadow)`, `maxWidth: 560px`. Inside: `<StackLayout direction="column" gap={4} align="center">`.

Heading: `<H2>Load a Spec</H2>` + `<Text>` subtitle.

Drop zone: `<FileDropZone>` from `@salt-ds/lab` with `<FileDropZoneIcon />` + `<Text>Drop your spec folder or ZIP here</Text>` + `<FileDropZoneTrigger accept=".zip,.json">or browse files</FileDropZoneTrigger>`.

**Validation report** (shown after upload): `<StackLayout direction="column" gap={1}>` of `<StatusIndicator>` + `<Text>` rows.

- Resolved references: `status="success"`.
- Warnings: `status="warning"`.
- Errors: `status="error"`.
- **Schema violations**: `status="error"` with file path, category, property path, and violation message in PT Mono.
- **Orphaned comments**: `status="warning"` with a link to the Orphaned Comments Panel.

`<Button sentiment="accented" disabled={hasErrors}>Open in Canvas</Button>` — enabled only when there are no blocking errors.

-----

## 10. Notification Center *(new in v2)*

**Pattern: Slide-in Drawer / Side Panel (#12) + Filterable List / Search + Results (#10)**

Triggered by the bell icon. `<Drawer position="right">` at 420px.

**Header** — `<SplitLayout>`: left `<H3>Notifications</H3>` + unread count in parentheses; right `<Button appearance="transparent">` “Mark all read” + close icon.

**Filter row** — `<FlowLayout gap={2}>`:

- `<ToggleButton>` group: All / Unread / Mentions.
- `<Dropdown>` event type: Submission, Approval, Rejection, Changes Requested, Comment, Upgrade Available.

**List body** — `<StackLayout direction="column" gap={0}>` of notification `<Card>` rows:

- Left: `<StatusIndicator>` category dot matching event type.
- Middle: `<Text styleAs="label">` event title + `<Text styleAs="notation">` relative timestamp.
- Right: overflow `<Menu>` with “Mark read”, “Open spec”, “Mute this spec”.
- Unread rows: subtle `var(--salt-status-info-background)` left-edge accent.
- Read rows: `var(--salt-content-secondary-foreground)` foreground.

Clicking a row marks it read, closes the drawer, and navigates to the relevant spec or Review Panel.

**Empty state** — Pattern #8 with `<NotificationIcon />` and “You’re all caught up.”

-----

## 11. Workflow Upgrade Dialog *(new in v2)*

**Pattern: Dialog / Confirmation Modal (#11)**

Triggered by the “↑ v1.2.0 available” chip on a node in an open workflow, or by “Check for node upgrades” in the workflow’s overflow menu.

`<Dialog>` with `<H2>Upgrade node version</H2>`.

**Body** — `<GridLayout columns={2} gap={3}>`:

- Left `<Card>`: currently pinned version — header `<SplitLayout>`: PT Mono version label + `<StatusIndicator>` + “APPROVED”; body: condensed field summary.
- Right `<Card>`: proposed version — `<Dropdown>` at the top to pick any APPROVED version newer than the current pin; body: same condensed field summary.

`<Banner sentiment="caution">` — “Upgrading will create a new DRAFT version of this workflow. The current workflow version remains unchanged until the new DRAFT is approved.”

If the upgrade involves a **major bump**, a second `<Banner sentiment="negative">` — “This is a major version bump. Review breaking changes carefully.” with a link to the full diff.

`<DialogActions>`: `<Button sentiment="accented">Create DRAFT with upgrade</Button>` + `<Button appearance="bordered">Cancel</Button>`.

-----

## 12. Scoped Role Editor — Admin Settings *(new in v2)*

**Pattern: Data Grid / Table (#3) + Dialog / Confirmation Modal (#11)**

Accessible only to `admin` role via the Admin nav item.

**Page header** — `<Breadcrumbs>` + `<H2>Roles & Permissions</H2>`.

**Main table** — `<Grid>` from `@salt-ds/data-grid` with `density="high"`. Columns: User, Role, Scope (`<Chip>` showing “Global”, “Category: infra”, or “Workflow: submit-order”), Assigned By, Assigned At, Actions. Actions cell: `<Menu>` with “Edit”, “Remove”.

Above the table: `<Button sentiment="accented">Add assignment</Button>`.

**Add / Edit Assignment dialog** — `<Dialog>` with:

- `<FormField>` + `<Dropdown>` for User (searchable).
- `<FormField>` + `<Dropdown>` for Role (maker / checker / viewer / admin).
- `<FormField>` + `<RadioButtonGroup>` for Scope type: Global / Category / Workflow.
- Conditional `<Dropdown>` for the specific category or workflow (shown unless Global is selected).
- `<Banner sentiment="info">` — “Global admin assignments override all scopes and can force-approve any spec. Grant sparingly.”

`<DialogActions>`: `<Button sentiment="accented">Save</Button>` + `<Button appearance="bordered">Cancel</Button>`.

Removing an assignment triggers a confirmation `<Dialog>` using Pattern #11.

-----

## 13. Orphaned Comments Panel *(new in v2)*

**Pattern: Filterable List / Search + Results (#10) + Empty State (#8)**

Accessible from the Comments tab (“Orphaned” dropdown), from the import validation report, or as a standalone nav item under each spec file.

**Header** — `<H3>Orphaned Comments</H3>` + `<Text styleAs="notation">` explanation: “Comments whose original target — a node, edge, or property — no longer exists in any version of this spec.”

**Filter row** — `<FlowLayout gap={2}>`: `<Input>` search + `<Dropdown>` for target type (node / edge / property / whole-spec).

**Body** — `<StackLayout direction="column" gap={2}>` of orphaned comment `<Card>`s:

- Header `<SplitLayout>`: left `<Text styleAs="label">` author + timestamp; right overflow `<Menu>` with “Archive”, “Re-attach to…”, “View original target path”.
- Body: comment text and replies (read-only — orphaned comments cannot be replied to).
- Footer: `<Text styleAs="notation">` showing the original target path in PT Mono (e.g. `properties.validation.required` on version 1.1.0).

**Empty state** — Pattern #8 with `<MessageIcon />` and “No orphaned comments.”

-----

## Key Constraints (All Screens)

- **No hardcoded hex colours** — status colours exclusively via `var(--salt-status-*)` tokens.
- **No hardcoded px spacing** — all gaps and padding via `var(--salt-spacing-*)` tokens (except fixed drawer/sidebar widths).
- **No raw HTML form elements** — `<Input>`, `<Textarea>`, `<Dropdown>`, `<Checkbox>`, `<RadioButton>` from `@salt-ds/core` only.
- **All layout** via `StackLayout` / `GridLayout` / `FlowLayout` / `SplitLayout` — no raw div flex.
- **Version strings and IDs** always rendered in PT Mono via `font-family: var(--salt-text-code-fontFamily)`.
- **Focus rings** never suppressed — Salt handles via `var(--salt-focused-outlineColor)`.
- **Every interactive element** has an `aria-label` or visible `<FormFieldLabel>`.
- **Schema validation errors** always use `<FormFieldHelperText validationStatus="error">` — never a custom error component.
- **Scope chips** (role assignments, filtered queues) use `<Chip appearance="bordered">` with category dot + PT Mono scope value — never a plain text string.

-----

## Salt DS Pattern Index

|Pattern                               |Screen(s)                                                                          |
|--------------------------------------|-----------------------------------------------------------------------------------|
|#1 App Shell / Navigation Shell       |All screens                                                                        |
|#2 Dashboard Layout                   |Home / App Overview                                                                |
|#3 Data Grid / Table                  |Submission Queue, Scoped Role Editor                                               |
|#4 Master-Detail Layout               |Review Panel, Version History                                                      |
|#5 Form Layout — Single Column        |Property Editor, Role Editor Dialog                                                |
|#8 Empty State                        |Import Screen, Notification Center, Orphaned Panel                                 |
|#10 Filterable List / Search + Results|Submission Queue, Flow View filter rail, Notifications, Orphaned Panel             |
|#11 Dialog / Confirmation Modal       |Export, Approve/Reject, Workflow Upgrade, Role Editor                              |
|#12 Slide-in Drawer / Side Panel      |Property Editor, Review Panel, Node Detail, Notification Center                    |
|#13 Tabs-based Content Panel          |Property Editor, Node Detail, Export Modal                                         |
|#16 File Upload Drop Zone             |Import / Load Screen                                                               |
|#17 Vertical Navigation Rail          |Flow View left palette sidebar                                                     |
|#18 Breadcrumb + Page Header          |All content screens                                                                |
|#20 Overflow / More Menu              |Node context menu, Version history row actions, Notification rows, Role assignments|

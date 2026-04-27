# Spec Visualizer & Workflow Editor — Project Plan (Canonical)

> **Version:** Plan v2 (supersedes v1)
> All v1 items not explicitly changed carry forward unchanged.

-----

## Overview

A visual spec management system that reads application specs, renders them as an interactive node-based graph (n8n-style), and allows users to create and edit workflows. Edited workflows are exported as structured specs intended to be consumed by AI agents for implementation.

**Out of scope:** AI agents that build code from specs.

**Core premise to validate before investing in the full build:** that a structured JSON spec produced by this tool measurably improves downstream AI agent output versus a well-written markdown equivalent. If it doesn’t, the tool’s value proposition collapses and the build should be reconsidered. Phase 0 is a real gate, not a checkbox.

-----

## Tech Stack

|Concern          |Choice                                           |
|-----------------|-------------------------------------------------|
|Framework        |React + Vite + TypeScript                        |
|Graph / Canvas   |React Flow                                       |
|Layout Algorithm |Dagre                                            |
|Spec Format      |JSON (canonical); YAML export as optional stretch|
|Design System    |Salt DS (`density="high"`, `mode="dark"`)        |
|Storage (initial)|Local filesystem / file upload; backend-agnostic |

-----

## Spec File Architecture

### Directory Layout

```
/specs
  app.spec.json                      ← root manifest
  /workflows
    submit-order.workflow.json
    load-positions.workflow.json
  /nodes
    order-form.node.json             ← contains ALL versions of this node
    validate-order.node.json
    positions-grid.node.json
  /edges
    submit-order.edges.json
    load-positions.edges.json
  /comments
    submit-order.comments.json       ← comments keyed to workflow + version
    order-form.comments.json         ← comments keyed to node + version
  /schemas
    ui.schema.json                   ← optional category property schemas
    logic.schema.json
```

### Root Manifest (`app.spec.json`)

```json
{
  "app": "MyApp",
  "specVersion": "1.0.0",
  "description": "...",
  "createdAt": "2026-04-23",
  "updatedAt": "2026-04-23",
  "workflows": [
    { "ref": "workflows/submit-order", "version": "1.2.0" },
    { "ref": "workflows/load-positions", "version": "1.0.1" }
  ],
  "nodes": [
    { "ref": "nodes/positions-grid", "version": "1.3.1" },
    { "ref": "nodes/order-form", "version": "2.0.0" }
  ]
}
```

Manifest refs always pin to a specific version. Workflows pin to specific node versions — changing a node does not break an approved workflow automatically.

-----

## Node Schema

`id` and `category` are immutable across all versions of a node. Within a version, only `label` is required; everything else is optional and freeform — **but** if the category has a registered schema, `properties` are validated against it on save.

### One file per logical node. All versions stored in a `versions` array.

```json
{
  "id": "order-form",
  "category": "ui",
  "createdAt": "2026-04-01T10:00:00Z",
  "versions": [
    {
      "version": "1.0.0",
      "label": "Order Form",
      "description": "Initial version",
      "properties": { "fields": ["symbol", "quantity"] },
      "tags": ["ui", "form"],
      "lifecycle": {
        "status": "approved",
        "submittedBy": "alice",
        "submittedAt": "2026-04-05T10:00:00Z",
        "reviewedBy": "bob",
        "reviewedAt": "2026-04-06T09:00:00Z"
      }
    },
    {
      "version": "1.1.0",
      "label": "Order Form",
      "description": "Added quantity validation",
      "properties": { "fields": ["symbol", "quantity"], "validate": true },
      "tags": ["ui", "form", "validated"],
      "lifecycle": { "status": "draft", "submittedBy": "alice" }
    }
  ]
}
```

**Suggested categories (non-exhaustive, user-extensible):**

|Category  |Meaning                                          |
|----------|-------------------------------------------------|
|`ui`      |Anything the user interacts with                 |
|`logic`   |Processing, transformation, validation, branching|
|`infra`   |Queues, functions, schedulers, cloud services    |
|`data`    |Databases, caches, views, queries                |
|`external`|Third-party APIs, services outside the system    |

### Category Schemas

Each category may register an optional JSON Schema that its nodes’ `properties` must conform to. Schemas live in `/specs/schemas/{category}.schema.json`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "trigger": { "enum": ["click", "submit", "hover", "focus"] },
    "form": { "type": "string" }
  },
  "additionalProperties": true
}
```

- `additionalProperties: true` preserves the freeform principle — extra keys are always allowed.
- Registered keys are validated on save; invalid specs cannot be submitted.
- Categories without a schema behave as fully freeform (v1 behaviour).

-----

## Edge Schema

Edges are node-version-aware. In practice they live on workflows and inherit the workflow’s pinned versions.

```json
{
  "id": "edge-001",
  "source": "order-form",
  "target": "validate-order",
  "label": "on submit",
  "description": "Triggers order validation when the user submits the form",
  "properties": { "async": true, "condition": "form.isValid" }
}
```

Only `source` and `target` are required. All other fields are freeform.

-----

## Workflow Schema

```json
{
  "id": "submit-order",
  "versions": [
    {
      "version": "1.2.0",
      "label": "Submit Trade Order",
      "description": "End-to-end flow from order form submission to DB persistence",
      "nodeRefs": [
        { "id": "order-form", "version": "1.1.0" },
        { "id": "validate-order", "version": "1.0.0" },
        { "id": "persist-order", "version": "1.3.1" }
      ],
      "edges": ["edge-001", "edge-002"],
      "lifecycle": { "status": "submitted", "submittedBy": "alice" }
    }
  ]
}
```

Node refs are always pinned. The workflow is self-contained at any given version.

-----

## Versioning — Fully Specified Mechanics

### Explicit rules

|Question                                                     |Answer                                                                                                                                        |
|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
|What is a new version?                                       |A new entry in the `versions` array. Not a new file.                                                                                          |
|How many DRAFT versions per node?                            |Exactly one. A maker cannot start a second DRAFT while one is in flight.                                                                      |
|Can an APPROVED version be edited?                           |No. Approved versions are immutable. Further changes create a new DRAFT version.                                                              |
|What does the canvas show by default?                        |The latest APPROVED version of each node.                                                                                                     |
|What does the canvas show when editing a workflow?           |The version the workflow pins to. Pinning is per-workflow, per-node.                                                                          |
|What happens when a node gets a new version?                 |Nothing automatic. A UI indicator appears: “newer version available (v1.2.0).” The maker must explicitly re-pin via a workflow upgrade action.|
|Can two workflows pin to different versions of the same node?|Yes. This is expected.                                                                                                                        |
|What is a workflow version?                                  |A snapshot of the workflow’s pinned refs. Editing a workflow creates a new workflow version in DRAFT.                                         |

### Bump semantics

|Bump     |When                                                      |
|---------|----------------------------------------------------------|
|**Patch**|Label change, description update, cosmetic config         |
|**Minor**|New property added (additive), new connection (additive)  |
|**Major**|Property removed, property type changed, node restructured|

-----

## Maker-Checker Lifecycle

Every spec file travels through a defined lifecycle tracked per file.

### State machine

```
DRAFT → SUBMITTED → IN REVIEW → APPROVED
                             ↘ CHANGES REQUESTED → DRAFT (with comments)
                   ↘ REJECTED → DRAFT (with comments)
```

### Rules

|Status             |Behaviour                                                        |
|-------------------|-----------------------------------------------------------------|
|`DRAFT`            |Editable by maker                                                |
|`SUBMITTED`        |Locked; awaiting review                                          |
|`IN REVIEW`        |Checker has picked it up; locked                                 |
|`APPROVED`         |Immutable; referenceable by other specs                          |
|`CHANGES REQUESTED`|Returns to DRAFT; comments persist flagged “from previous review”|
|`REJECTED`         |Returns to DRAFT; comments persist                               |

- A workflow version **cannot be SUBMITTED** if any pinned node version is still in DRAFT.
- A workflow version **cannot be APPROVED** unless all pinned node versions are APPROVED.

### Roles & Permissions

Roles are scope-aware from day one in the data model. The Phase 4 UI exposes global roles only; scoped role UI ships in Phase 6 without requiring a data migration.

|Role     |Permissions                                    |
|---------|-----------------------------------------------|
|`maker`  |Create, edit, submit (within scope)            |
|`checker`|Review, approve, reject, comment (within scope)|
|`viewer` |Read-only (within scope)                       |
|`admin`  |Override, reassign, force-approve (global)     |

Each role assignment carries an optional scope:

```json
{ "user": "alice", "role": "checker", "scope": { "category": "infra" } }
```

Supported scope types: `{ "category": "infra" }`, `{ "workflow": "submit-order" }`, or `{}` / omitted for global.

-----

## Comments Model

Comments are a first-class subsystem, not a Phase 4 bolt-on.

### Data model

Comments live in `/specs/comments/{spec-id}.comments.json` — separate files so commenting does not trigger spec version bumps.

```json
{
  "specId": "order-form",
  "specType": "node",
  "comments": [
    {
      "id": "c-001",
      "targetVersion": "1.1.0",
      "targetElement": { "type": "property", "path": "properties.validate" },
      "author": "bob",
      "createdAt": "2026-04-22T14:00:00Z",
      "resolvedAt": null,
      "body": "Should this be a boolean or a validator function?",
      "replies": [
        {
          "id": "c-001-r1",
          "author": "alice",
          "createdAt": "2026-04-22T15:00:00Z",
          "body": "Boolean for now. Can extend later."
        }
      ],
      "reviewCycle": "submit-cycle-3"
    }
  ]
}
```

### Rules

- Every comment is anchored to a **specific version** of a spec. Not a canvas position.
- Comments on deleted elements become **orphaned** — visible in a dedicated panel, readable, but not repliable.
- When a version returns to DRAFT after CHANGES REQUESTED, its comments persist flagged “from previous review” until resolved.
- Canvas rendering: a comment count indicator appears on nodes with unresolved comments at the currently rendered version.
- `targetElement` is optional; a comment can target the whole spec, a specific property path, or an edge.

-----

## Notifications

A governance tool without notifications requires Slack or email to function in practice.

### In-scope for Phase 4

- In-app notification center. Bell icon in the app shell with unread count badge.
- **Event triggers:** spec submitted (notifies relevant checkers), changes requested or rejected (notifies submitter), approved (notifies submitter), comment added (notifies spec owner and thread participants).
- **Outbound webhook.** A single configurable URL receives a POST per event. Slack / email / Teams integration is a user concern, not a build concern.

### Out of scope for Phase 4

- Per-user email delivery
- Digest emails
- Configurable subscription preferences (beyond mute / unmute)

-----

## Application Modules

### 1. Spec Parser / Importer

- Accept a folder, zip, or single manifest
- Validate manifest references resolve correctly
- Validate every node/workflow version against the manifest’s pinning
- Validate `properties` against category schemas where registered
- Normalize into internal graph state; auto-layout with Dagre
- Surface broken references, schema violations, and orphaned comments as warnings

### 2. Canvas (Graph Editor)

- React Flow canvas
- Left palette sidebar (drag-to-add; dragging creates a ref pinned to the latest APPROVED version; drag prevented if no APPROVED version exists)
- Right property panel (Slide-in Drawer)
- **Swim lanes** — toggleable, grouped by category — Phase 2 (not deferred to polish)
- **Canvas search and filters** — search by label, tag, status, category, version — Phase 2
- Minimap
- Zoom levels: workflow view / flow view / node detail
- Color coding by lifecycle status
- “Newer version available” indicators on nodes pinned below the latest APPROVED version
- Comment count indicators on nodes with unresolved comments

### 3. Workflow Authoring

- Create a new workflow (named, described)
- Drag nodes from palette — ref pinned to latest APPROVED version automatically
- Draw edges between node ports
- Configure node and edge properties (new DRAFT version created on first edit of an APPROVED spec)
- Save as DRAFT
- **Workflow upgrade action**: explicit re-pin to a newer node version, creates a new workflow version in DRAFT

### 4. Maker-Checker UI

- Submission queue — filterable by type, status, submitter, category scope
- Review panel — side-by-side diff of the version under review vs the previous APPROVED version
- Blocking dependency panel (for workflow reviews) listing all pinned node refs and their lifecycle statuses
- Approve / Reject / Request Changes (confirmation dialog; reason required for non-approvals)
- Comment threads, version-anchored, with “from previous review” flags
- Lifecycle status badge on every node on the canvas
- Blocking dependency indicators on the canvas

### 5. Notifications

- In-app bell with unread count
- Notification center panel (list, mark-read, jump-to-spec)
- Outbound webhook configuration in admin settings

### 6. Spec Exporter

- **Full export** — entire spec tree including all versions
- **Approved-only export** — every spec file stripped to APPROVED versions only
- **Scope selector:** single node | single workflow | full app
- Export format: JSON (canonical); YAML as beta / optional
- **Delta export: stretch goal only.** Build only if Phase 0 validation shows AI agents benefit from deltas.

-----

## Phase Plan

### Phase 0 — Validation *(GATE — gates everything else)*

- [ ] Draft schemas on paper
- [ ] Hand-author one example spec (one workflow, four to six nodes)
- [ ] Hand-author semantically equivalent markdown describing the same workflow
- [ ] Run both through the target AI coding agent with the same build prompt; compare output quality, coverage, and correctness
- [ ] Write up findings

**Exit criteria:** spec-driven output is measurably better than markdown-driven output on at least one dimension (completeness, fewer hallucinations, better file structure, correct framework choice). If this cannot be shown, pause and reframe before Phase 1.

**Time budget:** 3–5 days. This is a real gate.

-----

### Phase 1 — Foundation + Thin End-to-End Slice

- [ ] Project scaffold (Vite + React + TypeScript + Salt DS)
- [ ] Final schemas for node, edge, workflow, manifest, comments
- [ ] Category schema registry (loader only; enforcement in Phase 2)
- [ ] Spec parser: load manifest, resolve refs, validate structure
- [ ] Static canvas render with React Flow
- [ ] **Thin slice:** one hardcoded workflow, three nodes, togglable lifecycle states, working JSON export
- [ ] App shell with navigation

**Exit criteria:** can load a spec, see it on the canvas, toggle lifecycle states, export the JSON. End-to-end. No authoring yet.

-----

### Phase 2 — Canvas & Authoring

- [ ] Node palette sidebar with drag-to-add
- [ ] Edge drawing between nodes
- [ ] Property editor panel with **category schema validation on save**
- [ ] Freeform property editor for unschematized categories
- [ ] **Swim lanes toggle** (UI | Logic | Infra | Data | External)
- [ ] **Canvas search and filters** (label, tag, status, category)
- [ ] Save canvas state back to spec file structure
- [ ] Auto-create new DRAFT version on first edit of an APPROVED spec

-----

### Phase 3 — Versioning

- [ ] Version creation on edit (new DRAFT entry in versions array)
- [ ] Version pinning UI on workflow refs
- [ ] “Newer version available” indicators on canvas
- [ ] Workflow upgrade action (explicit re-pin to newer node version, creates new workflow DRAFT)
- [ ] Version history viewer (timeline per spec)
- [ ] Changelog auto-population on save

-----

### Phase 4 — Maker-Checker + Comments + Notifications

- [ ] Lifecycle state transitions with validation rules
- [ ] Role system (scope-aware data model; global UI)
- [ ] Submission queue
- [ ] Review panel with version diff
- [ ] Blocking dependency panel on workflow reviews
- [ ] Comments model and threads (version-anchored, “from previous review” flagging)
- [ ] In-app notification center
- [ ] Outbound webhook configuration
- [ ] Blocking dependency indicators on canvas

-----

### Phase 5 — Export

- [ ] Full export (zip of spec tree)
- [ ] Approved-only export (stripped tree)
- [ ] Scope selector (node / workflow / app)
- [ ] **Delta export: stretch goal only if Phase 0 validation showed AI agents benefit from deltas**

-----

### Phase 6 — Polish & Enterprise

- [ ] Scoped roles UI (exposing the data model defined in Phase 1)
- [ ] Zoom levels (workflow view ↔ flow view)
- [ ] Rejected node inline annotations
- [ ] Import validation warnings UI
- [ ] Minimap polish
- [ ] Optional YAML export
- [ ] Orphaned comments panel

-----

## Key Design Principles

1. **Validate the thesis before building the product.** Phase 0 is not optional.
1. **Freeform by default, schema where it matters.** Categories can declare schemas; all other properties remain freeform.
1. **Versioning mechanics are explicit.** One file per logical node, versions as array, immutable once approved, pinned by workflows.
1. **Governance is in the data model.** Scoped roles, version-anchored comments, notifications — all designed to avoid later migrations.
1. **Ship end-to-end slices, not vertical layers.** Every phase produces something a user can exercise end to end.
1. **Delta export is earned, not assumed.** Build it only when an AI agent that consumes deltas exists and Phase 0 confirms the need.
1. **Nodes carry no architectural assumptions.** Properties are freeform; the AI agent is responsible for interpretation.
1. **The spec format is the contract.** Export can be full or delta at any scope level; the structure must remain stable for downstream agents.

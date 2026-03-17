VS Code now supports `.agent.md` files — the main agent uses `tools: ['agent']` and an `agents` list to control exactly which sub-agents it can spawn. Sub-agents run in isolated contexts so they don't pollute each other's reasoning. This is exactly the passive file approach you want — no plugin, no server, just markdown files dropped into `.github/agents/`.

You can also run sub-agents in parallel — so the KB reader, planner, builder and reviewer can all be independent agents with clean contexts and appropriate tool permissions per role.

Let me build the full file set now.All 6 agent files ready. Here's the complete picture:

---

## How to install

Drop the `.github/agents/` folder into your repo root. That's it — no build step, no extension, no server.

```
your-project/
└── .github/
    └── agents/
        ├── cook.agent.md           ← orchestrator (the one you invoke)
        ├── cook-kb-reader.agent.md ← reads Salt/local/package/url
        ├── cook-planner.agent.md   ← creates step-by-step plans
        ├── cook-builder.agent.md   ← writes complete files
        ├── cook-scaffolder.agent.md← creates full feature boilerplate
        └── cook-reviewer.agent.md  ← validates no hallucinated APIs
```

---

## How to use

Open Copilot Chat, switch to the **Cook** agent from the dropdown, then type:

```
with:salt mode:query what token should I use for a disabled button?

with:salt mode:plan build a login form with validation

with:salt mode:build create a filterable data table with a toolbar

with:local path:./docs mode:scaffold add a settings page
```

---

## What happens under the hood

Each mode triggers a different sub-agent chain:

| Mode | Chain |
|---|---|
| `query` | KB Reader → Cook answers directly |
| `plan` | KB Reader → Planner |
| `build` | KB Reader → Planner → Builder → Reviewer |
| `scaffold` | KB Reader → Planner → Scaffolder → Reviewer |

Sub-agents run with isolated context — so the Builder only sees what the Planner produced, not the entire conversation history, keeping each agent's reasoning clean and focused. The Reviewer always runs last and fixes hallucinated component names or token values before you ever see the output.

Now update the KB Reader to check the index first, and the orchestrator to include the indexer:Here's how the indexer integrates into the full flow:

---

## The complete agent graph

```
User prompt
     │
     ▼
Cook (orchestrator)
     │
     ▼
Cook KB Reader  ──── first time? ──► Cook Indexer ──► writes .cook-index/<key>.md
     │                                    │
     │           version changed? ────────┘ (re-crawls + updates the file)
     │
     │           cache hit? → reads .cook-index/<key>.md directly (instant)
     │
     ▼
 relevant sections
     │
     ├── mode:query  → Cook answers directly
     ├── mode:plan   → Cook Planner
     ├── mode:build  → Cook Planner → Cook Builder → Cook Reviewer
     └── mode:scaffold → Cook Planner → Cook Scaffolder → Cook Reviewer
```

---

## How the index cache works

The Indexer writes to `.cook-index/` at the workspace root — commit this folder so the whole team shares the cache:

```
your-project/
└── .cook-index/
    ├── README.md                              ← auto-generated explanation
    ├── salt.md                                ← all Salt tokens + component exports
    ├── local-docs.md                          ← your ./docs folder indexed
    ├── package-react-hook-form.md             ← npm package indexed
    └── url-tanstack-com-query-latest-docs.md  ← remote URL crawled (2 levels deep)
```

Each file has a `<!-- COOK_META -->` block at the top tracking version, last-modified timestamp, and a content fingerprint. Change detection is automatic — the Indexer compares these on every request and only re-crawls when something actually changed, like a package version bump or new files in your docs folder.

---

## What the user sees

| Situation | Message |
|---|---|
| First request against a source | `📥 First-time index created — future requests will be instant` |
| Subsequent requests, nothing changed | `⚡ Loaded from cache` |
| Package upgraded / docs changed | `🔄 Index updated — source changed since last crawl` |
| User says "re-index" | Forces full re-crawl bypassing change detection |

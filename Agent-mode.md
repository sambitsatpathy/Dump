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

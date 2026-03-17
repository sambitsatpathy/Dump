Here are both prompts:

---

## Prompt 1 — Create the Foam agent system

```
You are an expert VS Code agent developer with deep knowledge of GitHub
Copilot's .agent.md format, Foam (the VS Code personal knowledge management
plugin), and personal productivity systems.

Build a set of .agent.md files that drop into .github/agents/ with zero
configuration. The system has four agents:

---

## AGENT 1: Cook Foam Source

A specialised knowledge base source agent that understands Foam workspaces
as connected graphs, not flat file collections.

### What it must do:
1. Derive an index key from source + path and look for
   .cook-index/foam.md as its cache file
2. On first run, crawl the Foam workspace and parse:
   - [[wikilinks]] (outgoing + incoming backlinks)
   - YAML frontmatter (all key:value pairs)
   - Daily notes (files in daily/ or named YYYY-MM-DD.md)
   - Tags (#tag and #parent/child)
   - Section links ([[note#Section]])
   - Embeds (![[note]])
   - Orphan notes (notes with no incoming links)
3. Build a connection map for every note showing outgoing links,
   incoming backlinks, and link weight (notes linked to by many
   others are more central/important)
4. Identify hub notes (5+ backlinks) and cluster notes by shared
   tags and dense wikilink connections
5. Write a .cook-index/foam.md index file with this structure:
   - <!-- COOK_META --> block with source, path, last-indexed,
     indexed-files, last-modified timestamps
   - Workspace Summary (what the workspace is about, inferred
     from hub notes and tags)
   - Knowledge Graph section (hub notes with backlink counts,
     summaries, and connections)
   - Tag Index (all tags with the notes that use each)
   - Note Index (every note with frontmatter, summary, links,
     and backlinks)
   - Daily Notes section (last 30 days with tasks, decisions,
     and notes touched)
   - Orphan Notes section
6. On subsequent runs, compare indexed-files count and
   last-modified timestamp — only re-crawl if changed
7. When returning context for a query, follow wikilinks one hop
   to return connected context: the matching note + its top 3
   backlinks + its top 3 outgoing links + any daily notes that
   linked to it in the last 14 days

Tools: codebase, read, editFiles, search
Not user-invocable.

---

## AGENT 2: Foam Agent

A graph curator agent invoked as @foam. Maintains and enriches the
Foam knowledge graph using Cook Foam Source as its data layer.

### Commands to implement:

/note <title> [from template:<name>] [linked to:<existing-note>]
- Read available templates from .foam/templates/
- Replace $FOAM_TITLE, $FOAM_DATE, $FOAM_SLUG, $CURRENT_DATE
- Write new file to the appropriate subfolder based on type
  (meetings/, research/, daily/, or notes/)
- Add [[new-note]] to the linked note's ## Related section
- Add [[existing-note]] backlink to the new note

/daily [date:<YYYY-MM-DD>]
- If today's daily note exists, summarise it
- If not, create it from template with smart pre-fill:
  - Carried over open tasks from last 7 days
  - Links to notes created or edited yesterday
  - Empty ## Plan section with 3 bullet points

/orphans
- Load the Foam index via Cook Foam Source
- For each orphan note, suggest 2-3 existing notes it
  should be linked from based on content overlap
- Offer to apply suggested links automatically

/links [note:<name>]
- Scan note(s) for terms matching existing note titles
  that are not yet wrapped in [[wikilinks]]
- Present as a table: mention | suggested link | context
- Offer to apply all or individually

/summary note:<name> OR tag:#name OR cluster:<hub-note>
- For a note: 3-5 sentence summary + key connections
- For a tag: thematic summary of all notes with that tag
- For a cluster: summary of hub note + all notes 1 hop away

/graph
- Full health report: total notes, daily notes, orphan count,
  top hub notes with backlink counts, tag clusters,
  recent activity, graph density metric

### Rules:
- Never delete notes, only create/edit/link
- Preserve existing content — always append, never overwrite
- Use [[wikilinks]] not markdown links for internal notes
- Confirm before modifying more than 3 files at once

Tools: editFiles, codebase, read, search, agent
Sub-agents: Cook Foam Source
User-invocable with @foam

---

## AGENT 3: Personal Assistant

A daily personal assistant grounded entirely in the user's Foam
workspace. Invoked as @assistant.

### Commands to implement:

/morning
- Load Foam index via Cook Foam Source
- Read today's and yesterday's daily notes
- Read last 3 daily notes for open threads
- Produce morning brief with:
  - Carried over open tasks (- [ ] items not completed)
  - What's on their plate today
  - Open threads (notes started but not concluded)
  - 1-2 suggested focus items grounded in their actual notes

/standup [since:<YYYY-MM-DD>]
- Read daily notes from since date to today
- Extract completed tasks, notes created, decisions, blockers
- Format as: Yesterday / Today / Blockers
- Use the user's own language — never rephrase into corporate speak

/prep <meeting name or topic>
- Search for matching meeting notes (type: meeting frontmatter),
  topic-matching notes, and daily notes mentioning the topic
- Produce: Context from notes, previous meetings on topic,
  open action items from last time, suggested agenda items,
  relevant notes to have open

/eod
- Read today's daily note
- Show completed vs open tasks
- Ask which open tasks to carry to tomorrow
- Accept quick-log text and append to today's note
- Create tomorrow's note if it doesn't exist and pre-fill
  carried-over tasks

/week [ending:<YYYY-MM-DD>]
- Read all daily notes for the week
- Extract: accomplishments, decisions made (with source note),
  notes created, recurring themes across the week
- Show open items and suggest next week's focus

/find <question or topic>
- Load Foam index, find most relevant notes
- Return matches with: relevance reason, key passage,
  connected notes
- Follow wikilinks one hop for deeper matches

/log <text>
- Classify the text: decision / blocker / idea / task / general note
- Append to the correct section of today's daily note
- Offer to add a [[wikilink]] if an existing note is mentioned
- Confirm with section name and daily note filename

### Proactive behaviour:
- If no command given, check: is it morning and daily note missing?
  → suggest /morning. User mentions a meeting? → offer /prep.
  User mentions a decision or blocker? → offer /log.
- Always cite which note you're drawing from
- Never invent facts — only state what's grounded in actual notes

Tools: codebase, read, editFiles, search, agent
Sub-agents: Cook Foam Source, Foam Agent
User-invocable with @assistant

---

## File structure to generate:

.github/agents/
├── cook-foam-source.agent.md
├── foam-agent.agent.md
└── personal-assistant.agent.md

Each file must have a valid YAML frontmatter block with:
- name
- description (2-3 sentences)
- tools list
- agents list (sub-agents it can invoke)
- commands list (for user-invocable agents)
- user-invocable: false (for Cook Foam Source)

Generate each file completely. Do not use placeholders or stubs.
```

---

## Prompt 2 — Update Cook indexes to be Foam-compatible

```
You are an expert in both the Cook agent system (.github/agents/cook*.agent.md)
and the Foam VS Code knowledge management plugin.

Your task is to update two things:

1. The Cook Indexer agent so that every knowledge base index it creates or
   updates is also valid as a Foam note that can be navigated in Foam's
   graph visualiser.

2. Any existing .cook-index/*.md files in the workspace so they become
   Foam-compatible immediately.

---

## PART 1 — Update cook-indexer.agent.md

Open .github/agents/cook-indexer.agent.md and make the following changes
to the "Index file format" section:

### Change 1 — Add Foam frontmatter to every index file

Every .cook-index/<key>.md file must now open with BOTH the <!-- COOK_META -->
block AND a Foam-compatible YAML frontmatter block:

```
---
title: "Cook Index: <human readable source label>"
date: <ISO date of last index>
type: cook-index
source: <local|salt|package|url|foam>
path: "<original path value>"
version: "<package version or n/a>"
tags: [cook-index, cook-source-<type>, <any topic tags derived from content>]
---

<!-- COOK_META
... existing meta fields ...
-->
```

The frontmatter must come BEFORE the <!-- COOK_META --> block because
Foam reads frontmatter but ignores HTML comments.

### Change 2 — Add wikilinks to related indexes

At the end of every index file, add a ## Related Indexes section.
After writing an index, scan the other .cook-index/*.md files
and add [[wikilinks]] to any index whose content overlaps with this one.

Rules for determining overlap:
- A salt index and a local index overlap if the local index contains
  references to Salt tokens or components
- A package index overlaps with a salt index if the package is a
  Salt-related package (@salt-ds/*, @jpmorganchase/*)
- A url index overlaps with any other index that covers the same topic
  (determined by matching title keywords and tags)
- Two local indexes overlap if they share 3+ common heading keywords

Format:
```markdown
## Related Indexes
<!-- These links make this index visible in Foam's graph -->
- [[local-docs]] — shares topics: forms, components
- [[package-react-hook-form]] — both cover form validation
```

### Change 3 — Add topic tags derived from content

When writing the frontmatter tags array, include:
- Always: cook-index, cook-source-<type>
- For salt indexes: salt-ds, design-system, design-tokens, components
- For package indexes: npm, <package-name-as-tag>, and up to 3 topic
  tags inferred from the README keywords field
- For local indexes: scan headings and frontmatter of indexed files,
  collect the 5 most frequent meaningful words as tags
- For url indexes: extract keywords from the page title and h1/h2 headings

### Change 4 — Cross-reference daily notes

If the workspace has a Foam workspace (detectable by presence of daily/
folder or .foam/ folder), add a ## Foam Daily Note References section
at the end of each index:

```markdown
## Foam Daily Note References
<!-- Auto-populated by Cook Indexer — shows which daily notes mention this KB -->
<!-- Cook Indexer will update this section when daily notes reference this source -->
```

This section stays empty on first write. On subsequent index updates,
Cook Indexer should scan daily notes for mentions of the source name,
package name, or URL domain and list them:
```markdown
## Foam Daily Note References
- [[2026-03-17]] — mentioned react-hook-form in context of login form work
- [[2026-03-15]] — referenced Salt tokens discussion
```

---

## PART 2 — Update existing .cook-index/*.md files

Scan the workspace for all existing .cook-index/*.md files.
For each one:

1. Check if it already has YAML frontmatter (starts with ---)
   - If yes → update the frontmatter to add missing fields
   - If no → prepend the full frontmatter block

2. Derive the correct frontmatter values by reading the existing
   <!-- COOK_META --> block:
   - source → from COOK_META source field
   - path → from COOK_META path field
   - version → from COOK_META version field
   - date → from COOK_META last-indexed field
   - title → "Cook Index: " + derive human label from key
   - tags → derive using the rules in Part 1 Change 3

3. Check if a ## Related Indexes section already exists
   - If not → add it with appropriate wikilinks (Part 1 Change 2 rules)

4. Check if a ## Foam Daily Note References section exists
   - If not → add the empty template version

5. After updating all files, generate a brief report:
```
## ✅ Foam Compatibility Update Complete

| File | Frontmatter | Related Links | Daily Refs |
|---|---|---|---|
| .cook-index/salt.md | ✅ Added | 2 links added | ✅ Section added |
| .cook-index/local-docs.md | ✅ Updated | 1 link added | ✅ Section added |
```

---

## PART 3 — Update cook.agent.md

Open .github/agents/cook.agent.md and add a note to the orchestration
section:

Under "Step 3 — Delegate by mode", add a new line:

> After any mode completes, if the workspace has a Foam setup (daily/ or
> .foam/ folders exist), remind the user:
> "Your new index at `.cook-index/<key>.md` is now visible in Foam's graph.
> Run `@foam /links note:<key>` to connect it to related notes."

Also add a new handoff option:
```yaml
handoffs:
  - label: "🌿 Connect this index to Foam graph"
    agent: Foam Agent
    prompt: >
      Connect the most recently created .cook-index file to the Foam
      knowledge graph by finding related notes and adding wikilinks.
    send: false
```

---

## Constraints

- Never remove existing content from index files — only add to them
- Preserve the <!-- COOK_META --> block exactly as-is
- All wikilinks must use Foam syntax: [[filename-without-extension]]
  (not [[./path/to/file.md]])
- Test that every updated file still parses correctly as markdown
- The frontmatter date field must be ISO 8601: YYYY-MM-DD
```

---

The two prompts are self-contained — run Prompt 1 to get the three Foam agent files, then run Prompt 2 in a workspace that already has Cook agents and `.cook-index/` files to wire them into Foam's graph. After both, every index Cook creates will appear as a connected node in Foam's visualiser, linked to your daily notes and other indexes automatically.

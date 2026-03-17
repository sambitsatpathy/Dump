# 👨‍🍳 Cook — Pluggable Knowledge Base for GitHub Copilot

> Ask Copilot questions grounded in **any** knowledge base — Salt Design System, local docs folders, npm packages, or remote URLs — using a single `@cook` chat participant.

---

## Table of Contents

- [What is Cook?](#what-is-cook)
- [Why Cook?](#why-cook)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
  - [Basic Syntax](#basic-syntax)
  - [Knowledge Base Sources](#knowledge-base-sources)
  - [Slash Commands](#slash-commands)
- [Architecture](#architecture)
  - [File Structure](#file-structure)
  - [How It Works](#how-it-works)
  - [The KnowledgeBase Interface](#the-knowledgebase-interface)
- [Built-in Knowledge Bases](#built-in-knowledge-bases)
  - [--with salt](#--with-salt)
  - [--with local](#--with-local)
  - [--with package](#--with-package)
  - [--with url](#--with-url)
- [Adding a Custom Knowledge Base](#adding-a-custom-knowledge-base)
- [Running in Development](#running-in-development)
- [Building & Publishing](#building--publishing)
- [Relationship to Salt Copilot Assistant](#relationship-to-salt-copilot-assistant)
- [Roadmap](#roadmap)

---

## What is Cook?

Cook is a VS Code extension that registers a **`@cook`** participant in GitHub Copilot Chat. Unlike the built-in `@workspace` participant (which only knows about your open project), Cook lets you **point Copilot at any knowledge base** at query time using a `--with` flag.

```
@cook --with salt what token should I use for a primary button background?
@cook --with local --path ./docs how do I configure dark mode?
@cook --with package --path react-hook-form how do I validate an email field?
@cook --with url --path https://tanstack.com/query/latest/docs how do I use useQuery?
```

The LLM's answer is **grounded in the content of that knowledge base** — not in its general training data — so you get accurate, version-specific answers.

---

## Why Cook?

| Problem | Cook's solution |
|---|---|
| Copilot hallucinates APIs for libraries it doesn't know well | Cook reads the actual `.d.ts` files from `node_modules` |
| Internal docs aren't in Copilot's training data | Cook reads your local markdown files at query time |
| Salt Design System has 200+ tokens — hard to remember them all | Cook reads Salt's CSS theme files directly |
| Different projects use different design systems | Swap knowledge bases with `--with` — no reinstalling |
| Generic Copilot answers don't respect your installed version | Cook reads `package.json` version and includes it in context |

### What makes Cook different from existing solutions

Most Copilot extensions that add "documentation awareness" are either:
- **Locked to one source** (e.g. a GitBook extension only works with GitBook)
- **Hardcoded** (ship with a static snapshot of docs that goes stale)
- **Workspace-only** (only know about files already in your project)

Cook is **source-agnostic and runtime-dynamic** — it reads live data from wherever you point it, and you can add new sources by implementing a single TypeScript interface.

---

## Prerequisites

- **VS Code** `v1.90.0` or later
- **GitHub Copilot** extension installed and signed in (required for the chat participant API)
- **GitHub Copilot Chat** extension installed
- **Node.js** `v20+`

---

## Installation & Setup

### From source (development)

```bash
# 1. Clone or copy the cook-copilot folder
cd cook-copilot

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Open in VS Code
code .

# 5. Press F5 to launch the Extension Development Host
```

A second VS Code window opens with Cook loaded. All `@cook` commands work in that window.

### From a `.vsix` package

```bash
npm run package          # generates cook-copilot-0.1.0.vsix
code --install-extension cook-copilot-0.1.0.vsix
```

---

## Usage

### Basic Syntax

```
@cook --with <source> [--path <value>] <your question>
```

| Part | Required | Description |
|---|---|---|
| `--with <source>` | ✅ Yes | Which knowledge base to use (`salt`, `local`, `package`, `url`) |
| `--path <value>` | Depends on source | A folder path, URL, or package name (required for `local`, `package`, `url`) |
| `<your question>` | ✅ Yes | Your natural language question |

### Knowledge Base Sources

#### Salt Design System

```
@cook --with salt <question>
```

Reads token CSS files and TypeScript declarations directly from your project's
`node_modules/@salt-ds`. No path needed — Cook finds Salt automatically.

**Examples:**
```
@cook --with salt what token should I use for a primary button background?
@cook --with salt what is the difference between Dropdown and ComboBox?
@cook --with salt show me how to build an accessible form with validation
@cook --with salt which components are in @salt-ds/lab vs @salt-ds/core?
```

---

#### Local Docs Folder

```
@cook --with local --path <folder or file> <question>
```

Reads `.md`, `.mdx`, `.txt`, and `.html` files from the given path. Paths can be
relative to the workspace root or absolute.

**Examples:**
```
@cook --with local --path ./docs how do I set up theming?
@cook --with local --path ./CONTRIBUTING.md what is the PR process?
@cook --with local --path /home/me/company-wiki how do we handle auth?
```

Cook chunks the files, scores each chunk by keyword overlap with your query,
and injects the most relevant chunks into the LLM context.

---

#### npm Package

```
@cook --with package --path <package-name> <question>
```

Reads the package's README, TypeScript declaration files (`.d.ts`), and
`package.json` from `node_modules`. The package must be installed in the
current workspace.

**Examples:**
```
@cook --with package --path react-hook-form how do I handle async validation?
@cook --with package --path @tanstack/react-table how do I implement row sorting?
@cook --with package --path zod how do I validate a union type?
@cook --with package --path framer-motion how do I animate on scroll?
```

---

#### Remote URL

```
@cook --with url --path <https://...> <question>
```

Fetches the page at the given URL, strips HTML, and uses the text content
as context. Works best with documentation pages (not search pages or dashboards).

**Examples:**
```
@cook --with url --path https://react.dev/reference/react/useState what are the rules for useState?
@cook --with url --path https://docs.stripe.com/api/payment_intents how do I create a PaymentIntent?
@cook --with url --path https://saltdesignsystem.com/salt/components/button/examples show me all Button variants
```

> **Note:** Cook respects the page's content length. Very large pages are capped
> at ~30,000 characters to stay within the LLM context window.

---

### Slash Commands

Run these inside the `@cook` participant:

| Command | Description |
|---|---|
| `@cook /sources` | Lists all registered knowledge bases and whether they're available in the current workspace |
| `@cook /help` | Shows usage instructions and examples |

---

## Architecture

### File Structure

```
cook-copilot/
├── src/
│   ├── extension.ts              # Activation entry point
│   ├── router.ts                 # KnowledgeBaseRouter, parseArgs(), interfaces
│   ├── chatParticipant.ts        # @cook Copilot chat handler + streaming
│   └── sources/
│       ├── saltKnowledgeBase.ts  # --with salt: reads node_modules/@salt-ds
│       ├── localKnowledgeBase.ts # --with local: reads local files
│       ├── packageKnowledgeBase.ts # --with package: reads any npm package
│       └── urlKnowledgeBase.ts   # --with url: fetches remote pages
├── package.json                  # Extension manifest + contributes
├── tsconfig.json
└── esbuild.config.js
```

### How It Works

```
User types: @cook --with local --path ./docs how do I configure theming?
                       │
                       ▼
              1. parseArgs()
                 Extracts: { with: "local", path: "./docs", query: "how do I configure theming?" }
                       │
                       ▼
              2. KnowledgeBaseRouter.resolve("local")
                 Returns: LocalKnowledgeBase instance
                       │
                       ▼
              3. kb.isAvailable(workspaceRoot)
                 Checks path exists → true
                       │
                       ▼
              4. kb.getContext(query, args, workspaceRoot)
                 Walks ./docs, reads .md files,
                 chunks content, ranks by keyword overlap
                 Returns: { chunks: [...], sourceLabel: "Local: ./docs (12 files)" }
                       │
                       ▼
              5. formatContextForPrompt(kbContext)
                 Assembles chunks into a system prompt block
                       │
                       ▼
              6. vscode.lm.selectChatModels({ family: "gpt-4o" })
                 Sends: [system prompt with KB context] + [user query]
                       │
                       ▼
              7. Streams response back to Copilot Chat
                 "> 📖 Answering from Local: ./docs (12 files)"
                 [LLM answer grounded in your docs]
```

### The KnowledgeBase Interface

Every knowledge base source implements this interface from `router.ts`:

```typescript
interface KnowledgeBase {
  // Matches the --with flag value
  readonly id: string;

  // Shown in /sources list and response headers
  readonly displayName: string;

  // Return false to show a "not available" warning instead of querying
  isAvailable(workspaceRoot: string | null): Promise<boolean>;

  // Return chunks of relevant text to inject into the LLM system prompt
  getContext(
    query: string,
    args: CookArgs,       // full parsed args including --path
    workspaceRoot: string | null
  ): Promise<KnowledgeBaseContext>;
}

interface KnowledgeBaseContext {
  chunks: ContextChunk[];   // text fragments to inject
  sourceLabel: string;      // shown to the user, e.g. "Salt v3.2.0"
  meta?: Record<string, string>;
}

interface ContextChunk {
  content: string;   // the text to inject
  source: string;    // file path, URL, etc. — shown in attribution
  score?: number;    // optional relevance score 0–1
}
```

---

## Built-in Knowledge Bases

### `--with salt`

**File:** `src/sources/saltKnowledgeBase.ts`

Reads three things from `node_modules/@salt-ds`:

1. **Package versions** — from `@salt-ds/core/package.json` and `@salt-ds/lab/package.json`
2. **CSS design tokens** — from `@salt-ds/theme/css/*.css`, filtered to files relevant to the query (e.g. a color question only loads color token files)
3. **Component exports** — from `@salt-ds/core/dist/index.d.ts` and `@salt-ds/lab/dist/index.d.ts`, extracting exported function/const declarations

The token files are filtered per-query using keyword hinting:

| Query contains | CSS files loaded |
|---|---|
| color, theme, palette | `*color*.css` |
| spacing, margin, padding | `*spacing*.css` |
| font, text, typography | `*typography*.css` |
| shadow, elevation | `*shadow*.css` |
| (generic) | First 4 CSS files |

---

### `--with local`

**File:** `src/sources/localKnowledgeBase.ts`

1. Resolves `--path` relative to the workspace root (or uses it as absolute)
2. Recursively walks the directory collecting `.md`, `.mdx`, `.txt`, `.html` files (max 50 files)
3. Chunks each file by heading boundaries, then paragraph boundaries
4. Scores each chunk by counting query term occurrences
5. Returns the top 20 most relevant chunks (capped at 40,000 total characters)

HTML files have tags stripped before chunking.

---

### `--with package`

**File:** `src/sources/packageKnowledgeBase.ts`

Reads from `node_modules/<package-name>`:

1. **`package.json`** — name, version, description, keywords, peer dependencies
2. **README** — split into sections, top 8 most relevant returned
3. **TypeScript declarations** — resolves via `types` field in `package.json`, falls back to `dist/index.d.ts`
4. **CHANGELOG** — only loaded if the query mentions "change", "version", "update", "release", or "migrate"

---

### `--with url`

**File:** `src/sources/urlKnowledgeBase.ts`

1. Fetches the URL with a Node.js `https.get` call (8 second timeout, follows up to 3 redirects)
2. Strips `<script>`, `<style>`, `<nav>`, `<header>`, `<footer>` blocks
3. Preserves heading structure (converts `<h1>`–`<h4>` to markdown `#` syntax)
4. Preserves `<pre>` code blocks
5. Strips remaining HTML tags and decodes entities
6. Chunks by heading, ranks by query relevance, returns top 12 sections

---

## Adding a Custom Knowledge Base

1. **Create your source file** in `src/sources/`:

```typescript
// src/sources/confluenceKnowledgeBase.ts
import { KnowledgeBase, KnowledgeBaseContext, CookArgs } from "../router";

export class ConfluenceKnowledgeBase implements KnowledgeBase {
  readonly id = "confluence";
  readonly displayName = "Confluence";

  async isAvailable(workspaceRoot: string | null): Promise<boolean> {
    // Check if a Confluence token is configured in VS Code settings
    const config = vscode.workspace.getConfiguration("cook");
    return !!config.get<string>("confluenceToken");
  }

  async getContext(
    query: string,
    args: CookArgs,
    workspaceRoot: string | null
  ): Promise<KnowledgeBaseContext> {
    const spaceKey = args.path; // e.g. --path MY-SPACE
    // ... fetch pages from Confluence API, return chunks
    return {
      chunks: [...],
      sourceLabel: `Confluence: ${spaceKey}`,
    };
  }
}
```

2. **Register it** in `src/extension.ts`:

```typescript
import { ConfluenceKnowledgeBase } from "./sources/confluenceKnowledgeBase";

export async function activate(context: vscode.ExtensionContext) {
  KnowledgeBaseRouter.registerDefaults();
  KnowledgeBaseRouter.register(new ConfluenceKnowledgeBase()); // ← add this
  registerChatParticipant(context);
}
```

3. **Use it immediately:**

```
@cook --with confluence --path ENG-DOCS how do we handle auth?
```

That's it — no changes needed to the router, chat participant, or any other file.

---

## Running in Development

```bash
# Install dependencies
npm install

# One-time build
npm run build

# Watch mode (rebuilds on every save)
npm run watch
```

Then press **`F5`** in VS Code to open the Extension Development Host.

After making code changes in watch mode, reload the Development Host with:
`Ctrl+Shift+P` → **Developer: Reload Window**

### Debugging

Breakpoints set in `.ts` source files work thanks to `sourcemap: true` in `esbuild.config.js`. 
Check the **Output** panel → **Cook** dropdown for extension logs.

---

## Building & Publishing

```bash
# Package as .vsix
npm run package

# Publish to VS Code Marketplace (requires vsce login)
npm run publish
```

Before publishing, update `package.json`:
- Set `publisher` to your marketplace publisher ID
- Bump `version`
- Add an icon path under `"icon"`

---

## Relationship to Salt Copilot Assistant

Cook and the **Salt Copilot Assistant** are two separate extensions:

| | Salt Copilot Assistant | Cook |
|---|---|---|
| **Scope** | Salt-only, deep integration | Any knowledge base, general purpose |
| **Chat participant** | `@salt` | `@cook` |
| **Extra features** | Token autocomplete, hardcoded value diagnostics, hover previews | None — chat only |
| **Best for** | Day-to-day Salt development | One-off questions across many sources |

They can be installed side-by-side. For Salt questions, `@salt` gives you richer IDE integration; `@cook --with salt` gives you the same knowledge base via a more flexible interface.

---

## Roadmap

- [ ] **Semantic search** — embed chunks with a local embedding model so retrieval is meaning-based, not keyword-based
- [ ] **Persistent KB cache** — cache parsed chunks to disk so large doc folders don't re-parse on every query
- [ ] **Multi-source queries** — `@cook --with salt --with local --path ./docs` to merge context from multiple KBs
- [ ] **Confluence source** — fetch pages from a Confluence space via API token
- [ ] **OpenAPI/Swagger source** — parse an API spec and answer questions about endpoints
- [ ] **GitHub source** — read issues, PRs, and wiki pages from a repository
- [ ] **Configuration UI** — register named KB presets so you can do `@cook --with my-team-docs` without typing a path every time

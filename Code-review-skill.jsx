import { useState } from “react”;

const skills = [
{
id: “assassin”,
label: “01”,
name: “THE ASSASSIN”,
subtitle: “Multi-Vector Attack”,
color: “#ff3333”,
glyph: “⚔”,
description: “Full-spectrum destruction. Hits every weakness simultaneously.”,
systemPrompt: `You are a senior principal engineer with 15+ years of React and TypeScript experience. Your job is NOT to be nice. Your job is to find every single problem in this code and expose it completely.

You are reviewing React 18 + TypeScript code. You have zero tolerance for:

- Mediocre patterns
- Performance negligence
- Type safety shortcuts
- Accessibility ignorance
- Security blind spots

Assume NOTHING is correct until you have verified it. Treat every line as potentially broken.`, userPrompt: `Perform a COMPREHENSIVE destruction review of the following React 18 + TypeScript code.

Attack every vector without mercy:

## 🔴 TYPE SAFETY AUDIT

- Every `any` type — where used, why it’s dangerous, what the correct type should be
- Unsafe type assertions (as X) without validation
- Missing generics on hooks, components, and utilities
- Non-null assertion operator (!) abuse
- Incorrect or missing return types on functions and hooks
- Props interfaces that allow too much or too little

## 🔴 REACT 18 SPECIFIC VIOLATIONS

- Incorrect usage of concurrent features (useTransition, useDeferredValue, Suspense)
- Missing or incorrect Suspense boundaries
- startTransition misuse — marking urgent updates as transitions
- StrictMode violations — side effects in render, non-idempotent setup
- useSyncExternalStore misuse or missing where it should be used
- Deprecated patterns that React 18 has moved away from

## 🔴 HOOK VIOLATIONS

- Missing dependencies in useEffect, useCallback, useMemo dependency arrays
- Stale closures — variables captured from a previous render
- useEffect doing too many things (should be split)
- useEffect with cleanup missing when subscriptions or timers are created
- useMemo/useCallback used without justification (premature optimisation) OR missing where they’re critical
- Custom hooks that violate the rules of hooks
- useState initializer running on every render (missing lazy initializer)

## 🟡 PERFORMANCE CRIMES

- Components re-rendering when they absolutely should not
- Missing React.memo on expensive pure components
- Context causing unnecessary re-renders across the tree
- Large component trees not split with lazy() and Suspense
- Expensive computations not memoized with useMemo
- Event handlers recreated on every render without useCallback
- Keys in lists that are indices — explain exactly what will break

## 🟡 COMPONENT ARCHITECTURE FAILURES

- Components violating single responsibility (doing too many things)
- Props drilling more than 2 levels deep
- State that lives too high or too low in the tree
- Logic that should be in a custom hook but is inline
- Render props or HOC patterns where hooks would be cleaner
- God components that need to be split

## 🟡 TYPESCRIPT ARCHITECTURE

- Types duplicated instead of composed with utility types
- Missing discriminated unions where they would eliminate bugs
- Enums used where `as const` objects would be safer and more flexible
- Interfaces vs types used inconsistently or incorrectly
- Generic constraints missing or too loose

## 🔵 SECURITY VECTORS

- dangerouslySetInnerHTML without explicit sanitization
- User input rendered without escaping
- External URLs in href without validation (javascript: attacks)
- Sensitive data exposed in component state or props

## 🔵 ACCESSIBILITY FAILURES

- Interactive elements missing keyboard handlers
- Missing or incorrect ARIA roles, labels, and descriptions
- Focus management absent after dynamic content changes
- Color contrast issues in inline styles
- Images missing alt text or with incorrect alt text

-----

For EVERY issue found:

1. State the exact line or code block
1. Explain WHY it is wrong — the actual consequence in production
1. Provide the CORRECTED code

End with:

### VERDICT

A brutal one-paragraph executive summary of the overall code quality, suitable for dropping directly into a PR review.

### SEVERITY SCORE

Rate the code: CRITICAL / POOR / MEDIOCRE / ACCEPTABLE / GOOD

CODE TO REVIEW:
```tsx
[PASTE CODE HERE]
````, }, { id: "archaeologist", label: "02", name: "THE ARCHAEOLOGIST", subtitle: "Context-Aware Excavation", color: "#ff9500", glyph: "⛏", description: "Digs into architecture rot, coupling, and structural decay.", systemPrompt: `You are a staff-level software architect specialising in React 18 and TypeScript at scale. You have reviewed codebases at companies from seed to IPO and you know exactly how technical debt accumulates and where architectural decisions go catastrophically wrong.

You are not reviewing syntax. You are reviewing STRUCTURE, INTENT, and LONG-TERM VIABILITY. You are looking for the decisions that will cost weeks of engineering time in 6 months.`, userPrompt: `Perform a deep architectural excavation of the following React 18 + TypeScript code. I am providing the primary file and related context files.

You are hunting for structural rot, hidden coupling, and design decisions that will become catastrophic at scale.

## COMPONENT RESPONSIBILITY ANALYSIS

- Does each component have a single, clearly definable responsibility?
- If you cannot describe a component’s purpose in one sentence, it needs to be split — identify exactly where the split should be
- Are there components that are secretly two or three components duct-taped together?

## STATE ARCHITECTURE AUTOPSY

- Map every piece of state: where it lives vs where it should live
- Identify state that is duplicated or derived — it should be eliminated
- Find state that is too local (causing prop drilling) or too global (causing unnecessary coupling)
- Are derived values being stored in state instead of computed? (anti-pattern)
- Is server state being managed with useState when a proper cache (React Query, SWR) should be used?

## ABSTRACTION QUALITY

- Find abstractions that are too early — complexity added before it was needed
- Find abstractions that are missing — repetition that will diverge and cause bugs
- Identify over-engineered solutions to simple problems
- Find under-engineered solutions to complex problems that will break under load

## COUPLING AND COHESION

- Which modules know too much about each other?
- What would break if you extracted this component into its own package?
- Are there hidden dependencies through shared mutable state or context?
- Is business logic leaking into presentation components?

## REACT 18 ARCHITECTURAL FIT

- Is the data-fetching strategy compatible with Suspense for Data Fetching?
- Is the component tree structured to benefit from concurrent rendering?
- Are expensive subtrees structured so they can be deferred with useTransition?
- Would this architecture support streaming SSR if needed?

## TYPESCRIPT STRUCTURAL INTEGRITY

- Are domain types clearly defined and shared, or scattered and duplicated?
- Is the type system helping or fighting against the architecture?
- Are there implicit contracts between modules that TypeScript is not enforcing?

-----

For each finding, provide:

- **The Problem**: What is wrong and exactly where
- **The Consequence**: What will actually go wrong in 3-6 months as this grows
- **The Fix**: Concrete refactoring steps

PRIMARY FILE:
```tsx
[PASTE PRIMARY FILE HERE]
```

RELATED CONTEXT FILES (optional — paste any related components, hooks, or types):
```tsx
[PASTE CONTEXT FILES HERE]
````, }, { id: "benchmark", label: "03", name: "THE BENCHMARK", subtitle: "Standards Tribunal", color: "#7b61ff", glyph: "⚖", description: "Scores code against explicit rubrics. Hard numbers, no hiding.", systemPrompt: `You are a technical interviewer and code quality lead at a top-tier technology company. You assess code against strict, explicit engineering standards.

You produce SCORED rubric assessments. You are not vague. Every score is justified with specific evidence from the code. You do not round up.`, userPrompt: `Score the following React 18 + TypeScript code against each rubric category below.

Use this scoring scale for each category:

- **0** — Actively harmful / dangerous
- **1** — Poor / significant issues
- **2** — Below standard / several issues
- **3** — Acceptable / minor issues
- **4** — Good / one or two small things
- **5** — Excellent / production ready

-----

## RUBRIC

### TYPE SAFETY [/5]

- No `any` usage
- Proper generics on all reusable code
- Discriminated unions used for complex state
- No unsafe assertions
- Complete and accurate prop types

### REACT 18 BEST PRACTICES [/5]

- Correct concurrent feature usage
- Proper Suspense boundaries
- No deprecated patterns
- StrictMode compatible
- Correct hook dependency management

### PERFORMANCE [/5]

- Appropriate memoisation (not missing, not excessive)
- No unnecessary re-renders
- Code splitting applied where justified
- No expensive operations in render

### COMPONENT DESIGN [/5]

- Single responsibility
- Appropriate abstraction level
- Clean props API
- Proper separation of concerns
- No god components

### CODE READABILITY [/5]

- Self-documenting variable and function names
- Consistent patterns throughout
- Appropriate code comments (complex logic only)
- No magic numbers or strings

### TESTABILITY [/5]

- Logic separated from presentation
- No hard dependencies that block testing
- Predictable, pure functions where possible
- Side effects isolated

### SECURITY [/5]

- No XSS vectors
- Input validation present
- No sensitive data exposure

### ACCESSIBILITY [/5]

- Keyboard navigable
- Correct ARIA usage
- Semantic HTML

-----

## OUTPUT FORMAT

Produce a score table:

|Category          |Score   |Key Evidence|
|------------------|--------|------------|
|Type Safety       |X/5     |…           |
|React 18 Practices|X/5     |…           |
|Performance       |X/5     |…           |
|Component Design  |X/5     |…           |
|Readability       |X/5     |…           |
|Testability       |X/5     |…           |
|Security          |X/5     |…           |
|Accessibility     |X/5     |…           |
|**TOTAL**         |**X/40**|            |

Then for each score below 4, provide:

- Exactly what brought the score down
- Specific line references
- The minimum change required to bring it to a 4

**FINAL GRADE**: Calculate percentage and assign:

- 90-100%: SENIOR READY
- 75-89%: MID-LEVEL STANDARD
- 60-74%: JUNIOR ACCEPTABLE
- 40-59%: NEEDS SIGNIFICANT REWORK
- Below 40%: DO NOT MERGE

CODE TO SCORE:
```tsx
[PASTE CODE HERE]
````, }, { id: "rewriter", label: "04", name: "THE REWRITER", subtitle: "Show Don't Just Tell", color: "#00d4aa", glyph: "✦", description: "Produces a fully corrected version alongside the critique. Maximum sting.", systemPrompt: `You are a principal engineer who writes exemplary React 18 + TypeScript code. You have been handed someone else’s code to review and improve.

You will produce TWO things: a brutal critique AND a fully corrected rewrite. Your rewrite should be so clearly superior that the gap is undeniable. Every improvement must be explained.`, userPrompt: `You are performing a review-and-rewrite on the following React 18 + TypeScript code.

## STEP 1: RAPID FIRE CRITIQUE

List every problem found, fast and blunt. Format:

- ❌ [ISSUE] — [ONE LINE EXPLANATION]

No padding. No softening. Just the list.

## STEP 2: THE REWRITE

Produce the fully corrected version of the code. Requirements for the rewrite:

- Strict TypeScript — no `any`, full type coverage, proper generics
- React 18 best practices throughout
- Correct, complete hook dependency arrays
- Proper cleanup in all useEffects with subscriptions or timers
- Memoisation applied correctly — not missing, not excessive
- Business logic extracted into custom hooks
- Component split if single responsibility is violated
- Accessible — ARIA labels, keyboard handlers, semantic elements
- Clean, self-documenting naming throughout

## STEP 3: CHANGE LOG

After the rewrite, produce a structured change log:

|#|What Changed|Why|Impact                               |
|-|------------|---|-------------------------------------|
|1|…           |…  |🔴 Bug Fix / 🟡 Performance / 🔵 Quality|

## STEP 4: WHAT THIS TELLS US

A single paragraph: what does the pattern of issues in this code reveal about the author’s understanding of React 18 and TypeScript? Be direct.

ORIGINAL CODE:
```tsx
[PASTE CODE HERE]
````,
},
];

function CopyButton({ text }) {
const [copied, setCopied] = useState(false);

const handleCopy = () => {
navigator.clipboard.writeText(text);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

return (
<button
onClick={handleCopy}
style={{
background: copied ? “rgba(0,212,100,0.15)” : “rgba(255,255,255,0.06)”,
border: `1px solid ${copied ? "rgba(0,212,100,0.4)" : "rgba(255,255,255,0.12)"}`,
color: copied ? “#00d464” : “#888”,
padding: “6px 14px”,
borderRadius: “4px”,
fontSize: “11px”,
fontFamily: “‘JetBrains Mono’, ‘Fira Code’, monospace”,
cursor: “pointer”,
letterSpacing: “0.08em”,
fontWeight: 600,
transition: “all 0.2s ease”,
textTransform: “uppercase”,
}}
>
{copied ? “✓ COPIED” : “COPY”}
</button>
);
}

function PromptBlock({ label, content, color }) {
return (
<div style={{ marginBottom: “24px” }}>
<div
style={{
display: “flex”,
alignItems: “center”,
justifyContent: “space-between”,
marginBottom: “8px”,
}}
>
<span
style={{
fontSize: “10px”,
fontFamily: “‘JetBrains Mono’, monospace”,
letterSpacing: “0.15em”,
color: color,
textTransform: “uppercase”,
fontWeight: 700,
}}
>
{label}
</span>
<CopyButton text={content} />
</div>
<div
style={{
background: “rgba(0,0,0,0.4)”,
border: “1px solid rgba(255,255,255,0.07)”,
borderLeft: `3px solid ${color}`,
borderRadius: “6px”,
padding: “16px 18px”,
fontFamily: “‘JetBrains Mono’, ‘Fira Code’, monospace”,
fontSize: “12px”,
lineHeight: “1.7”,
color: “#b0b8c8”,
whiteSpace: “pre-wrap”,
maxHeight: “280px”,
overflowY: “auto”,
scrollbarWidth: “thin”,
scrollbarColor: `${color}44 transparent`,
}}
>
{content}
</div>
</div>
);
}

export default function CodeReviewSkills() {
const [active, setActive] = useState(“assassin”);

const skill = skills.find((s) => s.id === active);

return (
<div
style={{
minHeight: “100vh”,
background: “#0a0a0c”,
color: “#e8eaf0”,
fontFamily: “‘Inter’, ‘Helvetica Neue’, sans-serif”,
display: “flex”,
flexDirection: “column”,
}}
>
{/* Header */}
<div
style={{
borderBottom: “1px solid rgba(255,255,255,0.06)”,
padding: “28px 40px 24px”,
background: “rgba(255,255,255,0.02)”,
}}
>
<div style={{ display: “flex”, alignItems: “baseline”, gap: “14px” }}>
<span
style={{
fontSize: “9px”,
letterSpacing: “0.25em”,
color: “#444”,
fontWeight: 700,
textTransform: “uppercase”,
fontFamily: “‘JetBrains Mono’, monospace”,
}}
>
CODE REVIEW ARSENAL
</span>
<span style={{ color: “#222”, fontSize: “12px” }}>—</span>
<span
style={{
fontSize: “9px”,
letterSpacing: “0.2em”,
color: “#333”,
fontFamily: “‘JetBrains Mono’, monospace”,
textTransform: “uppercase”,
}}
>
React 18 + TypeScript
</span>
</div>
<h1
style={{
margin: “8px 0 0”,
fontSize: “30px”,
fontWeight: 800,
letterSpacing: “-0.03em”,
background: “linear-gradient(135deg, #ffffff 0%, #888 100%)”,
WebkitBackgroundClip: “text”,
WebkitTextFillColor: “transparent”,
backgroundClip: “text”,
}}
>
Destroy the Code
</h1>
</div>

```
  <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
    {/* Sidebar */}
    <div
      style={{
        width: "220px",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {skills.map((s) => (
        <button
          key={s.id}
          onClick={() => setActive(s.id)}
          style={{
            background:
              active === s.id
                ? `linear-gradient(90deg, ${s.color}18 0%, transparent 100%)`
                : "transparent",
            border: "none",
            borderLeft: `3px solid ${active === s.id ? s.color : "transparent"}`,
            padding: "16px 20px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.15s ease",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.15em",
              color: active === s.id ? s.color : "#444",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            {s.label} {s.glyph}
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: active === s.id ? "#fff" : "#666",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {s.name}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: active === s.id ? "#888" : "#444",
              marginTop: "3px",
            }}
          >
            {s.subtitle}
          </div>
        </button>
      ))}
    </div>

    {/* Main Panel */}
    <div
      style={{
        flex: 1,
        padding: "32px 40px",
        overflowY: "auto",
      }}
    >
      {/* Skill Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
          paddingBottom: "28px",
          borderBottom: `1px solid ${skill.color}22`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "48px",
              lineHeight: 1,
              marginBottom: "12px",
              filter: `drop-shadow(0 0 20px ${skill.color}66)`,
            }}
          >
            {skill.glyph}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: skill.color,
            }}
          >
            {skill.name}
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            {skill.description}
          </p>
        </div>
        <div
          style={{
            background: `${skill.color}11`,
            border: `1px solid ${skill.color}33`,
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "10px",
            fontFamily: "'JetBrains Mono', monospace",
            color: skill.color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Skill {skill.label}
        </div>
      </div>

      {/* Usage Instructions */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "28px",
          fontSize: "13px",
          color: "#777",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "#555", fontWeight: 700, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>HOW TO USE — </span>
        Copy the <span style={{ color: skill.color }}>SYSTEM PROMPT</span> into your agent's system prompt field. Copy the <span style={{ color: skill.color }}>USER PROMPT</span> as your message. Replace the placeholder at the bottom with your target code.
      </div>

      {/* Prompts */}
      <PromptBlock
        label="System Prompt"
        content={skill.systemPrompt}
        color={skill.color}
      />
      <PromptBlock
        label="User Prompt — paste code at the bottom"
        content={skill.userPrompt}
        color={skill.color}
      />
    </div>
  </div>

  {/* Footer */}
  <div
    style={{
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "12px 40px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
    }}
  >
    {[
      { dot: "#ff3333", label: "BLOCKER" },
      { dot: "#ff9500", label: "WARNING" },
      { dot: "#7b61ff", label: "BENCHMARK" },
      { dot: "#00d4aa", label: "REWRITE" },
    ].map(({ dot, label }) => (
      <div
        key={label}
        style={{ display: "flex", alignItems: "center", gap: "6px" }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: dot,
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "#444",
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {label}
        </span>
      </div>
    ))}
  </div>
</div>
```

);
}

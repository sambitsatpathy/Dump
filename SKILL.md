---
name: copilot-frontend-design-saltds
description: >
  Generate distinctive, production-grade frontend interfaces with high design quality using
  GitHub Copilot and the Salt Design System (@salt-ds/core). Faithfully ports the Claude
  frontend-design philosophy — bold aesthetic direction, purposeful design thinking, and
  memorable UI — into Copilot-ready prompt templates and Salt DS patterns. Use this skill
  whenever the user asks to build web components, pages, dashboards, landing pages, or React
  components using Salt DS. Trigger on: "frontend", "UI", "component", "page", "dashboard",
  "Salt", "Salt DS", "design system", or any request to build or style a web UI for J.P.
  Morgan's Salt Design System. Replaces Tailwind with Salt DS tokens and layout primitives
  throughout.
---

# Copilot Frontend Design Skill — Salt DS Edition

Port the Claude frontend-design philosophy into GitHub Copilot workflows using
**Salt Design System** (`@salt-ds/core`) — J.P. Morgan's open-source, accessible,
token-driven React component library.

This skill produces:
1. **Design thinking output** — aesthetic direction and rationale before any code.
2. **A `.github/copilot-instructions.md` block** — persistent Salt DS rules Copilot follows project-wide.
3. **Per-component Copilot Chat prompt templates** — ready-to-paste, constraint-complete prompts.
4. **Working reference code** — production-grade Salt DS TSX examples.

---

## Phase 1 — Design Thinking (Do This Before Writing Any Code)

The original Claude frontend-design skill demands intentional aesthetic direction.
That philosophy carries over fully here. Before generating a component or prompt,
establish the following:

### 1.1 Purpose & Audience

| Question | Why it matters |
|----------|---------------|
| What problem does this interface solve? | Determines component selection and information hierarchy |
| Who uses it? (analyst, developer, consumer, ops) | Sets density, tone, and interaction complexity |
| What is the primary action? | Focus the layout and visual weight there |
| What would make this **unforgettable**? | The one thing the user will remember — commit to it |

### 1.2 Commit to an Aesthetic Direction

Pick one direction and execute it with precision.
Salt DS provides the structural foundation; the aesthetic direction governs how you
*refine and extend* it with layout choices, token overrides, and composition.

| Direction | Salt Config | Refinement Strategy |
|-----------|-------------|---------------------|
| **Data / Financial** | `density="high"` `mode="dark"` | Tighten gaps, near-monochrome palette, emphasise tabular rhythm |
| **Minimal / Refined** | `density="low"` `mode="light"` | Maximum negative space, single accent override, restrained typography |
| **Editorial / Magazine** | `density="low"` `mode="light"` | Asymmetric `GridLayout`, oversized Display typography, deliberate misalignment |
| **Terminal / Developer** | `density="high"` `mode="dark"` | Green or amber accent token override, `PT Mono` everywhere, raw structural feel |
| **Warm / Approachable** | `density="low"` `mode="light"` | Warm accent override, generous padding, soft border-radius overrides |
| **Enterprise / Neutral** | `density="medium"` `mode="light"` | No token overrides, let Salt speak — focus on layout and information architecture |
| **Dramatic / High-Contrast** | `density="medium"` `mode="dark"` | Strong accent override, high-contrast surfaces, bold Display headlines |

> **CRITICAL**: Choose a direction and commit to it. Timid, hedging aesthetics produce
> generic results. Bold minimalism and controlled maximalism are both valid — the key
> is intentionality and consistency of execution.

### 1.3 Differentiation Checklist

Before moving to code, answer:

- [ ] What is the **one visual or interactive thing** this UI does that will be remembered?
- [ ] Does the layout use **unexpected composition** — asymmetry, deliberate overlap, diagonal flow, or a grid-breaking element?
- [ ] Does every **spacing decision** have a reason, or is it default padding everywhere?
- [ ] Is the **typography hierarchy** immediately legible — does the eye know where to land first?
- [ ] Does the **density + mode combo** serve the user's actual context?

---

## Phase 2 — Salt DS Fundamentals

### 2.1 Installation

```bash
npm install @salt-ds/core @salt-ds/theme @salt-ds/icons
# Unstable but useful for newer components:
npm install @salt-ds/lab
```

### 2.2 Required App Setup

Every Salt DS app must wrap its root in `SaltProvider`. Set `density` and `mode`
explicitly — never rely on defaults in production.

```tsx
// src/index.tsx
import { SaltProvider } from "@salt-ds/core";
import "@salt-ds/theme/index.css";

root.render(
  <SaltProvider theme="salt" density="medium" mode="light">
    <App />
  </SaltProvider>
);
```

### 2.3 Density System

| Density | Best for | Visual feel |
|---------|----------|-------------|
| `high` | Data-dense dashboards, trading UIs, analytics | Compact, information-rich |
| `medium` | Standard business apps (default) | Balanced, familiar |
| `low` | Consumer-facing, reading-heavy UIs | Spacious, relaxed |
| `touch` | Mobile / kiosk / touchscreen | Large tap targets |

```tsx
// Financial dashboard — dark, high density
<SaltProvider density="high" mode="dark">

// Consumer product — light, low density
<SaltProvider density="low" mode="light">
```

### 2.4 Required Fonts

Salt DS requires **Open Sans** (body) and **PT Mono** (monospace).

**Option A — Google Fonts (index.html)**
```html
<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=PT+Mono&display=swap"
  rel="stylesheet"
/>
```

**Option B — Fontsource (npm)**
```bash
npm install @fontsource/open-sans @fontsource/pt-mono
```
```ts
// src/index.tsx
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/pt-mono";
```

---

## Phase 3 — Salt DS Design Token Reference

**Rule**: Never hardcode hex values or pixel spacing in component styles.
Always use Salt CSS custom properties. This is the Salt DS equivalent of
Tailwind utility classes — the tokens are the design system.

### 3.1 Color Tokens

```css
/* Backgrounds / Surfaces */
var(--salt-container-primary-background)      /* main page / app bg */
var(--salt-container-secondary-background)    /* card, panel, sidebar bg */
var(--salt-container-tertiary-background)     /* nested / inset surfaces */

/* Text */
var(--salt-content-primary-foreground)        /* primary body text */
var(--salt-content-secondary-foreground)      /* muted labels, captions */
var(--salt-content-disabled-foreground)       /* disabled state text */

/* Actions / Accent */
var(--salt-actionable-cta-background)         /* CTA / primary button bg */
var(--salt-actionable-cta-foreground)         /* CTA / primary button text */
var(--salt-actionable-primary-background)     /* secondary button bg */
var(--salt-actionable-primary-foreground)     /* secondary button text */

/* Borders */
var(--salt-separable-primary-borderColor)     /* standard border */
var(--salt-separable-secondary-borderColor)   /* subtle border */
var(--salt-focused-outlineColor)              /* keyboard focus ring */

/* Status */
var(--salt-status-error-foreground)
var(--salt-status-warning-foreground)
var(--salt-status-success-foreground)
var(--salt-status-info-foreground)
var(--salt-status-error-background)
var(--salt-status-warning-background)
var(--salt-status-success-background)
var(--salt-status-info-background)
```

### 3.2 Spacing Tokens (density-aware — automatically adjust per density mode)

```css
var(--salt-spacing-100)   /* ≈4px at medium */
var(--salt-spacing-200)   /* ≈8px */
var(--salt-spacing-300)   /* ≈12px */
var(--salt-spacing-400)   /* ≈16px */
var(--salt-spacing-500)   /* ≈24px */
var(--salt-spacing-600)   /* ≈32px */
var(--salt-spacing-700)   /* ≈48px */
```

> Spacing tokens respond to `density` automatically. A `--salt-spacing-400` at
> `density="high"` is tighter than at `density="low"`. Use them instead of hardcoded px.

### 3.3 Typography Tokens

```css
var(--salt-text-display1-fontSize)   /* largest display */
var(--salt-text-display2-fontSize)
var(--salt-text-h1-fontSize)
var(--salt-text-h2-fontSize)
var(--salt-text-h3-fontSize)
var(--salt-text-h4-fontSize)
var(--salt-text-body-fontSize)
var(--salt-text-label-fontSize)
var(--salt-text-notation-fontSize)   /* caption, footnote */
```

### 3.4 Size Tokens

```css
var(--salt-size-border)        /* border width */
var(--salt-size-indicator)     /* status indicator dot */
var(--salt-size-icon)          /* icon rendering size */
var(--salt-size-base)          /* standard component height */
```

---

## Phase 4 — Core Component Patterns

### 4.1 Layout Primitives (Replace All Raw Flexbox)

```tsx
import { StackLayout, FlowLayout, GridLayout, GridItem, SplitLayout } from "@salt-ds/core";

// Vertical stack — main page layout spine
<StackLayout direction="column" gap={3}>
  <Header />
  <Main />
  <Footer />
</StackLayout>

// Horizontal flow — toolbar, tag lists, wrapping chips
<FlowLayout gap={2} justify="space-between" wrap>
  <FilterChip /> <FilterChip /> <FilterChip />
</FlowLayout>

// CSS Grid — dashboard, card grids, form layouts
<GridLayout columns={3} gap={2}>
  <GridItem colSpan={2}><MainContent /></GridItem>
  <GridItem><Sidebar /></GridItem>
</GridLayout>

// Two-area split — header with title + actions
<SplitLayout
  startItem={<H2>Page Title</H2>}
  endItem={<Button sentiment="accented">New Item</Button>}
/>
```

> **Anti-pattern**: `<div style={{ display: "flex", gap: "16px" }}>` — use
> `<FlowLayout gap={4}>` instead. Never build layout with raw div + inline style.

### 4.2 Button

```tsx
import { Button } from "@salt-ds/core";

// Sentiment: "accented" | "positive" | "negative" | "caution" | "neutral"
// Appearance: "solid" | "bordered" | "transparent"

<Button sentiment="accented" appearance="solid" onClick={handlePrimary}>
  Save Changes
</Button>
<Button sentiment="neutral" appearance="bordered" onClick={handleCancel}>
  Cancel
</Button>
<Button appearance="transparent" onClick={handleLearnMore}>
  Learn more
</Button>
<Button sentiment="negative" appearance="solid" onClick={handleDelete}>
  Delete
</Button>
```

### 4.3 Forms

```tsx
import {
  FormField, FormFieldLabel, FormFieldHelperText,
  Input, Textarea, Checkbox, CheckboxGroup,
  RadioButton, RadioButtonGroup, Switch, Dropdown, Option
} from "@salt-ds/core";

<FormField>
  <FormFieldLabel>Email address</FormFieldLabel>
  <Input
    placeholder="name@example.com"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  <FormFieldHelperText>We will never share your email.</FormFieldHelperText>
</FormField>

<FormField validationStatus="error">
  <FormFieldLabel>Password</FormFieldLabel>
  <Input type="password" value={password} onChange={handleChange} />
  <FormFieldHelperText>Must be at least 8 characters.</FormFieldHelperText>
</FormField>

<Checkbox label="Remember me" checked={checked} onChange={handleCheckbox} />
<Switch label="Email notifications" checked={notif} onChange={toggleNotif} />

<Dropdown
  selected={selected}
  onSelectionChange={handleSelect}
  placeholder="Select region"
>
  <Option value="us-east">US East</Option>
  <Option value="eu-west">EU West</Option>
</Dropdown>
```

### 4.4 Card & Interactable Card

```tsx
import { Card, InteractableCard } from "@salt-ds/core";
import { StackLayout, H3, Text } from "@salt-ds/core";

// Static card — information display
<Card>
  <StackLayout direction="column" gap={2}>
    <H3>Metric Title</H3>
    <Text>Supporting detail or value</Text>
  </StackLayout>
</Card>

// Selectable / clickable card
<InteractableCard
  onClick={handleSelect}
  selected={isSelected}
  style={{ cursor: "pointer" }}
>
  <StackLayout gap={1}>
    <H3>Option A</H3>
    <Text styleAs="label">Best for small teams</Text>
  </StackLayout>
</InteractableCard>
```

### 4.5 Typography

```tsx
import { Display1, Display2, H1, H2, H3, H4, Text, Label } from "@salt-ds/core";

// Hero / landing
<Display1>Build faster. Ship better.</Display1>
<Display2>The platform for modern teams.</Display2>

// Page & section structure
<H1>Dashboard</H1>
<H2>Recent Activity</H2>
<H3>Performance Metrics</H3>

// Body & utility
<Text>Paragraph body copy goes here, auto-inherits Salt body styles.</Text>
<Label>FIELD LABEL</Label>
<Text styleAs="notation">Last updated 2 minutes ago</Text>
```

### 4.6 Navigation

```tsx
import { NavigationItem, TabBar, Tab } from "@salt-ds/core";

// Sidebar nav
<StackLayout direction="column" gap={1}>
  <NavigationItem active href="/overview">Overview</NavigationItem>
  <NavigationItem href="/analytics">Analytics</NavigationItem>
  <NavigationItem href="/settings">Settings</NavigationItem>
</StackLayout>

// Tab navigation
<TabBar value={activeTab} onChange={(_, val) => setActiveTab(val)}>
  <Tab value="overview" label="Overview" />
  <Tab value="analytics" label="Analytics" />
  <Tab value="settings" label="Settings" />
</TabBar>
```

### 4.7 Data Display & Indicators

```tsx
import { Badge, Pill, Tag, Tooltip, Spinner, Avatar, StatusIndicator } from "@salt-ds/core";
import { InfoIcon } from "@salt-ds/icons";

<Badge value={12}><Button>Notifications</Button></Badge>
<Pill label="Active" />
<Tag>New</Tag>

<Tooltip content="More information about this field">
  <InfoIcon />
</Tooltip>

<Spinner size="medium" />
<Avatar name="Jane Smith" size={2} />
<StatusIndicator status="success" />
<StatusIndicator status="warning" />
```

### 4.8 Banners & Feedback

```tsx
import { Banner, BannerContent, BannerActions } from "@salt-ds/core";

<Banner status="success">
  <BannerContent>Changes saved successfully.</BannerContent>
</Banner>

<Banner status="error">
  <BannerContent>Something went wrong. Please try again.</BannerContent>
  <BannerActions>
    <Button appearance="transparent">Dismiss</Button>
  </BannerActions>
</Banner>

<Banner status="warning">
  <BannerContent>Your session expires in 5 minutes.</BannerContent>
</Banner>

<Banner status="info">
  <BannerContent>A new version is available.</BannerContent>
</Banner>
```

---

## Phase 5 — Custom Theme Overrides

Apply brand colors and aesthetic tweaks **on top of** the Salt theme.
All overrides go in a separate CSS file imported **after** `@salt-ds/theme/index.css`.

```css
/* src/theme-overrides.css */

:root {
  /* Brand accent on CTA */
  --salt-actionable-cta-background: #0a4f9a;
  --salt-actionable-cta-foreground: #ffffff;
  --salt-actionable-cta-background-hover: #083d78;

  /* Focus ring matches brand */
  --salt-focused-outlineColor: #0a4f9a;

  /* Soften border radius for warm/approachable direction */
  --salt-size-border-radius: 6px;
}

/* Dark mode variant of overrides */
[data-mode="dark"] {
  --salt-actionable-cta-background: #4d9fdc;
  --salt-actionable-cta-foreground: #000000;
  --salt-focused-outlineColor: #4d9fdc;
}

/* Terminal/developer direction — green accent */
/* [data-mode="dark"] {
  --salt-actionable-cta-background: #00cc66;
  --salt-actionable-cta-foreground: #000000;
  --salt-focused-outlineColor: #00cc66;
} */
```

```tsx
// src/index.tsx — import order is critical
import "@salt-ds/theme/index.css";
import "./theme-overrides.css"; // ALWAYS after Salt theme
```

---

## Phase 6 — Copilot Instructions Block

Generate this as the content for `.github/copilot-instructions.md`.
This is the project-wide persistent context Copilot references for all UI tasks.

```markdown
## Frontend Design Rules — Salt DS

### Setup
- Always wrap root in `<SaltProvider density="[DENSITY]" mode="[MODE]">`
- Import theme: `import "@salt-ds/theme/index.css"` as the FIRST style import
- Import brand overrides AFTER: `import "./theme-overrides.css"`
- Load fonts: Open Sans and PT Mono (Google Fonts or @fontsource packages)

### Component Rules
- Use Salt DS components from `@salt-ds/core` for ALL UI elements
- Never build custom buttons, inputs, selects, checkboxes, or form fields — always use Salt equivalents
- Use `@salt-ds/lab` only for components not yet in core; mark usage with a `// TODO: migrate to @salt-ds/core` comment
- Use `@salt-ds/icons` for all icons — never embed raw SVGs

### Token Rules
- NEVER hardcode hex color values — always use `var(--salt-*)` tokens
- NEVER hardcode px spacing — always use `var(--salt-spacing-*)` tokens
- For custom surfaces, use `var(--salt-container-*-background)` tokens
- Any custom token overrides live exclusively in `src/theme-overrides.css`, imported after the Salt theme

### Layout Rules
- Use `StackLayout`, `FlowLayout`, `GridLayout`, `SplitLayout` for ALL layout composition
- No raw `<div style={{ display: "flex" }}>` — use Salt layout primitives
- Respect the 4px grid: any custom measurement must be a multiple of 4px
- Use `GridItem` with `colSpan` / `rowSpan` for intentional asymmetric layouts

### Typography Rules
- Use `Display1`, `Display2`, `H1`–`H4`, `Text`, `Label` from `@salt-ds/core`
- No raw `<h1>` or `<p>` tags in components — use Salt typography components
- Use `styleAs` prop for visual vs semantic separation where needed

### Anti-Patterns (Copilot must NOT generate)
- ❌ `className="flex gap-4 p-4"` — Salt has no Tailwind dependency
- ❌ `style={{ color: '#ffffff' }}` — use `var(--salt-content-primary-foreground)`
- ❌ `style={{ padding: '16px' }}` — use `var(--salt-spacing-400)`
- ❌ Raw `<button>`, `<input>`, `<select>`, `<textarea>` — use Salt components
- ❌ `box-shadow` for card elevation — use `<Card>` from Salt
- ❌ Arbitrary `z-index` — use Salt overlay/dialog components
- ❌ Custom focus ring styles — Salt handles `:focus-visible` via `--salt-focused-outlineColor`
```

---

## Phase 7 — Per-Component Copilot Chat Prompt Template

For each individual UI component, generate a filled version of this template
and hand it directly to the user to paste into Copilot Chat.

```
Build a [COMPONENT NAME] using Salt Design System (@salt-ds/core).

**Salt Config**
- density: [high | medium | low | touch]
- mode: [light | dark]
- SaltProvider already wraps the app root — do not add a nested one

**Components to use** (all imports from @salt-ds/core unless noted):
- Layout: [e.g. StackLayout, GridLayout, SplitLayout]
- Content: [e.g. Card, H2, Text, Label]
- Actions: [e.g. Button sentiment="accented", Button appearance="bordered"]
- Inputs: [e.g. FormField, Input, Dropdown]
- Indicators: [e.g. Spinner, StatusIndicator, Badge]

**Aesthetic direction**: [one of the directions from Phase 1, e.g. "Data / Financial"]

**Layout description**:
[Describe composition using Salt layout primitives. Example: "A GridLayout with 3 columns.
Left GridItem colSpan=1 is a navigation sidebar using StackLayout. Center GridItem colSpan=2
is the main content. Use SplitLayout in the header for title + action button."]

**Interactions**:
- [e.g. InteractableCard shows selected state on click, stored in useState]
- [e.g. Banner with status="error" appears conditionally on form submit failure]

**Token overrides** (if any — will be applied via theme-overrides.css):
- [e.g. --salt-actionable-cta-background: #0a4f9a]

**Do NOT**:
- Use Tailwind or any utility-class CSS
- Hardcode hex colors — use var(--salt-*) tokens
- Hardcode px spacing — use var(--salt-spacing-*) tokens
- Build custom form controls — use Salt equivalents
- Use raw div/flexbox for layout — use Salt layout components
- Add a nested SaltProvider

**Output**: Single TSX file, TypeScript strict, Salt DS only, no external dependencies
beyond @salt-ds/core, @salt-ds/theme, @salt-ds/icons.
```

---

## Phase 8 — Reference Examples

### 8.1 Dashboard Shell (dark, high density — Data/Financial direction)

```tsx
import {
  SaltProvider, GridLayout, GridItem,
  StackLayout, SplitLayout,
  NavigationItem, H2, H4, Text, Card,
  StatusIndicator, Badge, Button
} from "@salt-ds/core";
import "@salt-ds/theme/index.css";

export function DashboardApp() {
  return (
    <SaltProvider density="high" mode="dark">
      <GridLayout
        columns="220px 1fr"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* Sidebar */}
        <GridItem>
          <StackLayout
            direction="column"
            gap={1}
            style={{
              background: "var(--salt-container-secondary-background)",
              height: "100%",
              padding: "var(--salt-spacing-400)",
              borderRight: `1px solid var(--salt-separable-primary-borderColor)`,
            }}
          >
            <H4 style={{ marginBottom: "var(--salt-spacing-300)" }}>
              AppName
            </H4>
            <NavigationItem active href="/overview">Overview</NavigationItem>
            <NavigationItem href="/analytics">Analytics</NavigationItem>
            <NavigationItem href="/positions">Positions</NavigationItem>
            <NavigationItem href="/settings">Settings</NavigationItem>
          </StackLayout>
        </GridItem>

        {/* Main content */}
        <GridItem style={{ overflow: "auto" }}>
          <StackLayout
            direction="column"
            gap={3}
            style={{ padding: "var(--salt-spacing-500)" }}
          >
            <SplitLayout
              startItem={<H2>Portfolio Overview</H2>}
              endItem={
                <Button sentiment="accented" appearance="solid">
                  New Trade
                </Button>
              }
            />
            <GridLayout columns={3} gap={2}>
              {[
                { label: "Total AUM", value: "$4.2B", status: "success" },
                { label: "Daily P&L", value: "+$12.4M", status: "success" },
                { label: "Open Positions", value: "247", status: "info" },
              ].map(({ label, value, status }) => (
                <Card key={label}>
                  <StackLayout direction="column" gap={1}>
                    <Text styleAs="label">{label}</Text>
                    <H4>{value}</H4>
                    <StatusIndicator status={status as "success" | "info"} />
                  </StackLayout>
                </Card>
              ))}
            </GridLayout>
          </StackLayout>
        </GridItem>
      </GridLayout>
    </SaltProvider>
  );
}
```

### 8.2 Settings Form (light, medium density — Enterprise/Neutral direction)

```tsx
import {
  SaltProvider, StackLayout, SplitLayout,
  FormField, FormFieldLabel, FormFieldHelperText,
  Input, Switch, Dropdown, Option,
  Button, H2, H3, Text, Card,
  Banner, BannerContent
} from "@salt-ds/core";
import "@salt-ds/theme/index.css";
import { useState } from "react";

export function SettingsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notif, setNotif] = useState(true);
  const [region, setRegion] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  return (
    <SaltProvider density="medium" mode="light">
      <StackLayout
        direction="column"
        gap={4}
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "var(--salt-spacing-700)",
        }}
      >
        <H2>Account Settings</H2>

        {saved && (
          <Banner status="success">
            <BannerContent>Settings saved successfully.</BannerContent>
          </Banner>
        )}

        <Card>
          <StackLayout direction="column" gap={3}>
            <H3>Profile</H3>

            <FormField>
              <FormFieldLabel>Display name</FormFieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>

            <FormField>
              <FormFieldLabel>Email address</FormFieldLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <FormFieldHelperText>
                Used for account notifications only.
              </FormFieldHelperText>
            </FormField>

            <FormField>
              <FormFieldLabel>Region</FormFieldLabel>
              <Dropdown
                selected={region}
                onSelectionChange={(_, items) => setRegion(items)}
                placeholder="Select a region"
              >
                <Option value="us-east">US East</Option>
                <Option value="us-west">US West</Option>
                <Option value="eu-west">EU West</Option>
                <Option value="ap-south">AP South</Option>
              </Dropdown>
            </FormField>
          </StackLayout>
        </Card>

        <Card>
          <StackLayout direction="column" gap={2}>
            <H3>Notifications</H3>
            <SplitLayout
              startItem={<Text>Email notifications</Text>}
              endItem={
                <Switch checked={notif} onChange={() => setNotif((v) => !v)} />
              }
            />
          </StackLayout>
        </Card>

        <SplitLayout
          startItem={
            <Button appearance="bordered" sentiment="neutral">
              Discard
            </Button>
          }
          endItem={
            <Button
              sentiment="accented"
              appearance="solid"
              onClick={() => setSaved(true)}
            >
              Save Changes
            </Button>
          }
        />
      </StackLayout>
    </SaltProvider>
  );
}
```

### 8.3 Pricing / Selection Cards (light, low density — Minimal/Refined direction)

```tsx
import {
  SaltProvider, StackLayout, FlowLayout,
  InteractableCard, H2, H3, Text, Label, Button
} from "@salt-ds/core";
import "@salt-ds/theme/index.css";
import { useState } from "react";

const PLANS = [
  { id: "starter", name: "Starter", price: "$0", tagline: "For individuals" },
  { id: "pro", name: "Pro", price: "$29/mo", tagline: "For growing teams" },
  { id: "enterprise", name: "Enterprise", price: "Custom", tagline: "For large orgs" },
];

export function PricingCards() {
  const [selected, setSelected] = useState("pro");

  return (
    <SaltProvider density="low" mode="light">
      <StackLayout
        direction="column"
        gap={6}
        style={{
          padding: "var(--salt-spacing-700)",
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <StackLayout direction="column" gap={2} style={{ alignItems: "center" }}>
          <H2>Simple, honest pricing</H2>
          <Text style={{ color: "var(--salt-content-secondary-foreground)" }}>
            No hidden fees. Cancel any time.
          </Text>
        </StackLayout>

        <FlowLayout gap={3} justify="center">
          {PLANS.map(({ id, name, price, tagline }) => (
            <InteractableCard
              key={id}
              selected={selected === id}
              onClick={() => setSelected(id)}
              style={{ width: 220, textAlign: "left" }}
            >
              <StackLayout direction="column" gap={2}>
                <Label>{name.toUpperCase()}</Label>
                <H3>{price}</H3>
                <Text styleAs="notation">{tagline}</Text>
              </StackLayout>
            </InteractableCard>
          ))}
        </FlowLayout>

        <Button
          sentiment="accented"
          appearance="solid"
          style={{ alignSelf: "center" }}
        >
          Get started with {PLANS.find((p) => p.id === selected)?.name}
        </Button>
      </StackLayout>
    </SaltProvider>
  );
}
```

---

## Phase 9 — Output Checklist

Before handing off any generated code or Copilot prompt to the user, verify:

**Foundation**
- [ ] `SaltProvider` with explicit `density` and `mode` is present in setup
- [ ] `@salt-ds/theme/index.css` is the first style import
- [ ] Open Sans and PT Mono fonts are loaded

**Tokens**
- [ ] No hardcoded hex colors — all use `var(--salt-*)` tokens
- [ ] No hardcoded px spacing — all use `var(--salt-spacing-*)` tokens
- [ ] Custom overrides are in a separate CSS file imported after Salt theme

**Components**
- [ ] No raw `<button>`, `<input>`, `<select>`, `<textarea>` — all Salt equivalents
- [ ] No custom card box-shadow — using `<Card>` or `<InteractableCard>`
- [ ] No Tailwind classes anywhere

**Layout**
- [ ] All layout uses Salt primitives (`StackLayout`, `FlowLayout`, `GridLayout`, `SplitLayout`)
- [ ] No raw `<div style={{ display: "flex" }}>` layout

**Design Thinking**
- [ ] Aesthetic direction was chosen before coding, not after
- [ ] The `density` + `mode` combination matches the actual user context
- [ ] There is at least one deliberate compositional or typographic choice that makes this UI distinctive
- [ ] The Copilot instructions block includes the anti-patterns list

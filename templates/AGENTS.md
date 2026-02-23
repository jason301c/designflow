# DesignFlow — Wireframes

This directory contains wireframe screens visualized on an infinite canvas via DesignFlow.

## Directory Structure
```
wireframes/
├── screens/          # React component screens (.tsx)
├── flows.ts          # Screen metadata + navigation edges
├── designflow.theme.ts  # Design tokens → CSS custom properties
├── styles.css        # (optional) Tailwind v4 integration
└── CLAUDE.md         # This file
```

## Creating Screens

Each screen is a **default-exported React component** with **zero required props**.

```tsx
export default function MyScreen() {
  return (
    <div style={{ background: "var(--df-background)", minHeight: "100vh", fontFamily: "var(--df-font-family)" }}>
      <h1 style={{ color: "var(--df-text)" }}>Screen Title</h1>
      <button data-df-navigate="otherscreen">Go to Other</button>
    </div>
  )
}
```

### Rules
1. **One default export per file** — the component IS the screen
2. **No required props** — screens receive no props from DesignFlow
3. **Use `var(--df-*)` tokens** for all colors, spacing, radii, shadows, and fonts — never hardcode values like `#fff` or `16px`
4. **`data-df-navigate="screenId"`** on any element marks it as a navigation trigger (renders as a flow arrow on the canvas, navigates in the viewer)
5. **Local state works** — `useState`, modals, dropdowns, tabs all function normally inside the viewer
6. **File → ID mapping**: the screen ID is the **lowercase filename** without `.tsx`. `Profile.tsx` → `profile`, `PullRequest.tsx` → `pullrequest`. Use this exact ID in `flows.ts` and `data-df-navigate` attributes. No hyphens or transformations.

### Available Theme Tokens

All tokens are CSS custom properties prefixed with `--df-`:

| Category | Tokens |
|---|---|
| **Colors** | `--df-primary`, `--df-secondary`, `--df-accent`, `--df-background`, `--df-surface`, `--df-surface-alt`, `--df-border`, `--df-text`, `--df-text-muted`, `--df-text-invert`, `--df-success`, `--df-warning`, `--df-error`, `--df-info` |
| **Dark overrides** | `--df-background`, `--df-surface`, `--df-surface-alt`, `--df-border`, `--df-text`, `--df-text-muted`, `--df-text-invert` (auto-applied when dark mode toggled) |
| **Radius** | `--df-radius-sm` (4px), `--df-radius-md` (8px), `--df-radius-lg` (12px), `--df-radius-xl` (16px), `--df-radius-full` (9999px) |
| **Spacing** | `--df-spacing-xs` (4px), `--df-spacing-sm` (8px), `--df-spacing-md` (16px), `--df-spacing-lg` (24px), `--df-spacing-xl` (32px), `--df-spacing-xxl` (48px) |
| **Typography** | `--df-font-family`, `--df-heading-weight`, `--df-heading-h1`..`h4`, `--df-body-weight`, `--df-body-base`, `--df-body-sm`, `--df-body-xs` |
| **Shadows** | `--df-shadow-sm`, `--df-shadow-md`, `--df-shadow-lg` |

### Dark Mode

Dark mode works automatically when you use `var(--df-*)` tokens. DesignFlow generates:

```css
:root                            { --df-background: #FFFFFF; --df-text: #0F172A; ... }
[data-df-color-scheme="dark"]    { --df-background: #0F172A; --df-text: #F1F5F9; ... }
```

When a screen is toggled to dark, its wrapper gets `data-df-color-scheme="dark"`, and all descendant `var(--df-*)` references resolve to dark values. **No code changes needed** — just don't hardcode colors.

## Registering Screens in `flows.ts`

```ts
import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  name: "My App",
  screens: {
    myscreen: {                          // ID = lowercase filename
      title: "My Screen",               // Display name on canvas
      file: "./screens/MyScreen.tsx",    // Relative path from this dir
      position: { x: 0, y: 0 },         // Canvas coordinates (auto-updated on drag)
      viewport: "desktop",              // "desktop" (1440x900) | "tablet" (768x1024) | "mobile" (390x844)
      color: "#4488ff",                 // Optional accent color for the screen card
    },
  },
  edges: [
    { from: "myscreen", to: "otherscreen", label: "Navigate" },
  ],
}

export default config
```

### Screen ID Matching (Critical)
The screen scanner generates IDs by stripping `.tsx` and lowercasing: `Explore.tsx` → `explore`, `PullRequest.tsx` → `pullrequest`. The ID in `flows.ts`, `data-df-navigate`, and `edges` must match exactly. Mismatched IDs show "No preview".

## Tailwind CSS (Optional)

If `styles.css` exists in this directory, Tailwind v4 is active automatically. Create it with `designflow init --tailwind` or manually:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: var(--df-primary);
  --color-secondary: var(--df-secondary);
  --color-background: var(--df-background);
  --color-surface: var(--df-surface);
  --color-text: var(--df-text);
  --color-text-muted: var(--df-text-muted);
  --color-border: var(--df-border);
  --radius-md: var(--df-radius-md);
  --radius-lg: var(--df-radius-lg);
  --spacing-md: var(--df-spacing-md);
  --shadow-sm: var(--df-shadow-sm);
  /* ... */
}
```

Then use `bg-primary`, `text-text-muted`, `p-md`, `rounded-lg`, `shadow-sm`, etc. Dark mode cascades automatically.

**Important:** Must use `@theme inline`, not plain `@theme`. Without `inline`, Tailwind v4 generates `@property` declarations that eagerly resolve `var()` references at `:root`, breaking the dark mode cascade.

## Editing the Theme

Edit `designflow.theme.ts` directly — changes hot-reload instantly. The file defines `colors`, `darkColors`, `radius`, `spacing`, `typography`, and `shadows`. All values are mapped to `--df-*` CSS custom properties.

## Running

```bash
npx designflow dev          # Open the canvas (default port 4800)
npx designflow dev --port 5000  # Custom port
```

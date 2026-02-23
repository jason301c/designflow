# Wireframes

This directory is managed by [DesignFlow](https://designflow.cc) — a Figma-like canvas where every screen is a real React component.

## Getting Started

```bash
npx designflow dev
```

This opens an infinite canvas at `localhost:4800` showing all your screens as live thumbnails with navigation arrows between them.

## How It Works

```
wireframes/
├── screens/              # Each .tsx file = one screen on the canvas
│   ├── Explore.tsx
│   ├── Repo.tsx
│   └── ...
├── flows.ts              # Screen layout + navigation edges
├── designflow.theme.ts   # Design tokens (colors, spacing, radii, shadows)
├── styles.css            # Tailwind v4 integration (optional)
├── CLAUDE.md             # Conventions for AI-assisted workflows
└── README.md             # This file
```

## Adding a Screen

1. Create `screens/MyScreen.tsx` with a default-exported React component:

```tsx
export default function MyScreen() {
  return (
    <div style={{ background: "var(--df-background)", minHeight: "100vh", fontFamily: "var(--df-font-family)" }}>
      <h1 style={{ color: "var(--df-text)" }}>My Screen</h1>
      <button data-df-navigate="otherscreen">Go somewhere</button>
    </div>
  )
}
```

2. Register it in `flows.ts`:

```ts
screens: {
  myscreen: {                          // ID = lowercase filename without .tsx
    title: "My Screen",
    file: "./screens/MyScreen.tsx",
    position: { x: 0, y: 0 },         // auto-updated when you drag on the canvas
    viewport: "desktop",               // "desktop" | "tablet" | "mobile"
  },
},
```

3. The canvas hot-reloads — your new screen appears immediately.

## Key Concepts

- **`data-df-navigate="screenId"`** — marks any element as a navigation trigger. Renders as a flow arrow on the canvas. Clicking it in the viewer navigates to that screen.
- **`var(--df-*)`** — theme tokens for colors, spacing, radii, shadows, fonts. Use these instead of hardcoding values. Dark mode works automatically.
- **Screen IDs** — lowercase filename without `.tsx`. `Profile.tsx` → `profile`. Must match exactly in `flows.ts` and `data-df-navigate`.
- **Local state** — `useState`, modals, dropdowns, and tabs all work normally inside the viewer.

## Theming

Edit `designflow.theme.ts` to change colors, spacing, radii, shadows, and typography. Changes hot-reload instantly. See `CLAUDE.md` for the full token reference.

## Learn More

- Full docs: [designflow.cc](https://designflow.cc)
- AI conventions: see `CLAUDE.md` in this directory

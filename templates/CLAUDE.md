# DesignFlow Project Conventions

This directory contains wireframes for the app, visualized on an infinite canvas.

## Creating Screens
- Add new screens as `.tsx` files in `screens/`
- Each screen must `export default` a React component with no required props
- Use CSS custom properties for all colors/spacing: `var(--df-primary)`, `var(--df-spacing-md)`, etc.
- For navigation elements that link to other screens, add `data-df-navigate="screenId"`
- Local interactions (modals, dropdowns, tabs) use normal React state — they work inside the viewer

## Dark Mode
- Screens automatically support dark mode when you use `var(--df-*)` tokens
- Dark overrides are defined in `darkColors` in `designflow.theme.ts`
- Toggle light/dark per-screen or globally via the canvas toolbar
- Never hardcode colors like `#fff` or `#000` — use theme tokens instead
- Use `var(--df-background)` for page backgrounds, `var(--df-surface)` for cards

### How dark mode works under the hood
DesignFlow generates two CSS blocks from `designflow.theme.ts`:
```css
:root           { --df-background: #FFFFFF; --df-text: #0F172A; … }
[data-df-color-scheme="dark"] { --df-background: #0F172A; --df-text: #F1F5F9; … }
```
When the dark toggle is activated, the screen wrapper gets `data-df-color-scheme="dark"`, causing descendant elements to pick up the overridden `--df-*` values.

### Inline styles vs Tailwind classes
- **Inline styles** (`style={{ background: "var(--df-background)" }}`) — reference `--df-*` directly, so dark mode works automatically.
- **Tailwind classes** (`bg-background`) — use an intermediate variable (`--color-background: var(--df-background)`) defined in `styles.css`. This **requires `@theme inline`** (not plain `@theme`). Without `inline`, Tailwind v4 registers the properties via `@property`, which resolves `var()` references eagerly at `:root` — breaking the dark mode cascade. Always use `@theme inline` when mapping to external CSS variables.

## Registering Screens
- Add new screens to `flows.ts` with a unique ID, title, file path, and canvas position
- Add edges to define navigation flow between screens
- **Screen IDs must match the lowercased filename (without `.tsx`)**. The screen scanner generates IDs by stripping the extension and lowercasing: `Explore.tsx` → `explore`, `Pullrequest.tsx` → `pullrequest`. The ID you use in `flows.ts` (and in `data-df-navigate` attributes and edge definitions) must match exactly. **Do not use hyphens or other characters that aren't in the filename** — e.g. `"pull-request"` will NOT match a file named `PullRequest.tsx` (scanner produces `pullrequest`). If the IDs don't match, the screen will show "No preview".

## Theme
- All design tokens are in `designflow.theme.ts`
- Never hardcode colors, spacing, or radii — always use `var(--df-*)` properties
- Available tokens: colors, darkColors, radius, spacing, typography, shadows

## Tailwind CSS (optional)
- If `styles.css` exists in this directory, Tailwind v4 is active automatically
- Create it with `designflow init --tailwind` or manually add `@import "tailwindcss"` + `@theme inline { ... }`
- Theme tokens are mapped: `bg-primary`, `text-secondary`, `p-md`, `rounded-lg`, `shadow-sm`, etc.
- You can mix Tailwind classes with `var(--df-*)` inline styles — both work
- **Important**: The `@theme` block MUST use `@theme inline`, not plain `@theme`. Without `inline`, Tailwind v4 generates `@property` declarations that eagerly resolve `var()` references at `:root`, which breaks dark mode cascading. See the "Dark Mode" section above for details.

## Running
- `pnpm designflow dev` to open the canvas

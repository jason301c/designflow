# DesignFlow — CLAUDE.md

## What This Is
An npm package (`designflow`) providing a Figma-like infinite canvas where every screen is a real React component. Users scaffold a `wireframes/` directory, write screens as `.tsx` files, define flows in `flows.ts`, and visualize everything on a pannable canvas with live thumbnails and navigation arrows.

## Development Approach: TDD
Every feature follows Test-Driven Development:
1. Write tests **before** implementation
2. Tests must **fail** first
3. Implement the **minimum** to pass
4. Refactor if needed

## Source of Truth Files
- `PROJECT.md` — Full spec and architecture
- `PROGRESS.md` — Milestone tracker (M1-M4 checkboxes)
- `TDD.md` — Testing strategy and per-module test plans

## Project Structure
```
src/
├── cli/          # init.ts, dev.ts (cac-based CLI)
├── app/          # App.tsx, Canvas.tsx, ScreenNode.tsx, FlowEdge.tsx, Viewer.tsx, Toolbar.tsx, export-png.ts
├── runtime/      # vite-plugin.ts, theme-loader.ts, screen-scanner.ts, flow-writer.ts, default-theme.ts
└── types/        # index.ts (all shared types + constants)
templates/        # Scaffolding for `designflow init` (screens/, flows.ts, theme, CLAUDE.md)
tests/
├── unit/         # Pure function tests
├── integration/  # Component + module tests (Testing Library)
├── e2e/          # Playwright tests
└── fixtures/     # Shared test data
```

## Key Conventions

### Screens
- Default-exported React components, zero required props
- `data-df-navigate="screenId"` marks navigation triggers → rendered as flow arrows
- Screen IDs are **lowercase filenames** without `.tsx` (scanner auto-lowercases)
- Style with `var(--df-*)` tokens or Tailwind classes — never hardcode colors

### Flows
- `flows.ts` defines `DesignFlowConfig`: screens map + edges array
- Positions persist — dragging on canvas writes back via `/__designflow/update-positions`

### Theming
- `designflow.theme.ts` → CSS custom properties via Vite plugin (no in-app theme editor)
- `DEFAULT_THEME` lives in `src/runtime/default-theme.ts` (shared by init CLI and tests)
- Dark mode: `[data-df-color-scheme="dark"]` selector overrides `--df-*` vars per-screen

### Canvas
- React Flow v12 (`@xyflow/react`) powers the canvas
- Custom nodes (`ScreenNode`), custom edges (`FlowEdge`)
- Thumbnails use `transform: scale(MAX_DIM / Math.max(w, h))`
- Handles: left target + right source (left-to-right flow)
- Virtual modules: `virtual:designflow/screens`, `virtual:designflow/theme`, `virtual:designflow/inferred-edges`

### Tailwind v4
- Auto-detects `styles.css` in wireframes dir → injects `<link>` in dev HTML
- `@theme inline` block maps `--color-*`/`--radius-*`/etc. → `var(--df-*)` refs
- Must use `@theme inline` (not plain `@theme`) to avoid `@property` breaking dark mode cascade

### PNG Export
- `html-to-image@1.11.11` (pinned version)
- Canvas export: captures `.react-flow__viewport` at 2048x1536 via `getViewportForBounds`
- Screen export: captures `[data-df-screen-content]` at full resolution

## Tech Stack
- React 19, React Flow v12, Vite 7, tsup 8, TypeScript 5.9
- Testing: Vitest 4, @testing-library/react, Playwright
- CLI: cac | Styling: Tailwind 4 + CSS custom properties (`--df-*`)

## Commands
```bash
pnpm test              # Unit + integration tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
pnpm test:e2e          # Playwright E2E
pnpm build             # Build with tsup
pnpm dev               # Run dev server locally
```

## Commits
Short (1 sentence), semantic format. Commit after implementing + testing.

## Testing Gotchas
- React Flow is mocked in tests (jsdom can't render canvas)
- jsdom converts hex → rgb: use `toContain("r, g, b")` for style assertions
- CLI bin tests use cac's `parse({ run: false })` instead of subprocess spawning
- `getViewportForBounds` takes 7 args: `(bounds, width, height, minZoom, maxZoom, padding)`

## File Naming
- Source: `kebab-case.ts` / `PascalCase.tsx` (components)
- Tests: `<module>.test.ts` or `<component>.test.tsx`
- Descriptions: `it("should <behavior> when <condition>")`

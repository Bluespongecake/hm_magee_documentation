# Agent Instructions

## Content File Guardrails (content/**/*.tsx)

Content files live in `content/{project}/{document}.tsx`. Structure mirrors the site: `/` lists projects, `/{project}` lists documents, `/{project}/{document}` renders the doc.

**Rules:**
- **Only import** from `../../app/components/document-template` (adjust `../` by depth: 2 levels = `../../`).
- **Only use** predefined components (DocumentPage, DocumentSection, Callout, CodeBlock, DataTable, etc.) and design-token-based utility classes (`text-positive`, `text-negative`).
- **Do not define** new components, hooks, or helper functions. One default export only.
- **No inline styles** (`style={{}}`). Use design-token classes only.
- **Data only** for variable content: `navItems`, `heroMeta`, `footerColumns`, `StructuredListItem[]`, etc.

**Workflow:** Create doc → AI converts to TSX → put in `content/{project}/` → run `npm run generate-content` (or dev/build).

## Design Token Enforcement
- Use design tokens from `design-tokens.css` for all UI styles.
- Do not introduce raw hex/rgb/hsl color values in component or page CSS.
- Prefer semantic token variables (for example `--cds-text-primary`, `--cds-background`, `--cds-border-subtle`) over palette tokens when both exist.
- When changing styles, keep `@import "../design-tokens.css";` at the top of `app/globals.css` and continue referencing `var(--cds-...)` values.
- Before finishing a styling task, run `npm run lint:styles`.
- In your completion summary for style edits, list the main tokens used.

## Scope
- `design-tokens.css` is the source-of-truth file where raw values are allowed.
- All other CSS should consume tokens only.


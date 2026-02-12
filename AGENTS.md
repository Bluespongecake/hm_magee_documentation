# Agent Instructions

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

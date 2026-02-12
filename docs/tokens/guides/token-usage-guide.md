# Token Usage Guide

Reference guide only. Runtime tokens for implementation live in `design-tokens.css` at repo root.

## Color meaning map
- `--color-background-default`: page and standard surface background.
- `--color-background-inverse`: high-emphasis dark surfaces (header, hero, recommendation, footer).
- `--color-background-hover`: hover state for neutral surfaces.
- `--color-layer-01`: subtle raised block background (tiles, code, callouts, table rows).
- `--color-text-primary`: default long-form text.
- `--color-text-secondary`: secondary supporting text.
- `--color-text-helper`: labels, helper metadata.
- `--color-text-inverse-primary`: primary text on dark surfaces.
- `--color-text-inverse-secondary`: secondary text on dark surfaces.
- `--color-text-inverse-helper`: helper/meta text on dark surfaces.
- `--color-link-primary`: default link/accent color.
- `--color-accent-subtle`: softer accent text on dark surfaces.
- `--color-accent-strong`: high-contrast accent text on light surfaces.
- `--color-border-subtle`: neutral separators on light surfaces.
- `--color-border-inverse`: separators on dark surfaces.
- `--color-feedback-success`: success semantic color.
- `--color-feedback-error`: error semantic color.
- `--color-feedback-warning`: warning semantic color.
- `--color-feedback-info`: info semantic color.
- `--color-feedback-positive-text`: positive KPI text.
- `--color-feedback-negative-text`: negative KPI text.

## Component color mapping
- Header: `--component-header-*`
- Hero: `--component-hero-*`
- Side nav: `--component-side-nav-*`
- Tags: `--component-tag-*` (info/teal/success/feature/advisory/neutral)
- Callouts: `--component-callout-*`
- Table: `--component-table-*`
- Structured list icon: `--component-structured-list-icon-text`
- Recommendation block: `--component-recommendation-*`
- Footer: `--component-footer-*`
- KPI polarity text: `--component-status-positive-text`, `--component-status-negative-text`

## Typography mapping
- `--font-family-sans`: primary body and heading face.
- `--font-family-mono`: inline/code content face.
- `--font-weight-light`: large display headings.
- `--font-weight-regular`: body and default UI text.
- `--font-weight-medium`: medium-emphasis labels/tags.
- `--font-weight-semibold`: headings, callout titles, key labels.
- `--font-weight-bold`: highest emphasis nav/current-state labels.

## Token selection order
1. Component token (`--component-*`)
2. Semantic token (`--color-*`, `--spacing-*`, `--layout-*`, `--font-*`)
3. Primitive token (`--primitive-*`) only when defining new semantic/component tokens

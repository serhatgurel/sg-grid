# Examples & demos — Filter & Sort

This page points to the in-repo examples and explains what each demo shows.

## Filter & Sort Playground

- File: `src/examples/FilterSortPlayground.vue`
- Purpose: Interactive playground that demonstrates client-side and server-side filtering and sorting. Use the controls at the top to change the active filter, operator, value and toggle server-side mode. The playground captures developer warnings (console.warn) and shows them in the UI to help debug malformed clauses.
- Key features shown:
  - Client-side `applyFilters` and `applySort` via `useVisibleRows` composable
  - Server-side demo: toggling `serverSide` switches to emitting `request:page` events which the playground handles and updates rows
  - Keyboard accessibility for headers: focus headers and press Enter/Space to toggle sort

## Minimal Example

- File: `src/examples/MinimalExample.vue`
- Purpose: A collection of small grids demonstrating declarative vs prop-based usage, nested field access, computed column fields, and simple SFC-based column declarations.
- Key features shown:
  - Declaring columns via `SgColumn` children
  - Passing `columns` array via props
  - Examples that render no rows and no columns to show safe defaults

## Quick usage snippets

See `docs/usage-examples.md` for copyable snippets showing single-column sort, multi-column sort, filters and a server-side example.

## How to run the examples locally

Start the dev server:

```bash
npm run dev
```

Open the app in your browser (Vite default is http://localhost:5173) and navigate to the examples page in the demo app. The playground is useful for manual testing of filter/sort behaviours and accessibility.

## Notes for contributors

- When adding new capabilities, add a small example to either `MinimalExample.vue` or `FilterSortPlayground.vue` so maintainers can manually verify behaviour.
- Prefer updating the playground to demonstrate runtime warnings or server-side behavior rather than adding isolated demos.

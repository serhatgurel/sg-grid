```markdown
# Filter & Sort — Developer Guide

This guide explains how to use the Filter & Sort feature in `sg-grid`, including examples and notes for implementers.

Basic usage

Props (SgGrid)

- `sort` — single or array of `{ columnKey, direction }`
- `filter` — array of `{ columnKey, op, value }`
- `filterMode` — `'and' | 'or'` (default: `'and'`)
- `caseSensitive` — boolean (default: false)
- `serverSide` — boolean (default: false)

Events

- `update:sort` — emitted when user changes sorting via headers
- `update:filter` — emitted when user updates filters (debounced)
- `request:page` — emitted when `serverSide=true` to request a page from host

Examples

- Single sort:

  <SgGrid :columns="cols" :rows="rows" :sort="{ columnKey: 'age', direction: 'desc' }" />

- Filter contains:

  <SgGrid :filter="[{ columnKey: 'name', op: 'contains', value: 'al' }]" />

Playground & Minimal examples

- `src/examples/FilterSortPlayground.vue` — interactive playground. Use this to verify runtime behaviour and server-side emulation.
- `src/examples/MinimalExample.vue` — small static examples demonstrating prop-based and slot-based column declarations.

Implementation notes for contributors

- Core utilities are in `src/lib/dataUtils.ts` (applyFilters/applySort). Keep them pure and immutable.
- Operator helpers (eq, ne, lt, contains, in, between, etc.) live with dataUtils and must be tested.
- `useVisibleRows` composable combines filtering and sorting and should be reused in `SgGrid`.
- Column-level hooks: `column.filterFunction` and `column.sortFunction` must be respected by utilities and composable.

Testing

- Run unit tests: `npm run test:run --silent` (required before marking tasks done).
- Add tests in `tests/unit/` and update `src/examples/FilterSortPlayground.vue` when adding new behaviors.

Notes & gotchas

- `in` operator treats non-array value as equality fallback.
- `between` requires a 2-element array and is otherwise ignored with a dev warning.
- Null/undefined and `NaN` are treated as missing values and do not match relational or string ops.
```

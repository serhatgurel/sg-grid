# Feature Design: Filter & Sort for SG Grid

This document defines the initial design for client-side filter and sort features for `sg-grid` (Task 2.1).

Goals

- Provide a simple, declarative API for sorting and filtering that works with the existing `columns` and `rows` props.
- Keep the API framework-agnostic and easy to test.
- Support client-side behavior first; server-side adapters will be addressed in Task 2.2.3.

Design constraints

- Backwards compatible with current `SgGrid`/`SgColumn` minimal API.
- Do not change existing `columns` or `rows` shapes; extend using optional fields and props/events.
- Prefer explicit props over implicit mutations.

API surface

Props (SgGrid)

- `sort?: { columnKey: string; direction: 'asc' | 'desc' } | Array<{ columnKey: string; direction: 'asc' | 'desc' }>`
  - One or multiple columns can be sorted. When an array is provided, sorting is applied in order (multi-column sort).
  - If absent, grid renders unsorted.

- `filter?: Array<{ columnKey: string; op: string; value: unknown }>`
  - An array of filter clauses (AND semantics between clauses). Each clause targets a column by `columnKey`, an operator `op` and a `value`.
  - Operators supported initially (client-side): `eq`, `ne`, `lt`, `lte`, `gt`, `gte`, `contains`, `startsWith`, `endsWith`, `in` (value is array), `between` (value is [min, max]).

- `filterMode?: 'and' | 'or'` (default: 'and')
  - How multiple filters combine. Default is `and` to narrow results. `or` may be useful for multi-value searches.

- `caseSensitive?: boolean` (default: false)
  - Controls string comparison sensitivity for `contains`, `startsWith`, `endsWith`, `eq`.

- `serverSide?: boolean` (default: false)
  - When true, the grid will not execute client-side filtering/sorting; instead it emits events requesting the host app to provide rows.

Events (SgGrid emits)

- `update:sort` — payload: same shape as `sort` prop. Emitted when user toggles sort via header interaction.
- `update:filter` — payload: same shape as `filter` prop. Emitted when user changes filter inputs (debounced by default).
- `request:page` — payload: { page: number, pageSize: number, sort, filter } (emitted when serverSide=true and grid requests a page)

Header/Column options

- ColumnDef additions (optional):
  - `sortable?: boolean` (default: false)
  - `filterable?: boolean` (default: false)
  - `sortFunction?: (a, b, direction) => number` (optional custom comparator)
  - `filterFunction?: (cellValue, clause) => boolean` (optional custom filter handler)

User interactions (defaults)

- Clicking a sortable header toggles between: none -> asc -> desc -> none.
- Shift-clicking a sortable header will add/remove multi-column sort entries (append to `sort` array).
- Filter UIs are not prescriptive in this doc; the grid exposes events and accepts `filter` prop. A default simple text input can be rendered via header slot when `filterable=true`.

Edge cases and behaviours

- Missing columnKey in a filter clause: ignored. The grid will log a warning in dev mode.
- Unknown operator `op`: filter clause ignored and a dev warning emitted.
- `in` operator with non-array value is treated as equality check against the single value.
- `between` requires a two-element array; when malformed, the clause is ignored.
- Null/undefined cell values: comparisons return false for relational ops and `contains`.
- `NaN` is treated as missing and does not match any operator.
- Type coercion: numeric comparisons attempt to coerce strings like `'10'` to numbers when the column's data appears numeric (first N non-null samples heuristic). This heuristic can be disabled per-column via `filterFunction`.

Performance

- Default client-side implementations operate on the `rows` array and return a filtered/sorted array for rendering. For large datasets (> 5k rows), recommend enabling `serverSide=true` and implementing server paging/sort/filter.

Examples

- Sorting (single):
  <SgGrid :columns="cols" :rows="rows" :sort="{ columnKey: 'age', direction: 'desc' }" />

- Filtering (single):
  <SgGrid :filter="[{ columnKey: 'name', op: 'contains', value: 'al' }]" />

- Multi-sort and multi-filter:
  <SgGrid :sort="[{ columnKey: 'lastName', direction: 'asc' }, { columnKey: 'age', direction: 'desc' }]"
          :filter="[{ columnKey: 'active', op: 'eq', value: true }, { columnKey: 'age', op: 'gte', value: 30 }]" />

Implementation notes

- Client-side filtering and sorting should be implemented as pure, testable functions (e.g., `applyFilters(rows, filter, columns)` and `applySort(rows, sort, columns)` exported from `src/lib/dataUtils.ts`).
- UI: header slots and optional built-in header renderer will toggle sort state and render filter inputs when `filterable`.
- Debounce filter input changes (default 300ms) to avoid excessive events.

Testing

- Unit tests for `applyFilters` and `applySort` covering operators, edge cases (null, NaN, coercion, between, in), and multi-column sorts.
- Component tests to ensure events are emitted for header interactions and that `serverSide` mode emits `request:page` with correct payload.

Next steps

- After your approval, I will implement the utility functions (`applyFilters`, `applySort`) and add minimal header UI for sorting in `SgGrid` (Task 2.2).

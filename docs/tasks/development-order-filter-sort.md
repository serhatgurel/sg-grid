# Filter & Sort — Development-ordered, Test‑First Checklist

This file exports the full, development-ordered list derived from `docs/tasks/tasks-filter-sort.md`.
Each implementation step is paired with a test-first item: write the unit tests (Vitest) before implementing the code.

Notes

- Follow TDD: write the test first; see each step’s paired test item. A test must fail before the implementation step begins.
- Prefer pure utilities in `src/lib/dataUtils.ts` for `applyFilters` and `applySort`.
- Keep functions pure and immutable (return new arrays).
- Introduce a minimal, visual playground early so developers can manually verify UX while building.
- Each task must further the feature set but must not depend on later tasks (no forward dependencies).
- Demo maintenance rule: once the demo (playground) exists, every subsequent task must update the demo to surface the new capability before the task can be considered complete.

## Development-ordered checklist

- [x] 1 — Design: finalize API
  - Confirm and document filter & sort API (props, events, edge-cases). Source: `docs/feature-filter-sort.md`.

- [x] 2 — Create dataUtils tests (filters)
  - Write Vitest unit tests for `applyFilters` covering operator behaviours, null/NaN/coercion and immutability. Commit tests before implementation.

- [x] 3 — Implement applyFilters
  - Implement `applyFilters(rows, filter, columns, options?)` in `src/lib/dataUtils.ts`. Must be pure, return new arrays, support `column.filterFunction` overrides and `caseSensitive` option. Pass tests from item 2.

- [x] 4 — Create dataUtils tests (sort)
  - Write Vitest unit tests for `applySort` covering single-column sort, multi-column sort, custom comparator, stability and immutability. Commit tests first.

- [x] 5 — Implement applySort
  - Implement `applySort(rows, sort, columns)` in `src/lib/dataUtils.ts`. Pure, returns new array, supports multi-column ordering and `column.sortFunction` overrides. Pass tests from item 4.

- [x] 6 — Early visual demo (playground)
- Build `src/examples/FilterSortPlayground.vue` that imports the composable or utilities directly and provides simple external controls (dropdowns/inputs) for sort and filter. Wire it in `App.vue` so devs can visually verify behaviour early. No header interactions required.

- [x] 7 — Composable visible-rows tests (with filterMode & fast-fail)
- Unit tests for a composable that computes visible rows from `rows`, `sort`, `filter`, `filterMode`, `caseSensitive`. Include fast-fail when inputs are empty (return original or shallow copy). Keep pure and easily testable.

- [x] 8 — Implement composable `useVisibleRows`
- Implement a composable (e.g., `src/components/useVisibleRows.ts`) that uses `applyFilters` and `applySort`, honours `filterMode` (`and` | `or`) and `caseSensitive`. Pass tests from item 7. Do not integrate into `SgGrid` yet.

- [x] 9 — Operator helpers tests (relational)
  - Focused tests for `eq`, `ne`, `lt`, `lte`, `gt`, `gte` covering null/undefined and NaN edge cases.

- [x] 10 — Implement operator helpers (relational)
  - Implement and export relational operator helpers with deterministic coercion and safe NaN handling.

- [x] 11 — String ops tests (case)
  - Tests for `contains`, `startsWith`, `endsWith` with `caseSensitive` true/false and non-string inputs.

- [x] 12 — Implement string ops & case handling
- Implement string operators honouring `caseSensitive` and null-safe behaviour.

- [x] 13 — Array ops tests (`in`, `between`)
  - Tests for `in` (array & single value) and `between` (valid two-element arrays and malformed input).

- [x] 14 — Implement `in` & `between` ops
- Implement `in` and `between` with validation and fallbacks (treat non-array in `in` as equality). Pass tests.

- [x] 16 — Implement coercion handling
  - Implement coercion heuristics and NaN handling used by operators/filters. Ensure pure behaviour and pass tests.
- Unit tests verifying `column.sortFunction` and `column.filterFunction` overrides are invoked by utilities when present.

- [x] 17 — Column-level hooks tests
  - Unit tests verifying `column.sortFunction` and `column.filterFunction` overrides are invoked by utilities when present.

- [x] 18 — Implement column-level hook support
  - Wire support for `column.sortFunction` and `column.filterFunction` in `dataUtils`. Utilities should call overrides when present.

- [x] 19 — Server-side behaviour tests
  - Component tests asserting that when `serverSide=true` no client filtering/sorting occurs and that `request:page` and `update:sort`/`update:filter` are emitted on user actions.

- [x] 20 — Implement server-side wiring/events
  - When `serverSide=true`, disable client filtering/sorting and emit `request:page` with `{ page, pageSize, sort, filter }` on pagination/sort/filter changes. Emit `update:sort` / `update:filter` on user interactions.

- [x] 21 — Example handler for `request:page`
  - Add an example server-side handler in `src/examples` showing how to respond to `request:page` and update grid data.

- [x] 22 — Header sorting tests (interactions)
  - Tests: header click cycles `none -> asc -> desc -> none`; `shift+click` appends multi-sort. Assert emitted `update:sort` and UI state.

- [x] 23 — Implement header sort interactions
  - Implement header click and `shift+click` behaviour in `SgColumn` / `SgGrid`. Emit `update:sort` and update local state when not `serverSide`.

- [x] 24 — Sort visual affordance tests
  - Unit/visual-smoke tests for direction indicators and multi-sort order display (e.g., numeric badge for priority).

- [x] 25 — Implement sort visual affordances
  - Render minimal indicators (▲ / ▼ and order number) in column headers. Keep styling minimal and testable.

- [x] 26 — Filter UI tests (header inputs)
- Tests verifying header filter inputs render when `column.filterable=true`, emit `update:filter` (debounced), and are clearable.

- [x] 27 — Implement header filter controls
- Render simple text input in header (and number/date variants where appropriate). Wire debounced `update:filter` emits and clear behaviour.

- [x] 28 — Accessibility tests (ARIA, keyboard)
  - Tests for `aria-sort`, keyboard focus and activation behaviour for header controls.

- [x] 29 — Implement accessibility features
  - Add `aria-sort`, keyboard handlers, and focus styles to header controls to satisfy accessibility tests.

- [x] 30 — Validation tests for edge cases
  - Tests: malformed filter clauses are ignored with dev-mode warnings; unknown operator ignored with dev warning; `in` with non-array treated as equality; `between` requires 2-element array; `NaN` treated as missing.

- [x] 31 — Implement validation & warnings
  - Implement filter clause validation and dev-mode console warnings with graceful fallbacks. Pass tests from item 30.

- [x] 32 — Testing strategy & infra
  - Confirm `vitest` + `@vue/test-utils` setup, add test helpers and fixtures. Enforce test-first workflow in PRs.

- [x] 33 — Docs & examples updates
  - Add usage examples in `docs/` and `src/examples/MinimalExample.vue` and `src/examples/FilterSortPlayground.vue`: single-column sort, multi-column sort, simple `contains` filter, server-side example. Update `README.md` and docs index links.

- [x] 34 — Performance docs & fast-fail
  - Document thresholds and recommend `serverSide=true` for large datasets (e.g., >5k rows). Ensure utilities and composable fast-fail on empty filter/sort.

- [x] 35 — Types & exports
  - Export TypeScript types for `applyFilters` / `applySort`, the operator helpers, and extend Column props to include `sortFunction` / `filterFunction`. Add type tests if helpful.

- [ ] 36 — Changelog entry draft
  - Add a draft changelog entry describing the new filter & sort features and API.

- [ ] 37 — Code, docs & test review
  - Conduct reviews: code review, docs review, and unit test review. Address feedback and finalize feature.

- Start at item 2. Mark tests in source control first. Implement and run tests, iterate until green. Move to next item.
- After completing item 6 (demo), ensure each subsequent task updates `src/examples/FilterSortPlayground.vue` (or related wiring in `App.vue`) to demonstrate the new capability before marking the task as done.

## File location

Saved as `docs/tasks/development-order-filter-sort.md`.

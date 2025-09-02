# Filter & Sort — Development-ordered, Test‑First Checklist

This file exports the full, development-ordered list derived from `docs/tasks/tasks-filter-sort.md`.
Each implementation step is paired with a test-first item: write the unit tests (Vitest) before implementing the code.

Notes

- Follow TDD: tests must be added (and fail) before implementation of the corresponding item.
- Prefer pure utilities in `src/lib/dataUtils.ts` for `applyFilters` and `applySort`.
- Keep functions pure and immutable (return new arrays).

## Development-ordered checklist

- [x] 1 — Design: finalize API
  - Confirm and document filter & sort API (props, events, edge-cases). Source: `docs/feature-filter-sort.md`.

- [ ] 2 — Create dataUtils tests (filters)
  - Write Vitest unit tests for `applyFilters` covering operator behaviours, null/NaN/coercion and immutability. Tests committed before implementation.

- [ ] 3 — Implement applyFilters
  - Implement `applyFilters(rows, filter, columns, options?)` in `src/lib/dataUtils.ts`. Must be pure, return new arrays, support `column.filterFunction` overrides and `caseSensitive` option. Pass tests from item 2.

- [ ] 4 — Create dataUtils tests (sort)
  - Write Vitest unit tests for `applySort` covering single-column sort, multi-column sort, custom comparator, stability and immutability. Tests committed first.

- [ ] 5 — Implement applySort
  - Implement `applySort(rows, sort, columns)` in `src/lib/dataUtils.ts`. Pure, returns new array, supports multi-column ordering and `column.sortFunction` overrides. Pass tests from item 4.

- [ ] 6 — Operator helpers tests (relational)
  - Add focused tests for relational operators: `eq`, `ne`, `lt`, `lte`, `gt`, `gte`. Include null/undefined and NaN edge cases.

- [ ] 7 — Implement operator helpers (relational)
  - Implement and export relational operator helpers. Ensure deterministic coercion rules and safe NaN handling.

- [ ] 8 — String ops tests (case)
  - Write tests for `contains`, `startsWith`, `endsWith` with `caseSensitive` true/false and non-string inputs.

- [ ] 9 — Implement string ops & case handling
  - Implement string operators honoring `caseSensitive` and null-safe behavior.

- [ ] 10 — Array ops tests (`in`, `between`)
  - Write tests for `in` (array & single value) and `between` (valid two-element arrays and malformed input).

- [ ] 11 — Implement `in` & `between` ops
  - Implement `in` and `between` with validation and fallbacks (treat non-array in `in` as equality). Pass tests.

- [ ] 12 — Coercion & NaN tests
  - Tests for `coerceIfNumeric` behavior: numeric-like strings vs strings and NaN treated as missing (no match). Include immutability assertions.

- [ ] 13 — Implement coercion handling
  - Implement coercion heuristics and NaN handling used by operators/filters. Ensure pure behavior and pass tests.

- [ ] 14 — Column-level hooks tests
  - Unit tests verifying `column.sortFunction` and `column.filterFunction` overrides are invoked by utilities when present.

- [ ] 15 — Implement column-level hook support
  - Wire support for `column.sortFunction` and `column.filterFunction` in `dataUtils`. Utilities should call overrides when present.

- [ ] 16 — Composable visible-rows tests
  - Write unit tests for composable / grid method that computes visible rows from `props.rows`, `props.sort`, `props.filter` (happy path + edge cases).

- [ ] 17 — Integrate utilities in `SgGrid` or a composable
  - Use `applyFilters` and `applySort` to compute visible rows. Implement `filterMode` (`and` | `or`) semantics here. Keep logic testable and pure. Pass tests from item 16.

- [ ] 18 — FilterMode & fast-fail tests
  - Tests for `filterMode` semantics and fast-fail when `filter`/`sort` are empty (should avoid work and return original rows or a shallow copy).

- [ ] 19 — Server-side behavior tests
  - Component tests asserting that when `serverSide=true` no client filtering/sorting occurs and that `request:page` and `update:sort`/`update:filter` are emitted on user actions.

- [ ] 20 — Implement server-side wiring/events
  - When `serverSide=true`, disable client filtering/sorting and emit `request:page` with `{ page, pageSize, sort, filter }` on pagination/sort/filter changes. Emit `update:sort` / `update:filter` on user interactions.

- [ ] 21 — Example handler for `request:page`
  - Add an example server-side handler in `src/examples` showing how to respond to `request:page` and update grid data.

- [ ] 22 — Header sorting tests (interactions)
  - Tests: header click cycles `none -> asc -> desc -> none`; `shift+click` appends multi-sort. Assert emitted `update:sort` and UI state.

- [ ] 23 — Implement header sort interactions
  - Implement header click and `shift+click` behavior in `SgColumn` / `SgGrid`. Emit `update:sort` and update local state when not `serverSide`.

- [ ] 24 — Sort visual affordance tests
  - Unit/visual-smoke tests for direction indicators and multi-sort order display (e.g., numeric badge for priority).

- [ ] 25 — Implement sort visual affordances
  - Render minimal indicators (▲ / ▼ and order number) in column headers. Keep styling minimal and testable.

- [ ] 26 — Filter UI tests (header inputs)
  - Tests verifying header filter inputs render when `column.filterable=true`, emit `update:filter` (debounced), and are clearable.

- [ ] 27 — Implement header filter controls
  - Render simple text input in header (and number/date variants where appropriate). Wire debounced `update:filter` emits and clear behavior.

- [ ] 28 — Accessibility tests (ARIA, keyboard)
  - Tests for `aria-sort`, keyboard focus and activation behavior for header controls.

- [ ] 29 — Implement accessibility features
  - Add `aria-sort`, keyboard handlers, and focus styles to header controls to satisfy accessibility tests.

- [ ] 30 — Validation tests for edge cases
  - Tests: malformed filter clauses are ignored with dev-mode warnings; unknown operator ignored with dev warning; `in` with non-array treated as equality; `between` requires 2-element array; `NaN` treated as missing.

- [ ] 31 — Implement validation & warnings
  - Implement filter clause validation and dev-mode console warnings with graceful fallbacks. Pass tests from item 30.

- [ ] 32 — Testing strategy & infra
  - Confirm `vitest` + `@vue/test-utils` setup, add test helpers and fixtures. Enforce test-first workflow in PRs.

- [ ] 33 — Docs & examples updates
  - Add usage examples in `docs/` and `src/examples/MinimalExample.vue`: single-column sort, multi-column sort, simple `contains` filter, server-side example. Update `README.md` and docs index links.

- [ ] 34 — Performance docs & fast-fail
  - Document thresholds and recommend `serverSide=true` for large datasets (e.g., >5k rows). Ensure utilities fast-fail on empty filter/sort.

- [ ] 35 — Types & exports
  - Export TypeScript types for `applyFilters` / `applySort` and extend Column props to include `sortFunction` / `filterFunction`. Add type tests if helpful.

- [ ] 36 — Changelog entry draft
  - Add a draft changelog entry describing the new filter & sort features and API.

- [ ] 37 — Code, docs & test review
  - Conduct reviews: code review, docs review, and unit test review. Address feedback and finalize feature.

---

## How to use

- Start at item 2. Mark tests in source control first. Implement and run tests, iterate until green. Move to next item.

## File location

Saved as `docs/tasks/development-order-filter-sort.md`.

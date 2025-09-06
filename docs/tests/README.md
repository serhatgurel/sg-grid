````markdown
# Unit tests — sg-grid

This document explains the unit test layout and common commands for running tests locally.

Quick commands

- Run all unit tests (CI-friendly, silent):

```bash
npm run test:run --silent
```
````

- Run tests in watch/dev mode (interactive):

```bash
npm run test
```

- Run the Vitest UI (web-based):

```bash
npm run test:ui
```

Project layout

- Tests live under `tests/unit/`.
- Files are organized by feature area:
  - `dataUtils.*.spec.ts` — unit tests for the filter/sort utilities and operator helpers.
  - `SgGrid.*.spec.ts` and `SgColumn.spec.ts` — component-level tests for header interactions, accessibility, server-side wiring, pagination and filter UI.
  - `useVisibleRows.spec.ts` — composable behaviour (filter + sort composition).
  - `dom-utils.spec.ts`, `mounts.spec.ts`, `test-utils.spec.ts` — helpers and DOM utilities used across tests.
  - `types.export.spec.ts` — basic type-export checks.

# Unit tests — sg-grid

This document explains the unit test layout and common commands for running tests locally.

## Quick commands

- Run all unit tests (CI-friendly, silent):

```bash
npm run test:run --silent
```

- Run tests in watch/dev mode (interactive):

```bash
npm run test
```

- Run the Vitest UI (web-based):

```bash
npm run test:ui
```

## Project layout

- Tests live under `tests/unit/`.
- Files are organized by feature area:
  - `dataUtils.*.spec.ts` — unit tests for the filter/sort utilities and operator helpers.
  - `SgGrid.*.spec.ts` and `SgColumn.spec.ts` — component-level tests for header interactions, accessibility, server-side wiring, pagination and filter UI.
  - `useVisibleRows.spec.ts` — composable behaviour (filter + sort composition).
  - `dom-utils.spec.ts`, `mounts.spec.ts`, `test-utils.spec.ts` — helpers and DOM utilities used across tests.
  - `types.export.spec.ts` — basic type-export checks.

## Tests index (one-line descriptions)

- `tests/unit/dataUtils.array.spec.ts` — tests array-related operators and helpers used by filtering (e.g., `in`, `between`).
- `tests/unit/dataUtils.coerce.spec.ts` — verifies coercion rules for numeric-like strings and NaN handling.
- `tests/unit/dataUtils.filters.spec.ts` — unit tests for the `applyFilters` utility and filter composition.
- `tests/unit/dataUtils.hooks.spec.ts` — ensures column-level `filterFunction` and `sortFunction` hooks are invoked correctly.
- `tests/unit/dataUtils.minimal.spec.ts` — minimal integration tests for data utils covering common happy paths.
- `tests/unit/dataUtils.operators.spec.ts` — operator unit tests (eq, ne, lt, lte, gt, gte, etc.).
- `tests/unit/dataUtils.sort.spec.ts` — tests for the `applySort` utility including multi-column and stability.
- `tests/unit/dataUtils.string.spec.ts` — string operator tests (contains, startsWith, endsWith) and case sensitivity.
- `tests/unit/dataUtils.validation.31.spec.ts` — edge-case validation tests for filter clause handling (legacy/variant checks).
- `tests/unit/dataUtils.validation.spec.ts` — validation tests ensuring malformed clauses are handled safely.
- `tests/unit/dom-utils.spec.ts` — tests DOM utility helpers used by components and tests.
- `tests/unit/infra.spec.ts` — small infra checks used to validate test environment assumptions.
- `tests/unit/mounts.spec.ts` — tests for mounting helpers and test-utils integrations.
- `tests/unit/SgColumn.spec.ts` — unit tests for the `SgColumn` component behavior and props.
- `tests/unit/SgGrid.accessibility.implement.spec.ts` — implementation-focused accessibility checks for grid headers/controls.
- `tests/unit/SgGrid.accessibility.spec.ts` — accessibility behaviour tests (ARIA, keyboard focus/activation).
- `tests/unit/SgGrid.filterUi.clear.spec.ts` — tests that header filter inputs clear correctly and emit expected events.
- `tests/unit/SgGrid.filterUi.spec.ts` — tests for header filter UI rendering and debounced emits.
- `tests/unit/SgGrid.headerEmits.spec.ts` — verifies `update:sort` / `update:filter` emits from header interactions.
- `tests/unit/SgGrid.headerInteractions.spec.ts` — header click/shift-click and keyboard interaction tests.
- `tests/unit/SgGrid.pagination.spec.ts` — pagination behavior and `request:page` event tests (server-side mode).
- `tests/unit/SgGrid.serverSide.spec.ts` — server-side mode tests: grid emits and disables client filtering/sorting.
- `tests/unit/SgGrid.sortAffordances.spec.ts` — visual affordance tests for sort indicators and ordering badges.
- `tests/unit/SgGrid.spec.ts` — broader integration tests for `SgGrid` end-to-end component behaviour.
- `tests/unit/test-utils.spec.ts` — tests for internal test helpers and shared utilities.
- `tests/unit/types.export.spec.ts` — compile-time/type tests ensuring the public types are exported correctly.
- `tests/unit/useVisibleRows.spec.ts` — tests the `useVisibleRows` composable combining filtering and sorting.
  Want a summary of tests by area?

- I can generate a short index of the tests with descriptions (one-line) if you'd like — tell me which files you want documented first.

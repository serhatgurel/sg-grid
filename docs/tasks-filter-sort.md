# Task 2 — Filter & Sort (expanded)

This file expands Task 2 from `docs/tasks.md` using the design notes in `docs/feature-filter-sort.md` and breaks the work into small, actionable subtasks (design, implementation, tests, docs, review).

Requirements extracted from the design doc:

- Provide a declarative API for sorting and filtering that works with existing `columns` and `rows` props
- Support client-side behaviour first, with server-side adapter hooks (events) available
- Support multi-column sorting and a set of named filter operators
- Make client-side functions pure and testable (`applyFilters`, `applySort`)
- Add minimal header UI to toggle sort and optionally render filter inputs
- Emit update events and server request events when `serverSide=true`
- Cover edge-cases in implementation and unit tests (null/undefined, NaN, coercion, malformed clauses)
- Keep performance guidance (recommend serverSide for large datasets)

---

Top-down implementation order (Test-First)

This plan enforces a test-first workflow: for each implementation unit, write unit tests first (failing), implement the code to satisfy them, then refactor and add integration/component tests where applicable. Tests should not be deferred until the end.

```markdown
- [x] 2.  As a user, I want filter and sort so I can find information quickly.
  - [x] 2.1 Design: finalize filter & sort API (props/events/edge-cases)
    - Notes: API defined in `docs/feature-filter-sort.md` (sort prop, filter prop, filterMode, caseSensitive, serverSide, column-level options)

  - [ ] 2.2 Implementation — Core utilities (first priority, TDD)
    - [ ] 2.2.1 Create `src/lib/dataUtils.ts` (TDD cycle):
      - [ ] Tests: write unit tests for `applyFilters` behaviours (operators, null/NaN/coercion) — tests must be committed before implementation
      - [ ] Implement `applyFilters(rows, filter, columns, options?)` — satisfy tests
      - [ ] Tests: write unit tests for `applySort` behaviours (single/multi/custom comparator)
      - [ ] Implement `applySort(rows, sort, columns)` — satisfy tests
      - [ ] Ensure functions are pure and return new arrays (add immutability tests)
    - [ ] 2.2.2 Operator semantics & helpers (TDD for each helper)
      - [ ] Tests: operators: eq, ne, lt, lte, gt, gte
      - [ ] Implement the relational operators to pass tests
      - [ ] Tests: string operators: contains, startsWith, endsWith (caseSensitive true/false)
      - [ ] Implement string operators and case-sensitivity to pass tests
      - [ ] Tests: array ops: in (array & single value), between (correct & malformed)
      - [ ] Implement `in` and `between` semantics to pass tests
      - [ ] Tests: coercion behaviour (coerceIfNumeric heuristic) and null/NaN handling
      - [ ] Implement coercion and safe handling to pass tests
    - [ ] 2.2.3 Column-level handler hooks (TDD)
      - [ ] Tests: verify `column.sortFunction` and `column.filterFunction` overrides are invoked when provided
      - [ ] Implement hook support in utilities to satisfy tests

  - [ ] 2.3 Integration — grid wiring (builds on utilities, TDD where possible)
    - [ ] 2.3.1 Client-side integration (TDD)
      - [ ] Tests: write unit tests for the composable or grid method that computes visible rows from `props.rows`, `props.sort`, `props.filter`
      - [ ] Integrate utilities in `SgGrid` (or a composable) to compute visible rows — satisfy tests
      - [ ] Apply `filterMode` ('and' | 'or') semantics and add tests for both modes
      - [ ] Ensure fast-fail when filter/sort empty (add tests)
    - [ ] 2.3.2 Server-side wiring
      - [ ] Tests: write component tests verifying that when `serverSide=true` no client filtering/sorting occurs and `request:page` is emitted
      - [ ] Implement emission of `request:page` with payload { page, pageSize, sort, filter } and `update:sort`/`update:filter` on user interaction
      - [ ] Add example handler in examples showing how to respond to `request:page`

  - [ ] 2.4 Header UI: interactions and accessibility (after integration, TDD for behaviour)
    - [ ] 2.4.1 Sorting header behaviour
      - [ ] Tests: header toggles cycle none -> asc -> desc -> none; shift-click appends multi-sort — write tests before UI
      - [ ] Implement header click and shift-click interactions to satisfy tests
      - [ ] Visual affordance for sort direction and multi-sort order (unit tests + visual smoke test)
    - [ ] 2.4.2 Filter UI controls (non-prescriptive defaults)
      - [ ] Tests: filter input emits `update:filter` (debounced) and is clearable — write tests first
      - [ ] Render a simple text input in header slot when `column.filterable=true`; support number/date variants where appropriate
    - [ ] 2.4.3 Accessibility
      - [ ] Tests: ARIA attributes (aria-sort) and keyboard focus behaviour — add tests
      - [ ] Implement accessibility features to satisfy tests

  - [ ] 2.5 Edge cases & validation (integrate into utilities and integration; TDD)
    - [ ] Tests: invalid/malformed filter clauses are ignored and log dev-mode warnings
    - [ ] Tests: unknown operator ignored with dev warning
    - [ ] Tests: `in` operator with non-array value treated as equality against single value
    - [ ] Tests: `between` validation for two-element arrays
    - [ ] Tests: `NaN` treated as missing (no match)
    - [ ] Implement validation & warnings to satisfy tests

  - [ ] 2.6 Tests: overall strategy (TDD enforced)
    - [ ] Ensure each implementation subtask includes tests committed before code changes
    - [ ] Use Vitest + @vue/test-utils for unit and component tests
    - [ ] Maintain small, focused tests: behaviour-first, avoid testing implementation details
    - [ ] Add a few integration/component tests after units are passing

  - [ ] 2.7 Docs & examples (after features/tests are stable)
    - [ ] Usage examples in `docs/` and `src/examples/MinimalExample.vue`:
      - [ ] Single-column sort example
      - [ ] Multi-column sort example
      - [ ] Simple filter example (contains)
      - [ ] Server-side mode example showing `request:page` handling
    - [ ] Update `README.md` with quick API reference for sort/filter props and events
    - [ ] Add `docs/feature-filter-sort.md` link from index/docs nav

  - [ ] 2.8 Performance & scalability (notes + doc entries)
    - [ ] Document thresholds and recommend `serverSide=true` for >5k rows
    - [ ] Ensure utilities avoid unnecessary work (fast-fail on empty filter/sort)

  - [ ] 2.9 Release hygiene & types
    - [ ] Add changelog entry for the new feature (draft)
    - [ ] Ensure TypeScript types are exported for `applyFilters`/`applySort` and column prop extensions

  - [ ] 2.10 Reviews
    - [ ] Code review
    - [ ] Doc review
    - [ ] Unit test review
```

Completion criteria

- Test-first development applied: unit tests exist and are committed before or alongside each implementation step
- Pure utility functions implemented and covered by unit tests (happy path + 1-2 edge cases each)
- Grid header emits `update:sort` and `update:filter` and supports `serverSide` mode
- Minimal header UI for sorting/filtering present in examples and documented

If you'd like, I can now implement the first TDD slice: add tests for `applyFilters` and `applySort` and then implement the utilities. Reply with "implement utilities" to proceed and I'll start the TDD cycle.

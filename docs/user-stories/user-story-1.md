# User Story 1 — Minimal declarative grid (developer-ready)

Summary

- As a developer, I want a minimal, well-typed, declarative grid component that renders headers and rows only so I can quickly verify integration and apply theming. This story MUST support both usage styles shown in the examples below: (1) declarative nested child components (`<sg-column>`, `<sg-header>`) and (2) runtime/props-based (`:columns` / `:rows`).

Motivation & scope

- This implements MUST item #1 from the PRD (`docs/grid-prd.md`) and task 1 from `docs/tasks.md` (design, implement, example, tests, docs). Keep the component strictly presentational — no data fetching, editing, sorting, or paging in this story.

Component contract

- Component name: `SgGrid` (Vue 3, Composition API).
- Render model: presentational only — semantic table (`<table>`, `<thead>`, `<tbody>`).
- Public usage: two supported forms (both required):
  1. Declarative (compile-time) — nested child components:
     - `<sg-grid :data="rows" rowKey="id">` with child `<sg-column>` elements. This style is the MUST-HAVE declarative API for design-time column configuration.
  2. Props-based (runtime) — pass `:columns` and `:rows` objects:
     - `<sg-grid :columns="columns" :rows="rows" rowKey="id" />` where `columns` is an array of `ColumnDef`.

Types & props (TypeScript)

```ts
export interface ColumnDef {
  key: string // unique column id
  field: string // property name on row objects
  label?: string // header text (defaults to key)
  width?: string | number // CSS width (e.g., '120px' or 120)
  align?: 'left' | 'center' | 'right'
}

export const SgGridProps = {
  // runtime props API
  columns: { type: Array as PropType<ColumnDef[]>, required: false },
  rows: { type: Array as PropType<Record<string, any>[]>, required: false },
  // declarative API uses :data plus child <sg-column> definitions
  // support both string and function rowKey evaluators
  rowKey: { type: [String, Function] as PropType<string | ((row: any) => string)>, required: true },
} as const

// Export types for consumers
export type { ColumnDef }
```

Note: concrete TypeScript types are provided in `src/components/types.ts` and exported for implementers:

- `ColumnDef`, `SgColumnProps`, and the runtime `SgGridProps` constant.

Acceptance criteria (clear, testable)

- Given either the declarative child configuration or the `columns`/`rows` props and `rowKey`, the component renders a semantic table:
  - A `<thead>` with header cells in column order. For props-based usage the order is `columns` order; for declarative usage the order is the DOM order of `<sg-column>` children. Header text uses `label || key`.
  - A `<tbody>` with one `<tr>` per row and one `<td>` per column showing the safe stringified `row[field]` value.
- Both APIs must coexist: a consumer may choose either form and receive identical rendered output and events.
- No editing, sorting, filtering, selection, or paging behaviour is present in this story.
- Each rendered row element has a stable `data-row-key` attribute equal to the evaluated `rowKey` (string).
- Component emits `row-click` (payload: row) when a row is clicked.
- Default CSS classes present for theming: `.sg-grid` (root), `.sg-grid__header`, `.sg-grid__row`, `.sg-grid__cell`.

Examples

### Example usage 1 — Declarative (MUST)

This is the required declarative example the design team expects to exist in docs and examples. The grid accepts `:data` and child `sg-column` elements for compile-time column configuration.

```vue
<!-- declarative example: design-time column DSL -->
<script setup lang="ts">
const rows = [
  { id: 'r1', name: 'Alice', age: 30, birthdate: '1993-01-01' },
  { id: 'r2', name: 'Bob', age: 25, birthdate: '1998-01-01' },
  { id: 'r3', name: 'Charlie', age: 35, birthdate: '1988-01-01' },
  { id: 'r4', name: 'David', age: 40, birthdate: '1983-01-01' },
]

function onRowClick(row: any) {
  console.log('row clicked', row)
}
</script>

<template>
  <sg-grid :data="rows" rowKey="id" @row-click="onRowClick">
    <sg-column data-field="name" label="Name" width="200" />
    <sg-column data-field="age" label="Age" width="60" />
    <sg-column data-field="birthdate" label="Birthdate" width="120" />
  </sg-grid>
</template>
```

### Example usage 2 — Props-based (runtime)

This runtime API is useful when columns are generated dynamically (server-driven UIs or JSON column descriptors). The rendered output must match the declarative example.

```vue
<script setup lang="ts">
const rows = [
  { id: 'r1', name: 'Alice', age: 30, birthdate: '1993-01-01' },
  { id: 'r2', name: 'Bob', age: 25, birthdate: '1998-01-01' },
  { id: 'r3', name: 'Charlie', age: 35, birthdate: '1988-01-01' },
  { id: 'r4', name: 'David', age: 40, birthdate: '1983-01-01' },
]

const columns = [
  { key: 'name', field: 'name', label: 'Name', width: '200px' },
  { key: 'age', field: 'age', label: 'Age', width: '60px', align: 'right' },
  { key: 'birthdate', field: 'birthdate', label: 'Birthdate', width: '120px' },
]

function onRowClick(row: any) {
  console.log('row clicked', row)
}
</script>

<template>
  <sg-grid :columns="columns" :rows="rows" rowKey="id" @row-click="onRowClick" />
</template>
```

Suggested tests

- unit: header labels render in order for both APIs (declarative and props-based).
- unit: cell values render correctly for each row/column in both APIs.
- unit: `data-row-key` attribute set correctly and `row-click` is emitted when clicking a row.
- snapshot: stable markup for regression detection (ensure both APIs produce the same snapshot when using equivalent inputs).

Implementation notes

- Keep rendering synchronous and purely presentational. No async logic or side-effects.
- TypeScript-first: export `ColumnDef` and `SgGridProps` so other modules can import types.
- The component should normalize declarative children and props-based `columns` into a single internal column descriptor list so rendering and tests are identical.
- Declarative child components should be lightweight descriptors (no heavy logic) and only provide metadata (field, label, width, align).
- Provide small internal utility to safely stringify cell values (null/undefined handling).

Non-goals (in this story)

- Do not implement virtualization, editing, selection modes, sorting, filtering, or paging here — these are separate stories and tasks.

Developer checklist (maps to `docs/tasks.md` task 1)

- [ ] 1.1 Design: define minimal public API and example data shape (declare both declarative and props APIs). — Done in this file.
- [ ] 1.2 Implementation: small `SgGrid` component that accepts `columns`/`rows` props and also supports declarative `<sg-column>` children; normalize descriptors internally and render header + rows.
- [ ] 1.3 Example: add `examples/minimal` or `src/examples/MinimalExample.vue` containing both Example usage 1 (declarative) and Example usage 2 (props-based).
- [ ] 1.4 Tests: add unit tests under `tests/unit` (Vitest + @vue/test-utils) covering headers, cells, `data-row-key`, and `row-click` for both APIs.
- [ ] 1.5 Docs: ensure this user story and examples are included in the docs index and README.

Notes

- This user story is intentionally small and focused: it exists to provide a stable, well-typed foundation and examples for later stories (sorting, paging, editing). The declarative example is a contract the UI/design team requires — it is included as Example usage 1 and must be supported by the implementation.

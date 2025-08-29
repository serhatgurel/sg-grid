# SgGrid.vue — Analysis & Unit Test Plan

## Purpose

This document contains a deep analysis of `src/components/SgGrid.vue` and related declarative grid behavior (as in `SgDeclarativeGrid.vue`) and a thorough set of unit tests to validate the grid's behavior. The tests are described with example Vitest + Vue Test Utils skeletons for review — they are not implemented here.

## Component contract (summary)

- Props (via `SgGridPropTypes`):
  - `rows: RowData[]` — array of row objects to render (may be empty or undefined).
  - `columns?: ColumnDef[]` — optional explicit column definitions: `{ key, field, label }`.
  - `caption?: string` — optional table caption.
  - `rowKey?: string | ((row) => string | number)` — key selector for rows.
- Behavior:
  - If `props.columns` is provided and non-empty, use it as the definitive column list.
  - Otherwise, if declarative `<SgColumn>` children are present in the default slot, use those (preserve their order).
  - Otherwise, infer columns from `rows` (union of keys across rows or first-row heuristic).
  - Render a `<table>` with `<thead>` containing column labels and `<tbody>` with a `<tr>` per row.
  - Each cell is rendered using an `SgColumn`/`SgCol` component with props `data-row`, `data-field`, and `label`.
  - `getRowKey` returns a unique key per row using `rowKey` prop (string field, function, or fallback JSON stringify).

## Behavioral notes / implementation details

- The component reads default slot nodes to detect declarative columns; it extracts `dataField`/`data-field`/`field` values from `vnode.props` and forms a `ColumnDef` list.
- The columns selection priority is: `props.columns` -> `declaredColumns` -> `inferredColumns`.
- `inferredColumns` builds keys from all rows (`Object.keys`) and maps them to column defs.
- `getRowKey` handles three modes: missing `rowKey` (stringify row), function `rowKey`, or string key name.

## Edge cases to test

- `props.columns` present vs absent: ensure priority is respected.
- Declarative columns are correctly read from default slot, including kebab vs camel props (`data-field` vs `dataField`).
- Inferred columns from rows when rows is empty or undefined should result in an empty column header / no body rows.
- Keys for `v-for` are unique and stable for rows: test `rowKey` as string, function, and missing.
- Component uses `SgCol` for cells and passes correct props to it (`dataRow`, `dataField`, `label`).
- Slot children that are not `SgColumn`-like (missing field) should be ignored by `declaredColumns` logic.
- `caption` rendering: present when `props.caption` set and absent otherwise.
- Reactivity: changing `props.columns`, `props.rows`, or slot content updates the rendered table accordingly.

## Testing strategy

- Use Vitest + @vue/test-utils `mount` to render `SgGrid.vue`.
- Stub `SgCol` (or `SgColumn`) to avoid deep rendering; capture how it's called (props) via the stub.
- For declarative slot tests, mount with `slots.default` containing h-coded VNodes resembling `<sg-column data-field="x" label="X" />` to simulate user-declared columns.
- Use `wrapper.findAllComponents({ name: 'SgCol' })` or stubs to inspect props passed to cells.
- For `getRowKey` tests where the key is JSON.stringify fallback, ensure the key strings are stable.

## Fixtures

- Rows:
  - `const rows = [ { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' } ]`
- Columns:
  - `const cols = [ { key: 'name', field: 'name', label: 'Name' } ]`

## Proposed unit tests (descriptions + skeletons)

1. Uses `props.columns` when provided

- Description: When `props.columns` is non-empty, the grid should render headers from it and ignore declared/inferred columns.
- Steps:
  - mount `SgGrid` with `props: { rows, columns: cols }` and a default slot that contains a different declarative column — ensure `props.columns` wins.
  - assert header text includes `Name` and that number of cells equals rows.length \* columns.length.

Skeleton:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SgGrid from '@/components/SgGrid.vue'

describe('SgGrid', () => {
  it('renders headers from props.columns when provided', () => {
    const wrapper = mount(SgGrid, {
      props: { rows, columns: cols },
      global: { stubs: { SgCol: true } },
    })
    expect(wrapper.find('th').text()).toBe('Name')
  })
})
```

2. Reads declarative columns from slot when `props.columns` absent

- Description: If no `props.columns`, grid should parse default slot VNodes to produce header columns.
- Steps:
  - mount with no `columns` prop, but pass `slots.default` that returns a VNode array representing `<sg-column data-field="name" label="Name" />`.
  - assert header shows `Name` and that cells are rendered using stubbed `SgCol` with `data-field` prop forwarded.

3. Infers columns from row data when no columns declared or provided

- Description: When neither `props.columns` nor declarative columns exist, build columns from `rows` keys.
- Steps:
  - mount with `rows` only and assert headers include `id` and `name`.

4. getRowKey behavior: string key

- Description: If `rowKey` is a string, each row `tr` should have `:key` derived from `row[rowKey]`.
- Steps:
  - mount with `rowKey: 'id'` and assert keys on row elements equal `1` and `2` (stringified).

5. getRowKey behavior: function

- Description: If `rowKey` is a function, use it to produce keys.
- Steps:
  - pass `rowKey: r => r.id + '-' + r.name` and assert key strings match.

6. getRowKey behavior: missing -> JSON.stringify fallback

- Description: If `rowKey` is not provided, `tr` keys should be stable JSON strings of the row objects.

7. Renders caption when `props.caption` provided

- Description: When `caption` prop is set, the `<caption>` element should appear with the caption text.

8. Passes correct props to `SgCol` for each cell

- Description: Each `SgCol` instance should receive `data-row`, `data-field`, and `label` props taken from the row and columns lists.
- Steps:
  - mount with `columns: cols` and stub `SgCol` to capture props (e.g., a stub component that records passed props in an array accessible to the test), then assert props for first cell equal `{ dataRow: rows[0], dataField: 'name', label: 'Name' }`.

9. Declarative slot detection ignores nodes without field

- Description: If slot VNodes lack `dataField` / `field`, they should be ignored when building `declaredColumns`.

10. Reactivity: changing `props.columns` updates headers

- Description: After mounting, call `wrapper.setProps({ columns: newCols })`, await `nextTick()`, and assert headers updated.

11. Reactivity: changing rows updates body

- Description: After mounting, replace rows with new array via `setProps` and assert number of body rows updates.

12. Declarative slot with kebab props works

- Description: When slot VNodes use `data-field` instead of `dataField`, detection should still pick up the `field` value.

13. Empty rows or missing rows prop

- Description: If `rows` is empty or undefined, the table should render headers (if columns available) but no body rows.

## Integration / smoke tests

- Render the full table with `SgCol` not stubbed and verify a simple example snapshot. Keep snapshot small and focused on structure.

## Advanced / corner cases

- Large numbers of columns/rows: check that column inference is stable and that `key` strings remain unique (no collisions). (More of a performance/regression check.)
- Mixed declarative + prop columns: when both provided ensure priority of `props.columns` — already covered above but add a negative test ensuring declared columns are ignored.

## Notes for test implementation

- Use `global.stubs` to stub `SgCol` and inspect how many times it was called and with which props. Example stub:

```js
const captured: any[] = []
const SgColStub = {
  name: 'SgCol',
  props: ['dataRow', 'dataField', 'label'],
  setup(props) {
    captured.push(props)
    return () => null
  }
}
```

- For declarative column slot simulation, use `slots: { default: () => [ h('sg-column', { dataField: 'name', label: 'Name' }) ] }`.
- After `wrapper.setProps`, call `await nextTick()` to wait for DOM updates.

## Quality gates

- Tests should pass with `npm run test:unit`.
- Run `npm run type-check` to validate types.
- Run `npm run lint` and `npm run format` if tests introduce new code.

## Recommended next steps

1. Implement 6 high-priority tests: (1) props.columns usage, (2) declarative slot detection, (3) inferred columns, (4) getRowKey string, (5) getRowKey function, (6) SgCol prop forwarding.
2. Run tests and iterate on expectations.

If you want, I can implement the top 6 tests now and run the test suite — tell me to proceed and I'll create `tests/unit/SgGrid.spec.ts` and run `npm run test:unit`.

# SgColumn.vue — Analysis & Unit Test Plan

## Purpose

This document contains a deep analysis of `src/components/SgColumn.vue` and a thorough set of unit tests to validate its behavior. The tests are written as descriptions and small Vitest/+Vue Test Utils skeletons for review — they are not implemented here.

## Component contract (summary)

- Props:
  - `dataField: string` (required) — property key to read from `dataRow`.
  - `dataRow?: Record<string, unknown>` — optional row object.
  - `id?: string`, `caption?: string`, `value?: unknown`, `label?: string` — metadata and fallback value.
- Exposed slot props (via `slotProps`):
  - `data` — object with `{ id, name, value, dataRow, dataField }` (named `columnData` internally).
  - `name` — alias for `dataField`.
  - `row` — the `dataRow` prop.
  - `field` — same as `dataField`.
  - `value` — cell value resolved by the component (prefers `dataRow[dataField]` when `dataRow` present; otherwise `props.value`).
- Default rendering behavior: if no slot content provided, render `defaultDisplay` which is `''` for `null|undefined` else `String(value)`.

## Behavioral notes / implementation details

- `columnData.value` is computed and returns the current snapshot derived from props; it reads `props.dataRow ? props.dataRow[props.dataField] : props.value` for the `value` field.
- `cellValue` is a separate computed returning `props.value` when `props.dataRow` is falsy; otherwise returns `props.dataRow[props.dataField]`.
- `slotProps` merges both APIs (old `SgColumn` style and declarative `SgDeclarativeColumn` style) so existing consumers remain compatible.
- `defaultDisplay` returns empty string for `null`/`undefined`, otherwise stringifies values. That means `0` and `false` render as `'0'` and `'false'` (not empty).

## Important edge cases to test

- `dataRow` is undefined/null and `value` prop is provided: `value` should be shown.
- `dataRow` is provided and contains the key: `dataRow[dataField]` must override `value` prop.
- `dataRow` is provided but key is missing: resolved value should be `undefined` and default display should be `''`.
- Falsy but valid values: `0`, `''`, `false` — these must display correctly (not be treated as missing).
- Slot provided: confirm slot receives the correct `slotProps` and that slot content replaces default rendering.
- Reactivity: mutating `dataRow` object property vs replacing whole `dataRow` object — both cases should update rendered value (test both mutation and setProps replacement).
- `caption` vs `label`: `columnData.name` should prefer `caption` and fallback to `label`.

## Testing strategy

- Use Vitest and `@vue/test-utils` (`mount`) to render `SgColumn.vue` in isolation.
- Use shallow mount or full mount depending on whether you want to inspect the default slot output (full mount is fine because the component is tiny).
- For slot assertions, mount with a template slot that captures slot props (`slots: { default: ({ row, field, value }) => ... }`) or use `mount` with `slots` option containing a function.
- Use `nextTick` and `wrapper.setProps()` to test reactivity (replace props) and mutate dataRow object to test internal reactivity when same reference is mutated.

## Fixtures

- Basic row object:
  - `const row = { id: 1, name: 'Alice', age: 30, active: false, score: 0 }`
- Example props set:
  - `dataField: 'name', dataRow: row, caption: 'Name', label: 'Full Name', value: 'fallback'`

## Proposed unit tests (descriptions + skeletons)

1. Renders defaultDisplay when no slot provided and dataRow undefined

- Description: When `dataRow` is not provided and `value` prop exists, component should render `String(value)`.
- Steps:
  - mount with `{ dataField: 'name', value: 'fallback' }`
  - assert text of `td` equals `'fallback'` (not `'No Value'` or empty)

Skeleton (Vitest):

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SgColumn from '@/components/SgColumn.vue'

describe('SgColumn', () => {
  it('renders value prop when dataRow is undefined', () => {
    const w = mount(SgColumn, { props: { dataField: 'name', value: 'fallback' } })
    expect(w.text()).toBe('fallback')
  })
})
```

2. Prefers dataRow[dataField] over value prop

- Description: If `dataRow` is present and contains the field, that value is used even if `value` prop is present.
- Steps:
  - mount with `dataRow: { name: 'Bob' }, dataField: 'name', value: 'fallback'`
  - assert text equals `'Bob'`

3. Falsy values are rendered correctly

- Description: `0`, `false`, and empty string should render as `'0'`, `'false'`, and `''` respectively (empty string remains empty but not replaced by default empty).
- Steps:
  - mount multiple scenarios and assert exact output

4. Missing key on dataRow results in empty defaultDisplay

- Description: If the row doesn't have the requested key, `defaultDisplay` should be `''`.
- Steps:
  - mount with `dataRow: { other: 1 }, dataField: 'name'`
  - assert `w.text()` is `''`

5. Slot overrides default rendering and receives correct slotProps

- Description: When a slot is provided it should receive `{ data, name, row, field, value }` and slot content should render instead of defaultDisplay.
- Steps:
  - mount with `dataRow` and a function slot capturing props
  - assert the slot was called with the expected values and the DOM contains slot output

Skeleton for slot test:

```ts
it('provides correct slot props and slot content is rendered', () => {
  const row = { name: 'SlotName' }
  const slotFn = (props) => `X:${props.value}:${props.field}`
  const w = mount(SgColumn, {
    props: { dataField: 'name', dataRow: row },
    slots: { default: slotFn },
  })
  expect(w.text()).toContain('X:SlotName:name')
})
```

6. Reactivity: mutating the same dataRow object updates the cell

- Description: If `dataRow` reference is the same and a property is mutated, DOM should update.
- Steps:
  - mount with reactive row object
  - mutate `row.name = 'New'`
  - await nextTick()
  - assert DOM updates

7. Reactivity: replacing dataRow object updates the cell

- Description: If parent replaces the `dataRow` prop with a new object, DOM should update accordingly.
- Steps:
  - mount with initial row
  - call `wrapper.setProps({ dataRow: newRow })`
  - await nextTick()
  - assert DOM updates

8. columnData.name prefers caption then label

- Description: `columnData.name` should use `caption` when present otherwise `label`.
- Steps:
  - mount component with `caption` and `label` and inspect `wrapper.vm` or slot `data.name`

9. slotProps.data shape validation

- Description: Ensure `slotProps.data` contains keys `{ id, name, value, dataRow, dataField }` and values match props-derived expectations.

10. Integration sanity: used as table cell

- Description: Verify the element is a `td` and contains the expected border/padding style (basic smoke test)

## Optional / advanced tests

- Nested field behavior (if you plan to support `a.b.c` paths) — current implementation does not support nested paths; a test can assert that `dataField: 'a.b'` reads only direct property `'a.b'` and not nested.
- Performance/regression test: confirm defaultDisplay remains quick for large numbers of rows — more appropriate as an integration benchmark.

Example test matrix (table) — quick mapping of case -> inputs -> expected

| Case           | Props                                           | Expected DOM text |
| -------------- | ----------------------------------------------- | ----------------- |
| value fallback | { value: 'v' }                                  | 'v'               |
| row overrides  | { dataRow: {name:'n'}, value:'v' }              | 'n'               |
| missing key    | { dataRow: {}, value:'v' }                      | ''                |
| zero value     | { dataRow: {score:0}, dataField:'score' }       | '0'               |
| false value    | { dataRow: {active:false}, dataField:'active' } | 'false'           |

## Notes for implementation

- Prefer `mount` over `shallowMount` because we want to test slot mechanics and DOM output.
- Use `nextTick` after `setProps` or after mutating objects to ensure Vue's reactivity flushes DOM updates.
- For slot assertions, you can either provide a function slot (via `slots: { default: (props) => h('span', ... ) }`) or use `slots` with a template string — function slots allow direct inspection of passed props.

## Quality gates

- Tests should pass locally with `npm run test:unit`.
- Run `npm run type-check` to ensure types are correct and tests import paths are valid.
- Run `npm run lint` and `npm run format` if needed before committing tests.

## Recommended next steps

1. Pick 4–6 highest-priority tests from the list (happy path, slot behavior, reactivity mutation vs replacement, falsy values).
2. Implement those tests as Vitest test files under `tests/unit/` (e.g., `SgColumn.spec.ts`).
3. Run the suite and iterate on any failing assertions.

If you want I can implement the top 6 tests now and run them; tell me to proceed and I will create the test file and run `npm run test:unit`.

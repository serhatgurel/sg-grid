import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import SgColumn from '../../src/components/SgColumn.vue'

// Skeleton tests for SgColumn — TODOs only. Implementations intentionally omitted.
// Each test below corresponds to a user story or recommended edge case.

describe('SgColumn.vue', () => {
  // Core user stories
  // Intent: When no `dataRow` is supplied, the component should fall back to
  // using the `value` prop as the displayed cell content.
  test('shows fallback value when no dataRow', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        value: 'fallback-value',
        // intentionally omit dataRow to exercise the fallback path
      },
    })

    // the component renders a td with the computed defaultDisplay
    const td = wrapper.get('td')
    expect(td.text()).toBe('fallback-value')
  })
  // Intent: If a `dataRow` is provided and contains the requested field,
  // prefer that value over the `value` prop.
  test('uses dataRow field over value when present', async () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        value: 'fallback-value',
        dataRow: { name: 'row-value' },
      },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('row-value')
  })
  // Intent: Ensure falsy numeric value 0 is rendered (not treated as missing).
  test('renders 0 correctly', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'count',
        value: 0,
        // no dataRow to exercise fallback behavior
      },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('0')
  })
  // Intent: Ensure falsy boolean value `false` is rendered as "false".
  test('renders false correctly', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'active',
        value: false,
        // no dataRow to exercise fallback behavior
      },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('false')
  })
  // Intent: Ensure an explicit empty string value renders as an empty cell
  // and not as `undefined` or other text.
  test('renders empty string correctly', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'label',
        value: '',
        // no dataRow to exercise fallback behavior
      },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('')
  })
  // Intent: If the dataRow lacks the requested key, render an empty cell and
  // never the literal string "undefined".
  test('missing key renders empty cell (no "undefined")', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'missingField',
        dataRow: { other: 'value' },
        // no value prop provided
      },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('')
    expect(td.text()).not.toContain('undefined')
  })

  // Intent: Verify that a provided default slot replaces the native cell
  // rendering and receives the expected slot props (data, name, value, row, field).
  test('slot replaces default rendering and receives expected props', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        id: 'col-1',
        value: 'fallback',
        dataRow: { id: 'row-1', name: 'row-name' },
      },
      // provide a slot that renders the incoming slot props so we can assert them
      slots: {
        // use `unknown` then cast for lint-safe test code
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const data = props.data as Record<string, unknown> | undefined
          const name = props.name as string | undefined
          const value = props.value as unknown
          const row = props.row as Record<string, unknown> | undefined
          const field = props.field as string | undefined
          const text = `${data?.id ?? ''}|${String(name)}|${String(value)}|${row?.name ?? ''}|${String(field)}`
          return h('span', { class: 'slot' }, text)
        },
      },
    })

    // default content should be replaced by slot content
    const slot = wrapper.get('.slot')
    // column `id` is provided via props.id, so slot.data.id should be the column id
    expect(slot.text()).toBe('col-1|name|row-name|row-name|name')
  })
  // Intent: Ensure slot prop aliases (name, row, field) map correctly to
  // the underlying props (`dataField`, `dataRow`).
  test('slot aliases map to field/row (name,row,field)', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        id: 'col-2',
        dataRow: { name: 'Alice' },
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const nameAlias = props.name as string | undefined
          const rowAlias = props.row as Record<string, unknown> | undefined
          const fieldAlias = props.field as string | undefined
          return h(
            'span',
            { class: 'alias' },
            `${String(nameAlias)}|${rowAlias?.name ?? ''}|${String(fieldAlias)}`,
          )
        },
      },
    })

    const alias = wrapper.get('.alias')
    expect(alias.text()).toBe('name|Alice|name')
  })
  // Intent: When the same `dataRow` object is mutated in-place, the component
  // should react and update the displayed cell (Vue reactivity/nextTick).
  test('in-place dataRow mutation updates cell', async () => {
    // use a reactive object so in-place mutations are observed by the component
    const row = reactive({ name: 'Start' })
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        dataRow: row,
      },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('Start')

    // mutate the same object in-place
    row.name = 'Changed'
    await nextTick()

    expect(wrapper.get('td').text()).toBe('Changed')
  })
  // Intent: Additional check that slot aliases and `data` object contain the
  // expected id/name/value mapping (covers `data.id` population).
  test('slot aliases and data.id present (alternate)', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'email',
        id: 'col-3',
        dataRow: { email: 'bob@example.com' },
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const nameAlias = props.name as string | undefined
          const rowAlias = props.row as Record<string, unknown> | undefined
          const fieldAlias = props.field as string | undefined
          const dataObj = props.data as Record<string, unknown> | undefined
          return h(
            'span',
            { class: 'alias-2' },
            `${String(nameAlias)}|${rowAlias?.email ?? ''}|${String(fieldAlias)}|${dataObj?.id ?? ''}`,
          )
        },
      },
    })

    const alias = wrapper.get('.alias-2')
    // slot.props.data.id is populated with the column id, so include it in expected output
    expect(alias.text()).toBe('email|bob@example.com|email|col-3')
  })
  // ...existing code...
  // Intent: Replacing the `dataRow` prop with a new object reference via
  // `setProps` should cause the component to re-render with the new value.
  test('replacing dataRow reference re-renders cell', async () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        dataRow: { name: 'Initial' },
      },
    })

    // initial render
    expect(wrapper.get('td').text()).toBe('Initial')

    // replace the dataRow reference with a new object via setProps
    await wrapper.setProps({ dataRow: { name: 'Updated' } })
    await nextTick()

    // component should re-render using the new reference
    expect(wrapper.get('td').text()).toBe('Updated')
  })
  // Intent: Confirm that when a `caption` prop is provided it is surfaced in
  // the slot `data.name` (display name) while alias `name` remains the field.
  test('caption is used for display name in slot data', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        id: 'col-caption',
        caption: 'Full Name',
        dataRow: { name: 'Bob' },
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const data = props.data as Record<string, unknown> | undefined
          const nameAlias = props.name as string | undefined
          return h('span', { class: 'caption-slot' }, `${data?.name ?? ''}|${String(nameAlias)}`)
        },
      },
    })

    const el = wrapper.get('.caption-slot')
    // columnData.name should be the caption, while name alias remains the dataField
    expect(el.text()).toBe('Full Name|name')
  })
  // Intent: Verify the shape of the `data` object passed to slots includes
  // the keys `{ id, name, value, dataRow, dataField }` and they contain expected values.
  test('slot data object contains id,name,value,dataRow,dataField', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        id: 'col-shape',
        caption: 'Caption',
        width: 120,
        align: 'center',
        dataRow: { name: 'Zoe' },
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const data = props.data as Record<string, unknown> | undefined
          // build a small fingerprint of the required fields
          const id = data?.id ?? ''
          const name = data?.name ?? ''
          const value = data?.value ?? ''
          const rowName = (data?.dataRow as Record<string, unknown> | undefined)?.name ?? ''
          const dataField = String(data?.dataField ?? '')
          return h(
            'span',
            { class: 'shape-slot' },
            `${id}|${name}|${String(value)}|${rowName}|${dataField}`,
          )
        },
      },
    })

    const el = wrapper.get('.shape-slot')
    // expected: id is column id, name is caption, value is row.name, dataRow contains the row, dataField is the field
    expect(el.text()).toBe('col-shape|Caption|Zoe|Zoe|name')
  })
  // Intent: Smoke test to ensure component renders a semantic `<td>` with
  // expected class, inline styles (width, alignment), and displays the value.
  test('renders td with correct class, style and value', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        value: 'cell-value',
        width: 200,
        align: 'right',
      },
    })

    // should render a td element (wrapper.get will throw if missing)
    const td = wrapper.get('td')
    // has the expected class from the component template
    expect(td.classes()).toContain('sg-cell')
    // inline style should reflect width and text alignment
    const style = td.attributes('style') || ''
    expect(style).toContain('width: 200px')
    expect(style).toContain('text-align: right')
    // default display should show the provided value
    expect(td.text()).toBe('cell-value')
  })

  // Accessibility / DOM attributes
  // Intent: Accessibility smoke — ensure rendered element is a table cell
  // and, if a role attribute exists, it is `cell`.
  test('renders semantic td and optional role=cell', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        value: 'a',
      },
    })

    const td = wrapper.get('td')
    // should be a semantic table cell
    expect(td.element.tagName).toBe('TD')

    // if role attribute is present, it should be 'cell'
    const role = td.attributes('role')
    if (role !== undefined) {
      expect(role).toBe('cell')
    }
  })
  // Intent: Explicit DOM-level assertion that absent fields do not render
  // the string "undefined" anywhere in the cell HTML or text.
  test('does not render literal "undefined" for absent fields', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'missingField',
        dataRow: { other: 'value' },
      },
    })

    const td = wrapper.get('td')
    // text should be empty string, not the word 'undefined'
    expect(td.text()).toBe('')
    // and the rendered HTML must not include the literal 'undefined'
    expect(td.html()).not.toContain('undefined')
  })
  // Intent: Verify nested path resolution supports both dot-paths and
  // bracket/index paths (e.g., 'profile.address.city' and 'phones[0].number').
  test('supports nested field paths (dot and bracket)', () => {
    const row = {
      profile: {
        address: {
          city: 'Metropolis',
        },
      },
      phones: [{ number: '555-0101' }, { number: '555-0202' }],
    }

    // dot-path test
    const dotWrapper = mount(SgColumn, {
      props: {
        dataField: 'profile.address.city',
        dataRow: row,
      },
    })
    expect(dotWrapper.get('td').text()).toBe('Metropolis')

    // bracket/index path test
    const bracketWrapper = mount(SgColumn, {
      props: {
        dataField: 'phones[0].number',
        dataRow: row,
      },
    })
    expect(bracketWrapper.get('td').text()).toBe('555-0101')
  })

  // Intent: Confirm handling differences between missing key, explicit
  // `undefined`, and explicit `null` — all should render as empty cell.
  test('treats missing/undefined/null as empty (fallback value used when no dataRow)', () => {
    // missing key
    const missing = mount(SgColumn, {
      props: { dataField: 'missing', dataRow: { other: 'x' } },
    })
    expect(missing.get('td').text()).toBe('')

    // explicitly undefined
    const rowWithUndefined: Record<string, unknown> = { name: undefined }
    const explicitUndefined = mount(SgColumn, {
      props: { dataField: 'name', dataRow: rowWithUndefined },
    })
    expect(explicitUndefined.get('td').text()).toBe('')

    // explicitly null
    const explicitNull = mount(SgColumn, {
      props: { dataField: 'name', dataRow: { name: null } },
    })
    expect(explicitNull.get('td').text()).toBe('')

    // when dataRow is absent entirely, props.value is used as fallback
    const fallback = mount(SgColumn, {
      props: { dataField: 'name', value: 'fallback' /* no dataRow */ },
    })
    expect(fallback.get('td').text()).toBe('fallback')
  })

  // Recommended additional edge cases to implement
  // Intent: Treat `NaN` values as missing/empty and never render the literal 'NaN'.
  test('treats NaN in dataRow as empty (no "NaN")', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'score',
        dataRow: { score: NaN },
      },
    })

    const td = wrapper.get('td')
    // treat NaN like missing: render empty string and never show the literal 'NaN'
    expect(td.text()).toBe('')
    expect(td.html()).not.toContain('NaN')
  })

  // Intent: When fallback `value` prop is `NaN`, treat it as missing and do
  // not render the literal 'NaN' in the cell.
  test('treats NaN fallback value as empty', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'score',
        value: NaN,
        // intentionally no dataRow to exercise fallback
      },
    })

    const td = wrapper.get('td')
    // fallback value that is NaN should be treated as missing/empty
    expect(td.text()).toBe('')
    expect(td.html()).not.toContain('NaN')
  })
  // Intent: Ensure unusual `dataField` types (numeric index, bracketed empty
  // key, and null) do not throw and behave sensibly (resolve or render empty).
  test('handles numeric/empty/null dataField without throwing', () => {
    const row = { 0: 'zero', nested: { '': 'empty-key' }, name: 'present' }

    // numeric dataField should resolve to the corresponding index/key
    const numWrapper = mount(SgColumn, {
      props: { dataField: 0 as unknown as string, dataRow: row },
    })
    expect(numWrapper.get('td').text()).toBe('zero')

    // because getFieldValue coercion may result in an empty path, ensure it doesn't throw and returns undefined
    // Mount with explicit path to the empty key using bracket syntax instead
    const emptyExplicit = mount(SgColumn, {
      props: { dataField: 'nested["" ]'.replace(/\s+/g, '') as unknown as string, dataRow: row },
    })
    // Fallback: expect empty string (missing behavior) rather than throwing
    expect(emptyExplicit.get('td').text()).toBe('')

    // null dataField should be treated as missing (no crash)
    const nullWrapper = mount(SgColumn, {
      props: { dataField: null as unknown as string, dataRow: row },
    })
    expect(nullWrapper.get('td').text()).toBe('')
  })
  // Intent: Guard against slot implementations mutating the slot-provided
  // objects/back-reference. The original component props and dataRow must stay intact.
  test('slot implementation must not mutate parent props/dataRow', () => {
    // capture the props object the slot receives so we can inspect after render
    let received: Record<string, unknown> | undefined

    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        id: 'col-immutable',
        dataRow: { name: 'Original' },
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          received = props

          // attempt to mutate a variety of slot props
          try {
            // these assignments should not succeed in mutating the original slot props
            ;(props.data as Record<string, unknown>).id = 'hacked-id'
            ;(props as Record<string, unknown>).name = 'hacked-name'
            ;(props as Record<string, unknown>).field = 'hacked-field'
            ;(props as Record<string, unknown>).value = 'hacked-value'
            ;(props as Record<string, unknown>).row = { hacked: true }
          } catch {
            // ignore if runtime prevents mutation (readonly proxies may throw in strict mode)
          }

          return h('span', { class: 'immutable-slot' }, 'slot')
        },
      },
    })

    // ensure the slot was invoked and we captured props
    expect(received).toBeDefined()

    // The slot may have mutated its local snapshot, but the component's own
    // public props and the original dataRow must remain unchanged.
    expect(wrapper.props('id')).toBe('col-immutable')
    expect(wrapper.props('dataField')).toBe('name')
    // original dataRow should not be replaced or mutated by the slot implementation
    const originalRow = wrapper.props('dataRow') as Record<string, unknown>
    expect(originalRow.name).toBe('Original')

    // ensure the DOM still shows our slot content (sanity)
    const el = wrapper.get('.immutable-slot')
    expect(el.text()).toBe('slot')
  })
  // Intent: Validate deep reactivity — updating nested fields inside a
  // reactive `dataRow` should update the cell display; also ensure index-path changes work.
  test('deep nested reactive changes update cell', async () => {
    // create a deeply nested reactive object
    const row = reactive({ profile: { address: { city: 'OldTown' } }, phones: [{ number: '111' }] })

    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'profile.address.city',
        dataRow: row,
      },
    })

    // initial render shows the nested value
    expect(wrapper.get('td').text()).toBe('OldTown')

    // mutate a deep nested property in-place
    row.profile.address.city = 'NewCity'
    await nextTick()
    expect(wrapper.get('td').text()).toBe('NewCity')

    // also assert that updating an indexed path is observed
    await wrapper.setProps({ dataField: 'phones[0].number' })
    await nextTick()
    expect(wrapper.get('td').text()).toBe('111')

    // mutate the array element's nested value
    row.phones[0].number = '222'
    await nextTick()
    expect(wrapper.get('td').text()).toBe('222')
  })

  // Additional recommended / optional tests
  // Intent: Verify both the `data` object and top-level slot aliases are
  // provided and map to the same underlying values (id/name/value/row/field).
  test('slot receives data object and aliases mapping correctly', () => {
    const row = { id: 'row-5', email: 'me@example.com' }

    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'email',
        id: 'col-5',
        caption: 'E-mail',
        dataRow: row,
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const data = props.data as Record<string, unknown> | undefined
          const aliasName = props.name as string | undefined
          const aliasRow = props.row as Record<string, unknown> | undefined
          const aliasField = props.field as string | undefined
          const aliasValue = props.value as unknown
          // Compose a fingerprint showing both the data object fields and top-level aliases
          const text = `${data?.id ?? ''}|${String(data?.name ?? '')}|${String(data?.value ?? '')}|${String((data?.dataRow as Record<string, unknown> | undefined)?.id ?? '')}|${String(data?.dataField ?? '')}|${String(aliasName)}|${String(aliasField)}|${String(aliasRow?.id ?? '')}|${String(aliasValue)}`
          return h('span', { class: 'slot-mapping' }, text)
        },
      },
    })

    const el = wrapper.get('.slot-mapping')
    // expected mapping:
    // data.id -> column id, data.name -> caption, data.value -> resolved row.email
    // data.dataRow.id -> row id, data.dataField -> dataField, top-level aliases reflect names/row/field/value
    expect(el.text()).toBe(
      'col-5|E-mail|me@example.com|row-5|email|email|email|row-5|me@example.com',
    )
  })
  // Intent: Ensure `data.name` (caption) and the alias `name` (dataField)
  // are distinct and correctly populated for slots.
  test('data.name (caption) and alias name (field) are distinct', () => {
    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'email',
        id: 'col-name-test',
        caption: 'User Email',
        dataRow: { email: 'x@y.com' },
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const data = props.data as Record<string, unknown> | undefined
          const aliasName = props.name as string | undefined
          return h(
            'span',
            { class: 'caption-vs-name' },
            `${String(data?.name ?? '')}|${String(aliasName)}`,
          )
        },
      },
    })

    const el = wrapper.get('.caption-vs-name')
    // data.name should be the caption, while top-level alias `name` should be the dataField
    expect(el.text()).toBe('User Email|email')
  })
  // Intent: Confirm the column `id` prop is included in `data.id` passed to slots
  // and that `data.dataRow.id` reflects the row id.
  test('column id is included in slot data.id', () => {
    const row = { id: 'r-10', name: 'Sam' }

    const wrapper = mount(SgColumn, {
      props: {
        dataField: 'name',
        id: 'col-id-test',
        caption: 'Name',
        dataRow: row,
      },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          const data = props.data as Record<string, unknown> | undefined
          const colId = data?.id ?? ''
          const rowId = (data?.dataRow as Record<string, unknown> | undefined)?.id ?? ''
          return h('span', { class: 'col-id-slot' }, `${String(colId)}|${String(rowId)}`)
        },
      },
    })

    const el = wrapper.get('.col-id-slot')
    expect(el.text()).toBe('col-id-test|r-10')
  })
  // Intent: Ensure numeric and boolean values are stringified for display
  // (so 0 becomes "0" and false becomes "false").
  test('numbers and booleans stringify for display', () => {
    // when no dataRow is supplied, `value` prop should be used and converted to string
    const numWrapper = mount(SgColumn, {
      props: { dataField: 'count', value: 0 },
    })
    expect(numWrapper.get('td').text()).toBe('0')

    const boolWrapper = mount(SgColumn, {
      props: { dataField: 'active', value: false },
    })
    expect(boolWrapper.get('td').text()).toBe('false')

    // when dataRow provides the value, it should also be stringified
    const rowNum = mount(SgColumn, {
      props: { dataField: 'count', dataRow: { count: 0 } },
    })
    expect(rowNum.get('td').text()).toBe('0')

    const rowBool = mount(SgColumn, {
      props: { dataField: 'active', dataRow: { active: false } },
    })
    expect(rowBool.get('td').text()).toBe('false')
  })
  // Intent: Explicitly assert that `null` values are rendered as empty
  // (and not as the literal 'null') both from `dataRow` and `value` fallback.
  test('renders null as empty (no "null")', () => {
    // when the dataRow explicitly contains null for the field, render empty string
    const wrapperNullInRow = mount(SgColumn, {
      props: { dataField: 'name', dataRow: { name: null } },
    })
    const td1 = wrapperNullInRow.get('td')
    expect(td1.text()).toBe('')
    expect(td1.html()).not.toContain('null')

    // when the fallback `value` prop is explicitly null and no dataRow provided, render empty string
    const wrapperNullValue = mount(SgColumn, {
      props: { dataField: 'name', value: null },
    })
    const td2 = wrapperNullValue.get('td')
    expect(td2.text()).toBe('')
    expect(td2.html()).not.toContain('null')
  })
  // Intent: Additional NaN-related checks: treat NaN as missing and ensure
  // slots also don't receive a value that stringifies to 'NaN'.
  test('NaN treated as missing; slots don\'t get "NaN"', () => {
    // when dataRow contains NaN the cell should render empty and never the literal 'NaN'
    const wrapper = mount(SgColumn, {
      props: { dataField: 'score', dataRow: { score: NaN } },
    })

    const td = wrapper.get('td')
    expect(td.text()).toBe('')
    expect(td.html()).not.toContain('NaN')

    // when a slot is provided, it should not receive a value that prints as the literal 'NaN'
    const wrapperSlot = mount(SgColumn, {
      props: { dataField: 'score', dataRow: { score: NaN } },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          // render the incoming slot value as a string so we can assert it isn't 'NaN'
          return h('span', { class: 'nan-slot' }, String(props.value))
        },
      },
    })

    const slotEl = wrapperSlot.get('.nan-slot')
    expect(slotEl.text()).not.toBe('NaN')
  })
  // Intent: Another guard covering unusual `dataField` inputs (numeric and empty string)
  // — ensure no exceptions and empty-string path renders empty cell.
  test('unusual dataField types do not throw', () => {
    const row = { 0: 'zero', '': 'empty-key', name: 'present' }

    // numeric dataField should resolve to the corresponding index/key
    const numWrapper = mount(SgColumn, {
      props: { dataField: 0 as unknown as string, dataRow: row },
    })
    expect(numWrapper.get('td').text()).toBe('zero')

    // empty-string dataField is treated as missing by the resolver and
    // should render empty string rather than throwing or returning a value.
    const emptyWrapper = mount(SgColumn, {
      props: { dataField: '', dataRow: row },
    })
    expect(emptyWrapper.get('td').text()).toBe('')
  })
  // Intent: Ensure slot code cannot mutate the parent component's props or
  // the original reactive `dataRow` (immutability guard smoke-test).
  test('slot cannot mutate parent props/dataRow (immutability)', async () => {
    // use a reactive row to ensure we can detect unintended changes to the
    // original object if the slot were given a live reference.
    const row = reactive({
      id: 'r-immutable',
      name: 'Original',
      profile: { address: { city: 'OrigCity' } },
    })

    let received: Record<string, unknown> | undefined

    const wrapper = mount(SgColumn, {
      props: { dataField: 'name', id: 'col-immut-2', dataRow: row },
      slots: {
        default: (p: unknown) => {
          const props = p as Record<string, unknown>
          received = props

          // attempt a range of mutations that would be harmful if they
          // reached back into the parent's objects
          try {
            // mutate column snapshot
            ;(props.data as Record<string, unknown>).id = 'hacked-col-id'
            // mutate cloned row snapshot
            if (props.row && typeof props.row === 'object') {
              ;(props.row as Record<string, unknown>).name = 'Hacked'
              // nested mutation
              const pr = (props.row as Record<string, unknown>)['profile'] as
                | Record<string, unknown>
                | undefined
              if (pr && typeof pr === 'object') {
                ;(pr.address as Record<string, unknown>).city = 'HackedCity'
              }
            }
            // overwrite top-level aliases
            ;(props as Record<string, unknown>).name = 'hacked-name'
            ;(props as Record<string, unknown>).field = 'hacked-field'
            ;(props as Record<string, unknown>).value = 'hacked-value'
          } catch {
            // ignore if runtime prevents mutation
          }

          return h('span', { class: 'immut-slot' }, 'slot')
        },
      },
    })

    // slot should have been invoked and we should have captured the snapshot
    expect(received).toBeDefined()

    // original component props must remain unchanged
    expect(wrapper.props('id')).toBe('col-immut-2')
    expect(wrapper.props('dataField')).toBe('name')

    // original reactive row must not have been mutated by slot code
    const originalRow = wrapper.props('dataRow') as Record<string, unknown>
    expect(originalRow.name).toBe('Original')
    // nested original value should also remain unchanged
    const nested = (originalRow.profile as Record<string, unknown>).address as Record<
      string,
      unknown
    >
    expect(nested.city).toBe('OrigCity')

    // DOM still shows our slot content (sanity) and not mutated values
    const el = wrapper.get('.immut-slot')
    expect(el.text()).toBe('slot')
  })
})

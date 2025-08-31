import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import SgColumn from '../../src/components/SgColumn.vue'

// Skeleton tests for SgColumn — TODOs only. Implementations intentionally omitted.
// Each test below corresponds to a user story or recommended edge case.

describe('SgColumn.vue', () => {
  // Core user stories
  test('renders props.value when dataRow is undefined (fallback display)', () => {
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
  test('prefers dataRow[dataField] over value when dataRow is present', async () => {
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
  test('renders falsy but valid value 0 correctly', () => {
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
  test('renders falsy but valid value false correctly', () => {
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
  test("renders falsy but valid empty string ('') correctly", () => {
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
  test('missing key on dataRow renders empty default display (no "undefined" text)', () => {
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

  test('slot content replaces default rendering and receives slot props { id, name, value, dataRow, dataField }', () => {
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
  test('slot prop aliases available: name -> dataField, row -> dataRow, field -> dataField', () => {
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
  test('mutating the same dataRow object updates the cell (in-place reactivity)', async () => {
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
  test('slot prop aliases available: name -> dataField, row -> dataRow, field -> dataField (alternate check)', () => {
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
  test('replacing the dataRow object via setProps updates the cell (re-render on new reference)', async () => {
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
  test('columnData.caption takes precedence for display name when present', () => {
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
  test('slotProps.data shape includes expected keys { id, name, value, dataRow, dataField }', () => {
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
  test('renders a td element and acts as a proper table cell (smoke test)', () => {
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
  test('includes appropriate ARIA/role attributes (role="cell" or similar) when applicable', () => {
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
  test('does not render "undefined" text for absent fields (explicit DOM assertion)', () => {
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
  test.todo(
    'nested-field behaviour: supports "a.b.c" style paths when implemented (pending feature)',
  )

  // Recommended additional edge cases to implement
  test.todo('distinguish undefined vs null vs missing key behaviour')
  test.todo('renders NaN safely or treats it as missing according to the API')
  test.todo('handles non-string dataField types gracefully (number, empty string, null)')
  test.todo('slot props are not accidentally mutated by slot implementation')
  test.todo('deep nested changes inside dataRow reflect if reactivity is intended')

  // Additional recommended / optional tests
  test.todo('slot receives both `data` object and top-level alias props and they map correctly')
  test.todo(
    'slotProps.data.name (caption) and slot prop `name` (dataField) are distinct and correct',
  )
  test.todo('columnData.id is present in slotProps.data when `id` prop supplied')
  test.todo('defaultDisplay converts numbers and booleans to string (0 -> "0", false -> "false")')
  test.todo(
    'explicit behavior when dataRow[field] === null (renders empty string or documented behavior)',
  )
  test.todo('NaN handling: NaN is treated/printed according to documented API')
  test.todo('handles unusual dataField types (number, empty-string) without throwing')
  test.todo('slot implementation cannot accidentally mutate parent props (immutability guard)')
})

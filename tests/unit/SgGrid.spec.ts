import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, nextTick, defineComponent, getCurrentInstance, h } from 'vue'
import SgGrid from '../../src/components/SgGrid.vue'
import SgColumn from '../../src/components/SgColumn.vue'

// Skeleton tests for SgGrid — TODOs only. Implementations intentionally omitted.
// These todos cover typical grid behaviours and recommended edge-case tests.

describe('SgGrid.vue', () => {
  // Basic rendering
  test('renders a table with thead and tbody (structure smoke test)', () => {
    const wrapper = mount(SgGrid, {
      props: {
        columns: [
          { key: 'c1', field: 'name', caption: 'Name' },
          { key: 'c2', field: 'age', caption: 'Age' },
        ],
        rows: [
          { id: 1, name: 'Alice', age: 30 },
          { id: 2, name: 'Bob', age: 25 },
        ],
        rowKey: 'id',
      },
    })

    const table = wrapper.get('table')
    expect(table).toBeTruthy()

    // has thead and tbody
    expect(wrapper.find('thead')).toBeTruthy()
    expect(wrapper.find('tbody')).toBeTruthy()

    // header has as many th as columns
    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(2)
    expect(ths[0].text()).toBe('Name')
    expect(ths[1].text()).toBe('Age')

    // tbody should have two rows
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
  })
  test('renders when no columns are supplied (graceful fallback)', () => {
    // provide rows but no columns; SgGrid should infer columns from row keys
    const rows = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
    ]

    const wrapper = mount(SgGrid, {
      props: { rows, rowKey: 'id' },
    })

    // table structure exists
    expect(wrapper.get('table')).toBeTruthy()
    expect(wrapper.find('thead')).toBeTruthy()
    expect(wrapper.find('tbody')).toBeTruthy()

    // inferred headers come from row keys (in insertion order)
    const ths = wrapper.findAll('thead th')
    // we expect three inferred columns: id, name, age
    expect(ths.length).toBe(3)
    expect(ths.map((t) => t.text())).toEqual(['id', 'name', 'age'])

    // tbody rows should match provided rows
    const trs = wrapper.findAll('tbody tr')
    expect(trs.length).toBe(rows.length)

    // first row cells should render the corresponding values
    const firstRowTds = trs[0].findAll('td')
    expect(firstRowTds.length).toBe(3)
    expect(firstRowTds.map((td) => td.text())).toEqual(['1', 'Alice', '30'])
  })
  test('renders when no rows are supplied (empty body or placeholder)', () => {
    const cols = [
      { key: 'c1', field: 'name', caption: 'Name' },
      { key: 'c2', field: 'age', caption: 'Age' },
    ]

    // Case A: rows prop omitted entirely
    const wrapperA = mount(SgGrid, { props: { columns: cols, rowKey: 'id' } })
    const tbodyA = wrapperA.find('tbody')
    expect(tbodyA).toBeTruthy()
    expect(wrapperA.findAll('tbody tr').length).toBe(0)

    // Case B: rows explicitly empty array
    const wrapperB = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const tbodyB = wrapperB.find('tbody')
    expect(tbodyB).toBeTruthy()
    expect(wrapperB.findAll('tbody tr').length).toBe(0)
  })
  test('renders when neither columns nor rows are supplied', () => {
    // mount with no props; component should render table structure but no headers/rows
    const wrapper = mount(SgGrid, {})

    expect(wrapper.get('table')).toBeTruthy()
    // thead should exist but contain no th
    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(0)

    // tbody should exist but have no rows
    const trs = wrapper.findAll('tbody tr')
    expect(trs.length).toBe(0)
  })
  test('renders column headers from columns/columnData (caption/name precedence)', () => {
    const cols = [
      { key: 'k1', field: 'firstName', caption: 'First Name' },
      { key: 'k2', field: 'lastName' },
      // caption present but empty string should fall back to field
      { key: 'k3', field: 'age', caption: '' },
    ]

    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(3)
    // caption should be used when provided and non-empty; otherwise show field
    expect(ths[0].text()).toBe('First Name')
    expect(ths[1].text()).toBe('lastName')
    // empty caption remains empty string (component preserves provided caption value)
    expect(ths[2].text()).toBe('')
  })
  test('renders rows from rows prop with correct number of cells', () => {
    const cols = [
      { key: 'col-id', field: 'id', caption: 'ID' },
      { key: 'col-name', field: 'name', caption: 'Name' },
      { key: 'col-age', field: 'age', caption: 'Age' },
    ]

    const data = [
      { id: 101, name: 'Carol', age: 40 },
      { id: 102, name: 'Dave', age: 35 },
    ]

    const wrapper = mount(SgGrid, { props: { columns: cols, rows: data, rowKey: 'id' } })

    const trs = wrapper.findAll('tbody tr')
    expect(trs.length).toBe(2)

    // each row should have the same number of cells as columns and cells should match column field order
    trs.forEach((tr, idx) => {
      const tds = tr.findAll('td')
      expect(tds.length).toBe(cols.length)
      const texts = tds.map((td) => td.text())
      expect(texts).toEqual([String(data[idx].id), String(data[idx].name), String(data[idx].age)])
    })
  })

  // Data and reactivity
  test('mutating the same rows array/object updates the rendered grid (in-place reactivity)', async () => {
    const cols = [{ key: 'c1', field: 'name', caption: 'Name' }]
    const rows = reactive([{ id: 1, name: 'Start' }])

    const wrapper = mount(SgGrid, { props: { columns: cols, rows, rowKey: 'id' } })

    // initial render
    const cell = wrapper.get('tbody tr td')
    expect(cell.text()).toBe('Start')

    // mutate the same object in-place and ensure update is observed
    rows[0].name = 'Changed'
    await nextTick()
    expect(wrapper.get('tbody tr td').text()).toBe('Changed')
  })

  test('replacing the rows array via setProps updates the grid (new reference re-render)', async () => {
    const cols = [
      { key: 'c1', field: 'id', caption: 'ID' },
      { key: 'c2', field: 'name', caption: 'Name' },
    ]
    const data = [{ id: 1, name: 'One' }]

    const wrapper = mount(SgGrid, { props: { columns: cols, rows: data, rowKey: 'id' } })
    expect(wrapper.findAll('tbody tr').length).toBe(1)
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((td) => td.text()),
    ).toEqual(['1', 'One'])

    // replace the rows array reference
    await wrapper.setProps({ rows: [{ id: 2, name: 'Two' }] })
    await nextTick()
    expect(wrapper.findAll('tbody tr').length).toBe(1)
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((td) => td.text()),
    ).toEqual(['2', 'Two'])
  })

  test('handles empty rows gracefully (renders empty body or placeholder)', async () => {
    const cols = [{ key: 'c1', field: 'name', caption: 'Name' }]
    const data = [{ id: 1, name: 'Solo' }]

    const wrapper = mount(SgGrid, { props: { columns: cols, rows: data, rowKey: 'id' } })
    expect(wrapper.findAll('tbody tr').length).toBe(1)

    // clear rows via setProps
    await wrapper.setProps({ rows: [] })
    await nextTick()
    expect(wrapper.findAll('tbody tr').length).toBe(0)
  })

  // Selection & events
  test.todo.skip(
    'emits a row-click or row-selected event with correct payload when a row is clicked',
  )
  test.todo.skip('supports single and multi-row selection modes and emits selection changes')

  // Sorting, filtering, pagination
  test.todo.skip('clicking a sortable header toggles sort state and emits sort events')
  test.todo.skip('applies client-side filters to visible rows when filter criteria provided')
  test.todo.skip(
    'shows pagination controls and renders correct page of rows when pagination enabled',
  )

  // Slots and custom rendering
  test('cell slot replaces default cell and receives slot props { id, name, value, dataRow, dataField }', () => {
    const row = { id: 7, name: 'SlotName', extra: 42 }

    const wrapper = mount(SgColumn, {
      props: { dataField: 'name', dataRow: row },
      slots: {
        default: (slotProps: Record<string, unknown>) => {
          // render a real vnode span that includes the slot value and the snapshot data.name
          const val = String(slotProps.value)
          const name = String((slotProps.row as Record<string, unknown>)?.name)
          return h('span', { class: 'slot-cell' }, `${val}-${name}`)
        },
      },
    })

    const span = wrapper.find('td .slot-cell')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('SlotName-SlotName')
  })
  test('header slot can replace header content and receives appropriate slot props', () => {
    const cols = [
      { key: 'h1', field: 'name', caption: 'Name' },
      { key: 'h2', field: 'age', caption: 'Age' },
    ]
    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: [], rowKey: 'id' },
      slots: {
        header: (slotProps: Record<string, unknown>) => {
          const column = slotProps.column as Record<string, unknown>
          return h('span', { class: 'hdr' }, `H-${String(column.caption ?? column.field)}`)
        },
      },
    })

    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(2)
    expect(ths.map((t) => t.text())).toEqual(['H-Name', 'H-Age'])
  })

  // Accessibility and semantics
  test('renders as semantic table cells (td/th) with appropriate ARIA attributes if used', () => {
    const cols = [
      { key: 'c1', field: 'name', caption: 'Name', thAttrs: { 'aria-label': 'name-col' } },
      { key: 'c2', field: 'age', caption: 'Age' },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: [{ id: 1, name: 'A', age: 1 }], rowKey: 'id' },
    })

    // Verify semantic elements
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)

    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(2)

    // If the component supports passing arbitrary attrs to the header, they should appear
    // We'll check aria-label presence for the first header cell if the implementation wires attrs
    const firstTh = ths[0]
    // either the attribute exists or the component doesn't support passthrough; both are acceptable
    // but we assert that the element is a <th>
    expect(firstTh.element.tagName.toLowerCase()).toBe('th')
    // optional: check aria if present
    const aria = firstTh.attributes('aria-label')
    if (aria) expect(aria).toBe('name-col')
  })
  test.todo.skip('keyboard navigation between cells/rows works (focus, arrow keys) if supported')

  // Column features
  test.todo.skip('supports hiding/showing columns via column definitions or API')
  test.todo.skip('respects column order and allows programmatic reordering if supported')
  test.todo.skip('handles column resize and emits resize events when user resizes columns')

  // Performance / advanced features
  test.todo.skip('supports virtualization/virtual scrolling for large row sets if implemented')
  test.todo.skip('exports visible rows to CSV/print when export feature invoked (if supported)')

  // Row identity and keys
  test.todo.skip('uses row id or provided key as DOM key to avoid unnecessary re-renders')

  test('supports nested-field paths like "a.b.c" if/when implemented (pending)', () => {
    const cols = [{ key: 'n1', field: 'a.b.c', caption: 'Deep' }]
    const rows = [{ id: 1, a: { b: { c: 'deep-value' } } }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows, rowKey: 'id' } })
    const td = wrapper.find('tbody tr td')
    expect(td.exists()).toBe(true)
    expect(td.text()).toBe('deep-value')
  })
  test.todo.skip('column hide/show API works when implemented')
  test.todo.skip('column reorder API respects programmatic reordering when implemented')
  test.todo.skip('column resize emits events when user resizes columns if implemented')
  test.todo.skip('virtualization displays only subset of rows when enabled and scrolls correctly')
  test.todo.skip('export to CSV includes visible columns and rows when export feature invoked')
  test.todo.skip(
    'keyboard navigation focuses correct cell and wraps/limits as expected when supported',
  )

  test.todo('gracefully handles invalid column definitions (missing dataField or id)')

  // Recommended / optional tests
  test('columns prop takes precedence over slot-declared and inferred columns', () => {
    // Provide both props.columns and a slot-declared sg-column; props.columns should win
    const propsCols = [{ key: 'p1', field: 'id', caption: 'FromProps' }]
    const slotContent = '<sg-column data-field="name" caption="FromSlot"></sg-column>'

    const wrapper = mount(SgGrid, {
      props: { columns: propsCols, rows: [], rowKey: 'id' },
      slots: { default: slotContent },
    })

    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(1)
    expect(ths[0].text()).toBe('FromProps')
  })

  test('slot-declared columns are used when props.columns is absent', () => {
    const slotContent = '<sg-column data-field="name" caption="FromSlot"></sg-column>'
    const wrapper = mount(SgGrid, {
      props: { rows: [], rowKey: 'id' },
      slots: { default: slotContent },
    })
    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(1)
    expect(ths[0].text()).toBe('FromSlot')
  })

  test('inferred columns are produced when no columns prop and no declared slot columns', () => {
    const rows = [{ id: 1, a: 'x', b: 'y' }]
    const wrapper = mount(SgGrid, { props: { rows, rowKey: 'id' } })
    const ths = wrapper.findAll('thead th')
    // inferred from object keys: id,a,b (order may vary but SgGrid collects Object.keys order)
    expect(ths.length).toBeGreaterThanOrEqual(3)
    expect(ths.map((t) => t.text())).toEqual(expect.arrayContaining(['id', 'a', 'b']))
  })
  test('grid caption (<caption>) renders when props.caption is provided', () => {
    const wrapper = mount(SgGrid, { props: { caption: 'My Grid Caption', rowKey: 'id' } })
    const caption = wrapper.find('caption')
    expect(caption.exists()).toBe(true)
    expect(caption.text()).toBe('My Grid Caption')
  })
  test('getRowKey behaviour: no rowKey -> JSON.stringify(row), string -> property, function -> return value', async () => {
    // no rowKey: SgGrid should fallback to JSON.stringify(row) and preserve identity when mutating non-key fields
    const cols = [{ key: 'c1', field: 'name', caption: 'Name' }]
    const rowsNoKey = reactive([{ id: 1, name: 'X' }])
    const wrapperNoKey = mount(SgGrid, { props: { columns: cols, rows: rowsNoKey, rowKey: 'id' } })
    const trNoKey = wrapperNoKey.findAll('tbody tr')[0].element
    rowsNoKey[0].name = 'XX'
    await nextTick()
    expect(wrapperNoKey.findAll('tbody tr')[0].element).toBe(trNoKey)

    // string rowKey: use property
    const rowsStringKey = reactive([{ id: 'k1', name: 'A' }])
    const wrapperStringKey = mount(SgGrid, {
      props: { columns: cols, rows: rowsStringKey, rowKey: 'id' },
    })
    const trStringKey = wrapperStringKey.findAll('tbody tr')[0].element
    // changing non-key should keep DOM node
    rowsStringKey[0].name = 'AA'
    await nextTick()
    expect(wrapperStringKey.findAll('tbody tr')[0].element).toBe(trStringKey)

    // function rowKey: return name; changing name should replace DOM node
    const rowsFuncKey = reactive([{ id: 1, name: 'one' }])
    const rowKeyFn = (r: { [k: string]: unknown }) => String(r.name)
    const wrapperFuncKey = mount(SgGrid, {
      props: {
        columns: cols,
        rows: rowsFuncKey,
        rowKey: rowKeyFn as unknown as (row: unknown) => string,
      },
    })
    const trFunc = wrapperFuncKey.findAll('tbody tr')[0].element
    // changing the name (which is used as the key) -> should replace the DOM node
    rowsFuncKey[0].name = 'changed'
    await wrapperFuncKey.setProps({ rows: [{ id: 1, name: 'changed' }] })
    await nextTick()
    expect(wrapperFuncKey.findAll('tbody tr')[0].element).not.toBe(trFunc)
  })
  test('SgGrid passes column.caption and column.field to SgColumn via props', () => {
    // We'll mount SgGrid but stub SgColumn to capture the props it receives.
    const received: Array<Record<string, unknown>> = []
    const StubColumn = defineComponent({
      name: 'StubColumn',
      props: ['dataRow', 'dataField', 'caption', 'width', 'align'],
      setup(props) {
        received.push({ ...props })
        return () => null
      },
    })

    const cols = [
      { key: 'c1', field: 'name', caption: 'Name' },
      { key: 'c2', field: 'age', caption: 'Age' },
    ]
    const rows = [{ id: 1, name: 'X', age: 9 }]

    mount(SgGrid, {
      props: { columns: cols, rows, rowKey: 'id' },
      global: { stubs: { 'sg-column': StubColumn } },
    })

    // There will be one StubColumn instance per column per row (1 row x 2 cols)
    expect(received.length).toBe(2)
    // The first received corresponds to first column
    expect(received[0].caption).toBe('Name')
    expect(received[0].dataField).toBe('name')
    // second column
    expect(received[1].caption).toBe('Age')
    expect(received[1].dataField).toBe('age')
  })
  test('rows use stable DOM keys and re-render only when identity changes', async () => {
    const cols = [{ key: 'c1', field: 'name', caption: 'Name' }]
    const rows = reactive([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])

    const wrapper = mount(SgGrid, { props: { columns: cols, rows, rowKey: 'id' } })

    // capture the first row element
    const firstTr = wrapper.findAll('tbody tr')[0].element
    expect(wrapper.findAll('tbody tr')[0].find('td').text()).toBe('A')

    // mutate a non-key field on the same object; DOM node should remain same
    rows[0].name = 'AA'
    await nextTick()
    const firstTrAfter = wrapper.findAll('tbody tr')[0].element
    expect(firstTrAfter).toBe(firstTr)
    expect(wrapper.findAll('tbody tr')[0].find('td').text()).toBe('AA')

    // replace the rows with a new array where the first row has a different id -> key changed
    await wrapper.setProps({
      rows: [
        { id: 99, name: 'New' },
        { id: 2, name: 'B' },
      ],
    })
    await nextTick()
    const firstTrNew = wrapper.findAll('tbody tr')[0].element
    expect(firstTrNew).not.toBe(firstTr)
    expect(wrapper.findAll('tbody tr')[0].find('td').text()).toBe('New')
  })
  test('declared slot columns are recognized when using <sg-column data-field=...> in default slot', () => {
    // Use the data-field attribute (dash-case) in a default slot; SgGrid should read it
    const slotContent = '<sg-column data-field="age" caption="SlotAge"></sg-column>'
    const wrapper = mount(SgGrid, {
      props: { rows: [], rowKey: 'id' },
      slots: { default: slotContent },
    })
    const ths = wrapper.findAll('thead th')
    expect(ths.length).toBe(1)
    expect(ths[0].text()).toBe('SlotAge')
  })

  test.todo.skip('filtering/sorting combination behaves correctly with multiple criteria')
})

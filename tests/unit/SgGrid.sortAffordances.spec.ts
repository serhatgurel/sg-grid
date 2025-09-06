// Tests for sort affordances: indicators, multi-sort ordering, and button affordances

import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

// Sort affordance tests: ensure visual indicators and multi-sort badges render
// and that behavior differs correctly between client-side and server-side modes.
describe('SgGrid sort visual affordances', () => {
  test('client-side: clicking headers shows sort arrows and multi-sort order badge when using Shift+click', async () => {
    // intent: verify UI feedback that communicates current multi-column sort state
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', sortable: true },
      { key: 'k2', field: 'age', caption: 'Age', sortable: true },
    ]
    const data = [
      { id: 1, name: 'Bob', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id' },
    })

    const btns = wrapper.findAll('[data-test-sort-button]')
    expect(btns.length).toBe(2)

    // click first header, then shift+click second to append a second sort
    await btns[0].trigger('click')
    await btns[1].trigger('click', { shiftKey: true })

    const ths = wrapper.findAll('th')
    const ageTh = ths.find((t) => t.text().includes('Age'))
    const nameTh = ths.find((t) => t.text().includes('Name'))
    expect(ageTh).toBeTruthy()
    expect(nameTh).toBeTruthy()

    const ageIndicator = ageTh!.find('[data-test-sort-indicator]')
    const nameIndicator = nameTh!.find('[data-test-sort-indicator]')
    expect(ageIndicator.exists()).toBe(true)
    expect(nameIndicator.exists()).toBe(true)

    // Age is the appended sort: should show arrow and an order badge '2'
    expect(ageIndicator.text()).toContain('▲')
    const ageOrder = ageIndicator.find('[data-test-sort-order]')
    expect(ageOrder.exists()).toBe(true)
    expect(ageOrder.text()).toBe('2')

    // Name is primary sort: arrow but no order badge
    expect(nameIndicator.text()).toContain('▲')
    const nameOrder = nameIndicator.find('[data-test-sort-order]')
    expect(nameOrder.exists()).toBe(false)
  })

  test('server-side: indicators reflect the sort provided by props (read-only UI)', async () => {
    // intent: when server provides sort state, the UI shows it but does not apply client-side sorting
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', sortable: true },
      { key: 'k2', field: 'age', caption: 'Age', sortable: true },
    ]
    const data = [
      { id: 1, name: 'Bob', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
    ]

    const wrapper = mount(SgGrid, {
      props: {
        columns: cols,
        rows: data,
        rowKey: 'id',
        serverSide: true,
        sort: [
          { column: 'k2', direction: 'desc' },
          { column: 'k1', direction: 'asc' },
        ],
      },
    })

    const ths = wrapper.findAll('th')
    const ageTh = ths.find((t) => t.text().includes('Age'))
    const nameTh = ths.find((t) => t.text().includes('Name'))

    const ageIndicator = ageTh!.find('[data-test-sort-indicator]')
    const nameIndicator = nameTh!.find('[data-test-sort-indicator]')

    expect(ageIndicator.exists()).toBe(true)
    expect(nameIndicator.exists()).toBe(true)

    // Age should show descending arrow (server told us so)
    expect(ageIndicator.text()).toContain('▼')
    expect(ageIndicator.find('[data-test-sort-order]').exists()).toBe(false)

    // Name should show ascending arrow with order badge '2'
    expect(nameIndicator.text()).toContain('▲')
    const nameOrder = nameIndicator.find('[data-test-sort-order]')
    expect(nameOrder.exists()).toBe(true)
    expect(nameOrder.text()).toBe('2')
  })
})

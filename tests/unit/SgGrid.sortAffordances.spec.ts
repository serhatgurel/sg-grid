import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid sort visual affordances', () => {
  test('client-side: show arrow and multi-sort order badge after shift+click', async () => {
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

    // click first header
    await btns[0].trigger('click')
    // shift+click second header to append
    await btns[1].trigger('click', { shiftKey: true })

    const ths = wrapper.findAll('th')
    // find Age header th
    const ageTh = ths.find((t) => t.text().includes('Age'))
    const nameTh = ths.find((t) => t.text().includes('Name'))
    expect(ageTh).toBeTruthy()
    expect(nameTh).toBeTruthy()

    const ageIndicator = ageTh!.find('[data-test-sort-indicator]')
    const nameIndicator = nameTh!.find('[data-test-sort-indicator]')
    expect(ageIndicator.exists()).toBe(true)
    expect(nameIndicator.exists()).toBe(true)

    // Age should have arrow (asc by default) and an order badge (2)
    expect(ageIndicator.text()).toContain('▲')
    const ageOrder = ageIndicator.find('[data-test-sort-order]')
    expect(ageOrder.exists()).toBe(true)
    expect(ageOrder.text()).toBe('2')

    // Name should have arrow and no order badge (it's primary sort)
    expect(nameIndicator.text()).toContain('▲')
    const nameOrder = nameIndicator.find('[data-test-sort-order]')
    expect(nameOrder.exists()).toBe(false)
  })

  test('server-side: indicators reflect props.sort', async () => {
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', sortable: true },
      { key: 'k2', field: 'age', caption: 'Age', sortable: true },
    ]
    const data = [
      { id: 1, name: 'Bob', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
    ]

    // server provides multi-sort: first k2 desc, then k1 asc
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

    // Age should show descending arrow
    expect(ageIndicator.text()).toContain('▼')
    // Age is primary (order 1) so no order badge
    expect(ageIndicator.find('[data-test-sort-order]').exists()).toBe(false)

    // Name should show ascending arrow and order badge 2
    expect(nameIndicator.text()).toContain('▲')
    const nameOrder = nameIndicator.find('[data-test-sort-order]')
    expect(nameOrder.exists()).toBe(true)
    expect(nameOrder.text()).toBe('2')
  })
})

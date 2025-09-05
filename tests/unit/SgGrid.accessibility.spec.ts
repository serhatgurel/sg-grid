import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SgGrid from '../../src/components/SgGrid.vue'

const columns = [
  { key: 'name', field: 'name', sortable: true, filterable: true },
  { key: 'age', field: 'age', sortable: false },
]

const rows = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
]

describe('SgGrid accessibility', () => {
  it('renders column headers with role and updates aria-sort on sort interactions', async () => {
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id' } })

    const ths = wrapper.findAll('th')
    expect(ths.length).toBeGreaterThan(0)

    // first header should be a columnheader
    expect(ths[0].attributes('role')).toBe('columnheader')

    // initially no aria-sort attribute on unsorted column
    expect(ths[0].attributes('aria-sort')).toBeUndefined()

    // activate sorting via the visible sort button
    await ths[0].find('[data-test-sort-button]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(ths[0].attributes('aria-sort')).toBe('ascending')

    // toggle to descending
    await ths[0].find('[data-test-sort-button]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(ths[0].attributes('aria-sort')).toBe('descending')
  })

  it('keyboard activation (Enter/Space) triggers sort and emits request:page when serverSide', async () => {
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id', serverSide: true } })

    const th = wrapper.find('th')
    // simulate Enter keydown on header
    await th.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:sort') || wrapper.emitted('request:page')).toBeTruthy()
    expect(wrapper.emitted('request:page')).toBeTruthy()
  })
})

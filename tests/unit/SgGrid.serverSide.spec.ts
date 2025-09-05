import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid server-side mode', () => {
  test('when serverSide=true sort click emits update:sort and request:page', async () => {
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', sortable: true },
      { key: 'k2', field: 'age', caption: 'Age' },
    ]

    const data = [
      { id: 1, name: 'Bob', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id', serverSide: true },
    })

    // find the sort button and click
    const btn = wrapper.find('[data-test-sort-button]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    // update:sort should be emitted with payload
    const sortEmits = wrapper.emitted()['update:sort'] as any
    expect(sortEmits).toBeTruthy()
    expect(sortEmits[0][0]).toEqual([{ column: 'k1', direction: 'asc' }])

    // request:page should be emitted with page payload containing sort
    const req = wrapper.emitted()['request:page'] as any
    expect(req).toBeTruthy()
    const payload = req[0][0]
    expect(payload).toHaveProperty('page')
    expect(payload).toHaveProperty('pageSize')
    expect(payload.sort).toEqual([{ column: 'k1', direction: 'asc' }])

    // Important: client-side sorting should NOT have been applied when serverSide=true
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    // initial order should remain unchanged (Bob then Alice)
    expect(rows[0].text()).toContain('Bob')
    expect(rows[1].text()).toContain('Alice')
  })

  test('when serverSide=true filter input emits update:filter and request:page', async () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]

    const data = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id', serverSide: true },
    })

    const input = wrapper.find('[data-test-filter-input]')
    expect(input.exists()).toBe(true)
    await input.setValue('alice')

    const filt = wrapper.emitted()['update:filter'] as any
    expect(filt).toBeTruthy()
    expect(filt[0][0]).toEqual([{ column: 'k1', operator: 'contains', value: 'alice' }])

    const req2 = wrapper.emitted()['request:page'] as any
    expect(req2).toBeTruthy()
    const payload2 = req2[0][0]
    expect(payload2.filter).toEqual([{ column: 'k1', operator: 'contains', value: 'alice' }])

    // Ensure client-side filtering was NOT applied by the grid when serverSide=true
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Bob')
    expect(rows[1].text()).toContain('Alice')
  })
})

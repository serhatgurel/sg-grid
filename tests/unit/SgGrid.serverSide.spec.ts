import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid server-side mode', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
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
    const sortEmitsUnknown = wrapper.emitted()['update:sort'] as unknown
    expect(sortEmitsUnknown).toBeTruthy()
    const sortEmits = sortEmitsUnknown as Array<unknown>
    expect((sortEmits[0] as Array<unknown>)[0]).toEqual([{ column: 'k1', direction: 'asc' }])

    // request:page should be emitted with page payload containing sort
    const reqUnknown = wrapper.emitted()['request:page'] as unknown
    expect(reqUnknown).toBeTruthy()
    const req = reqUnknown as Array<unknown>
    const payloadUnknown = (req[0] as Array<unknown>)[0]
    expect(payloadUnknown).toBeTruthy()
    const payload = payloadUnknown as Record<string, unknown>
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
    // advance debounce
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    const filtUnknown = wrapper.emitted()['update:filter'] as unknown
    expect(filtUnknown).toBeTruthy()

    const filt = filtUnknown as Array<unknown>
    expect((filt[0] as Array<unknown>)[0] as unknown).toEqual([
      { column: 'k1', operator: 'contains', value: 'alice' },
    ])

    const req2Unknown = wrapper.emitted()['request:page'] as unknown
    expect(req2Unknown).toBeTruthy()
    const req2 = req2Unknown as Array<unknown>
    const payload2 = (req2[0] as Array<unknown>)[0] as Record<string, unknown>
    expect(payload2.filter).toEqual([{ column: 'k1', operator: 'contains', value: 'alice' }])

    // Ensure client-side filtering was NOT applied by the grid when serverSide=true
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Bob')
    expect(rows[1].text()).toContain('Alice')
  })
})

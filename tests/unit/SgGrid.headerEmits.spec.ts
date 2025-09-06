// Tests to verify emitted events from header interactions (update:sort, update:filter, request:page)

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

// Header emits tests: ensure user interactions on the header produce the correct events.
// Comments explain what the UI action corresponds to in emitted payloads.
describe('SgGrid header emits (client-side)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('clicking a sortable header emits update:sort with the expected sort clause', async () => {
    // intent: clicking toggles sort state and emits the current sort clauses
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true }]

    const data = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id' },
    })

    const btn = wrapper.find('[data-test-sort-button]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    const emitted = wrapper.emitted()['update:sort'] as unknown[][]
    expect(emitted).toBeTruthy()
    const payload = emitted[0][0]
    expect(Array.isArray(payload)).toBe(true)
    const arr = payload as Array<Record<string, unknown>>
    expect(arr[0].column).toBe('k1')
    expect(arr[0].direction).toBe('asc')
  })

  test('typing into a header filter emits update:filter after debounce with clause payload', async () => {
    // intent: ensure typing results in a filter clause being emitted once debounce completes
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]

    const data = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id' },
    })

    const input = wrapper.find('[data-test-filter-input]')
    expect(input.exists()).toBe(true)
    await input.setValue('alice')

    // advance debounce
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    const emitted = wrapper.emitted()['update:filter'] as unknown[][]
    expect(emitted).toBeTruthy()
    const payload = emitted[0][0]
    expect(Array.isArray(payload)).toBe(true)
    const arr = payload as Array<Record<string, unknown>>
    expect(arr[0].column).toBe('k1')
    expect(arr[0].operator).toBe('contains')
    expect(arr[0].value).toBe('alice')
  })
})

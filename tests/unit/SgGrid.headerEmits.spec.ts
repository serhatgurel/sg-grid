import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid header emits (client-side)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  test('clicking header sort emits update:sort with correct payload', async () => {
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

  test('typing in header filter emits update:filter with clause payload', async () => {
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

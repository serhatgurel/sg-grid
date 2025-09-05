import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid header filter UI', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders filter input when column.filterable=true', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const input = wrapper.find('[data-test-filter-input]')
    expect(input.exists()).toBe(true)
  })

  test('debounced update:filter is emitted after typing, and clearing emits null', async () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const input = wrapper.find('[data-test-filter-input]')
    expect(input.exists()).toBe(true)

    // type 'foo'
    const el = input.element as HTMLInputElement
    el.value = 'foo'
    await input.trigger('input')

    // no immediate emit (debounced)
    expect(wrapper.emitted('update:filter')).toBeUndefined()

    // advance timers to fire debounce
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    const emitted = wrapper.emitted('update:filter')
    expect(emitted).toBeTruthy()
    // payload should be an array with contains clause
    const payloadUnknown = emitted![0][0] as unknown
    expect(Array.isArray(payloadUnknown)).toBe(true)
    const payload = payloadUnknown as Array<Record<string, unknown>>
    expect(payload[0].column).toBe('k1')
    expect(payload[0].operator).toBe('contains')
    expect(String(payload[0].value)).toBe('foo')

    // now clear input
    el.value = ''
    await input.trigger('input')
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    const emitted2 = wrapper.emitted('update:filter') || []
    // should have at least two emits; last payload is null
    expect(emitted2.length >= 2).toBe(true)
    const last = emitted2[emitted2.length - 1][0]
    expect(last).toBeNull()
  })
})

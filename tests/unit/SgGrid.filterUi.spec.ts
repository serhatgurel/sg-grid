// Component tests for filter UI interactions (typing into header filters, debounce, emits)

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

// Tests for the filter UI inside the grid header.
// These validate that filter inputs render when enabled, debounce behavior works,
// and clearing a filter emits the expected null payload. Comments explain intent
// so non-coders can follow what user actions map to emitted events.
describe('SgGrid header filter UI', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('shows a filter input when a column is configured to be filterable', () => {
    // intent: the grid should render an input element in the header when a column opts in
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const input = wrapper.find('[data-test-filter-input]')
    expect(input.exists()).toBe(true)
  })

  test('typing into the filter input emits a debounced update:filter; clearing emits null', async () => {
    // intent: typing should not immediately emit; after debounce the filter payload is emitted.
    // Clearing the input should emit `null` to indicate filter removal.
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const input = wrapper.find('[data-test-filter-input]')
    expect(input.exists()).toBe(true)

    // simulate typing 'foo'
    const el = input.element as HTMLInputElement
    el.value = 'foo'
    await input.trigger('input')

    // intent: no immediate emit because of debounce
    expect(wrapper.emitted('update:filter')).toBeUndefined()

    // advance timers to trigger debounce
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    const emitted = wrapper.emitted('update:filter')
    expect(emitted).toBeTruthy()
    // Verify payload shape: an array containing a contains clause for the column
    const payloadUnknown = emitted![0][0] as unknown
    expect(Array.isArray(payloadUnknown)).toBe(true)
    const payload = payloadUnknown as Array<Record<string, unknown>>
    expect(payload[0].column).toBe('k1')
    expect(payload[0].operator).toBe('contains')
    expect(String(payload[0].value)).toBe('foo')

    // now clear input and ensure last emission is null
    el.value = ''
    await input.trigger('input')
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    const emitted2 = wrapper.emitted('update:filter') || []
    expect(emitted2.length >= 2).toBe(true)
    const last = emitted2[emitted2.length - 1][0]
    expect(last).toBeNull()
  })
})

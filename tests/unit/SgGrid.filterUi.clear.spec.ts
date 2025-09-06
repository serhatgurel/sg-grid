// Component tests for filter UI clear behavior (header inputs and clear button)

import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

// Extra filter UI tests: clear button behavior and input type mapping.
// These tests explain the expected UX: clear cancels pending debounce and emits null,
// and inputType controls the rendered input element type.
describe('SgGrid filter UI extras', () => {
  test('clear button immediately clears filter and emits null payload', async () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const input = wrapper.find('[data-test-filter-input]')
    // clear button is hidden until there is text
    let clear = wrapper.find('[data-test-filter-clear]')
    expect(input.exists()).toBe(true)
    expect(clear.exists()).toBe(false)

    // simulate typing, the clear button should appear, then pressing clear
    await input.setValue('test')
    clear = wrapper.find('[data-test-filter-clear]')
    expect(clear.exists()).toBe(true)
    await clear.trigger('click')

    const emittedUnknown = wrapper.emitted()['update:filter'] as unknown
    expect(emittedUnknown).toBeTruthy()
    const emitted = emittedUnknown as Array<unknown>
    const last = (emitted[emitted.length - 1] as Array<unknown>)[0]
    // intent: the last emission after clicking clear is a null payload
    expect(last).toBeNull()
  })

  test('column.inputType=number renders an input[type=number] for numeric filters', () => {
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', filterable: true },
      { key: 'k2', field: 'age', caption: 'Age', filterable: true, inputType: 'number' },
    ]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const inputs = wrapper.findAll('[data-test-filter-input]')
    expect(inputs.length).toBe(2)
    const ageInput = inputs[1].element as HTMLInputElement
    // intent: numeric input type is used to provide native numeric keyboard/validation
    expect(ageInput.type).toBe('number')
  })
})

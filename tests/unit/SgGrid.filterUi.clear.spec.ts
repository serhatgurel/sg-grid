import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid filter UI extras', () => {
  test('clear button emits null and cancels debounce', async () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const input = wrapper.find('[data-test-filter-input]')
    const clear = wrapper.find('[data-test-filter-clear]')
    expect(input.exists()).toBe(true)
    expect(clear.exists()).toBe(true)

    await input.setValue('test')
    // click clear immediately
    await clear.trigger('click')

    const emittedUnknown = wrapper.emitted()['update:filter'] as unknown
    expect(emittedUnknown).toBeTruthy()
    const emitted = emittedUnknown as Array<unknown>
    const last = (emitted[emitted.length - 1] as Array<unknown>)[0]
    expect(last).toBeNull()
  })

  test('numeric input type when column.inputType=number', () => {
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', filterable: true },
      { key: 'k2', field: 'age', caption: 'Age', filterable: true, inputType: 'number' },
    ]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })
    const inputs = wrapper.findAll('[data-test-filter-input]')
    expect(inputs.length).toBe(2)
    const ageInput = inputs[1].element as HTMLInputElement
    expect(ageInput.type).toBe('number')
  })
})

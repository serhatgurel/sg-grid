// Implementation-specific accessibility tests for SgGrid to validate focus/blur polyfill and focus styling

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SgGrid from '../../src/components/SgGrid.vue'

// Implementation-specific accessibility tests: verify focus class behavior and aria labeling
// These tests exercise concrete DOM side-effects expected by the styling and accessibility layers.
describe('SgGrid accessibility - implementation details', () => {
  it('focusing a sortable header adds a focus CSS class; blurring removes it', async () => {
    const columns = [
      { key: 'name', field: 'name', caption: 'Name', sortable: true, filterable: true },
    ]
    const rows = [{ id: '1', name: 'Alice' }]
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id' } })

    const th = wrapper.find('th')
    expect(th.attributes('tabindex')).toBe('0')

    // focus programmatically and assert class toggles
    ;(th.element as HTMLElement).focus()
    await wrapper.vm.$nextTick()
    expect(th.classes()).toContain('sg-header--focused')
    ;(th.element as HTMLElement).blur()
    await wrapper.vm.$nextTick()
    expect(th.classes()).not.toContain('sg-header--focused')
  })

  it('filter input includes an aria-label describing the column for screen readers', async () => {
    const columns = [
      { key: 'name', field: 'name', caption: 'Full Name', sortable: true, filterable: true },
    ]
    const rows = [{ id: '1', name: 'Alice' }]
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id' } })

    const input = wrapper.find('[data-test-filter-input]')
    // intent: ensure accessible labeling is present so assistive tech can announce the input purpose
    expect(input.attributes('aria-label')).toBe('Filter Full Name')
  })
})

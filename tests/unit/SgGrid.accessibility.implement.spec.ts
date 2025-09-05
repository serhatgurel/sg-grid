import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid accessibility - implement', () => {
  it('focus adds focus class and blur removes it for sortable headers', async () => {
    const columns = [{ key: 'name', field: 'name', caption: 'Name', sortable: true, filterable: true }]
    const rows = [{ id: '1', name: 'Alice' }]
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id' } })

    const th = wrapper.find('th')
    expect(th.attributes('tabindex')).toBe('0')

    // focus programmatically
    ;(th.element as HTMLElement).focus()
    await wrapper.vm.$nextTick()
    expect(th.classes()).toContain('sg-header--focused')

    // blur removes class
    ;(th.element as HTMLElement).blur()
    await wrapper.vm.$nextTick()
    expect(th.classes()).not.toContain('sg-header--focused')
  })

  it('filter input has aria-label describing the column', async () => {
    const columns = [{ key: 'name', field: 'name', caption: 'Full Name', sortable: true, filterable: true }]
    const rows = [{ id: '1', name: 'Alice' }]
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id' } })

    const input = wrapper.find('[data-test-filter-input]')
    expect(input.attributes('aria-label')).toBe('Filter Full Name')
  })
})

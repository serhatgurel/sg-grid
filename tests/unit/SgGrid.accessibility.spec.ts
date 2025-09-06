// Accessibility-focused tests for SgGrid: ARIA attributes and keyboard affordances

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SgGrid from '../../src/components/SgGrid.vue'

// Accessibility tests: ensure semantic roles, aria-sort updates and keyboard activation behave
// in an accessible way so assistive technologies can interpret grid sorting and controls.
const columns = [
  { key: 'name', field: 'name', sortable: true, filterable: true },
  { key: 'age', field: 'age', sortable: false },
]

const rows = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
]

describe('SgGrid accessibility', () => {
  it('renders headers with correct role and updates aria-sort on user interaction', async () => {
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id' } })

    const ths = wrapper.findAll('th')
    expect(ths.length).toBeGreaterThan(0)

    // first header should be a columnheader role for accessibility
    expect(ths[0].attributes('role')).toBe('columnheader')

    // initially unsorted -> no aria-sort
    expect(ths[0].attributes('aria-sort')).toBeUndefined()

    // simulate clicking sort control -> aria-sort should change to ascending
    await ths[0].find('[data-test-sort-button]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(ths[0].attributes('aria-sort')).toBe('ascending')

    // toggle sort again to descending
    await ths[0].find('[data-test-sort-button]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(ths[0].attributes('aria-sort')).toBe('descending')
  })

  it('keyboard activation (Enter) triggers sort and emits server request when serverSide=true', async () => {
    const wrapper = mount(SgGrid, { props: { columns, rows, rowKey: 'id', serverSide: true } })

    const th = wrapper.find('th')
    // simulate Enter keydown on header
    await th.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()

    // intent: keyboard activation should both update sort state and, in server mode, request a page
    expect(wrapper.emitted('update:sort') || wrapper.emitted('request:page')).toBeTruthy()
    expect(wrapper.emitted('request:page')).toBeTruthy()
  })
})

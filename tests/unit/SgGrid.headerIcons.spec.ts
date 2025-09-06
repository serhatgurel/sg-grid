import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SgGrid from '../../src/components/SgGrid.vue'

describe('SgGrid header icons and caption rendering', () => {
  test('renders filter icon when column is filterable', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const indicator = wrapper.find('[data-test-filter-indicator]')
    expect(indicator.exists()).toBe(true)
    // verify the symbol text is present (material icon glyph text)
    const icon = indicator.find('.material-symbols-outlined')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('filter_alt')
  })

  test('renders sort affordance when column is sortable (neutral state)', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const indicator = wrapper.find('[data-test-sort-indicator]')
    expect(indicator.exists()).toBe(true)

    // neutral sort affordance should show the generic 'sort' symbol when not actively sorted
    const neutral = indicator.find('.sg-indicator-neutral .material-symbols-outlined')
    expect(neutral.exists()).toBe(true)
    expect(neutral.text()).toBe('sort')
  })

  test('renders both filter and sort indicators when column is filterable and sortable', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true, filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const filter = wrapper.find('[data-test-filter-indicator]')
    const sort = wrapper.find('[data-test-sort-indicator]')
    expect(filter.exists()).toBe(true)
    expect(sort.exists()).toBe(true)
    expect(filter.find('.material-symbols-outlined').text()).toBe('filter_alt')
    expect(sort.find('.sg-indicator-neutral .material-symbols-outlined').text()).toBe('sort')
  })

  test('long captions render intact (no truncation by component)', () => {
    const long = 'L'.repeat(200)
    const cols = [{ key: 'k1', field: 'name', caption: long }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const th = wrapper.find('thead th')
    expect(th.exists()).toBe(true)
    // the header text should contain the full caption string
    expect(th.text()).toContain(long)
    // and its length should match the provided caption length (sanity check)
    expect(th.text().length).toBeGreaterThanOrEqual(long.length)
  })

  test('active sort arrow appears and toggles direction; indicator exposes aria-hidden and visually-hidden label', async () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const btn = wrapper.find('[data-test-sort-button]')
    expect(btn.exists()).toBe(true)

    // first click -> ascending
    await btn.trigger('click')
    await nextTick()

    const indicator = wrapper.find('[data-test-sort-indicator]')
    const active = indicator.find('.sg-indicator-active')
    expect(active.exists()).toBe(true)
    // aria-hidden should be present on the visual icon container
    expect(active.attributes('aria-hidden')).toBe('true')
    const hiddenText = indicator.find('.visually-hidden')
    expect(hiddenText.exists()).toBe(true)
    expect(hiddenText.text()).toBe('▲')

    // second click -> descending
    await btn.trigger('click')
    await nextTick()
    const hiddenText2 = indicator.find('.visually-hidden')
    expect(hiddenText2.text()).toBe('▼')
  })

  test('filter indicator exposes aria-hidden on icon and a visually-hidden accessible label', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const filter = wrapper.find('[data-test-filter-indicator]')
    expect(filter.exists()).toBe(true)

    const neutral = filter.find('.sg-indicator-neutral')
    expect(neutral.exists()).toBe(true)
    // the visual icon container should be aria-hidden
    expect(neutral.attributes('aria-hidden')).toBe('true')

    const label = filter.find('.visually-hidden')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Filterable')
  })
})

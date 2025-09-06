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
    // verify the filter icon is present as an SVG image
    const iconWrapper = indicator.find('.sg-icon-inline')
    expect(iconWrapper.exists()).toBe(true)
    // the icon component may render the SVG as the root element
    expect(
      iconWrapper.element.tagName.toLowerCase() === 'svg' || iconWrapper.find('svg').exists(),
    ).toBe(true)
  })

  test('renders sort affordance when column is sortable (neutral state)', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const indicator = wrapper.find('[data-test-sort-indicator]')
    expect(indicator.exists()).toBe(true)

    // neutral sort affordance should show the generic 'sort' symbol when not actively sorted
    const neutralWrapper = indicator.find('.sg-indicator-neutral .sg-icon-inline')
    expect(neutralWrapper.exists()).toBe(true)
    expect(
      neutralWrapper.element.tagName.toLowerCase() === 'svg' || neutralWrapper.find('svg').exists(),
    ).toBe(true)
  })

  test('renders both filter and sort indicators when column is filterable and sortable', () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true, filterable: true }]
    const wrapper = mount(SgGrid, { props: { columns: cols, rows: [], rowKey: 'id' } })

    const filter = wrapper.find('[data-test-filter-indicator]')
    const sort = wrapper.find('[data-test-sort-indicator]')
    expect(filter.exists()).toBe(true)
    expect(sort.exists()).toBe(true)
    const fwrapper = filter.find('.sg-icon-inline')
    const swrapper = sort.find('.sg-indicator-neutral .sg-icon-inline')
    expect(fwrapper.exists()).toBe(true)
    expect(swrapper.exists()).toBe(true)
    expect(fwrapper.element.tagName.toLowerCase() === 'svg' || fwrapper.find('svg').exists()).toBe(
      true,
    )
    expect(swrapper.element.tagName.toLowerCase() === 'svg' || swrapper.find('svg').exists()).toBe(
      true,
    )
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

  // The following tests describe desired behaviors from docs/filter-sort/icons.md
  // They are skipped as TODOs until the component implements layout truncation/tooltip
  // and deterministic geometry in JSDOM. Keeping them as skipped tests documents
  // the expectations and provides a ready-to-run spec once implementation exists.
  test.skip('header text does not overlap icons (geometry check)', () => {
    // Intent: compute boundingClientRect for header text and icon elements and assert no intersection.
    // Implementation note: in JSDOM you may need to mock getBoundingClientRect values to simulate layout.
  })

  test.skip('long captions use ellipsis (text-overflow) and expose full caption via tooltip/title', () => {
    // Intent: when header text overflows available space the UI should apply CSS truncation
    // (text-overflow: ellipsis) and expose the full caption in a tooltip (title attribute)
    // This test should assert computed style or element.style contains text-overflow and that
    // the element has a title or aria-label with the full caption.
  })

  test.skip('width exception: explicit narrow width may prevent ellipsis and is allowed', () => {
    // Intent: when the author explicitly sets a column width that makes ellipsis impossible
    // the truncation rule may be violated; the test should verify the provided width is respected
    // and record that ellipsis was not applied intentionally.
  })
})

// Tests for header interactions: keyboard toggles, focus handling, and aria updates

import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

// Header interaction tests: document how clicks and modifier-clicks alter sort state
// and what events are emitted so junior devs can map UI actions to behavior.
describe('SgGrid header interactions (sorting)', () => {
  test('clicking a sortable header cycles through asc -> desc -> none and emits the corresponding payloads', async () => {
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

    // first click -> asc
    await btn.trigger('click')
    const evs1 = wrapper.emitted()['update:sort'] as unknown[][]
    expect(evs1).toBeTruthy()
    const p1 = evs1[0][0]
    expect(Array.isArray(p1)).toBe(true)
    const a1 = p1 as Array<Record<string, unknown>>
    expect(a1.length).toBe(1)
    expect(a1[0].column).toBe('k1')
    expect(a1[0].direction).toBe('asc')

    // second click -> desc
    await btn.trigger('click')
    const evs2 = wrapper.emitted()['update:sort'] as unknown[][]
    const p2 = evs2[evs2.length - 1][0]
    expect(Array.isArray(p2)).toBe(true)
    const a2 = p2 as Array<Record<string, unknown>>
    expect(a2.length).toBe(1)
    expect(a2[0].direction).toBe('desc')

    // third click -> none (empty array)
    await btn.trigger('click')
    const evs3 = wrapper.emitted()['update:sort'] as unknown[][]
    const p3 = evs3[evs3.length - 1][0]
    expect(Array.isArray(p3)).toBe(true)
    const a3 = p3 as Array<Record<string, unknown>>
    expect(a3.length).toBe(0)
  })

  test('shift+click appends a secondary sort clause instead of replacing primary sort', async () => {
    const cols = [
      { key: 'k1', field: 'name', caption: 'Name', sortable: true },
      { key: 'k2', field: 'age', caption: 'Age', sortable: true },
    ]

    const data = [
      { id: 1, name: 'Bob', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id' },
    })

    const btns = wrapper.findAll('[data-test-sort-button]')
    expect(btns.length).toBe(2)

    // click first -> single asc
    await btns[0].trigger('click')
    let evs = wrapper.emitted()['update:sort'] as unknown[][]
    let last = evs[evs.length - 1][0] as unknown
    expect(Array.isArray(last)).toBe(true)
    let arr = last as Array<Record<string, unknown>>
    expect(arr.length).toBe(1)
    expect(arr[0].column).toBe('k1')

    // shift+click second -> append k2 asc
    await btns[1].trigger('click', { shiftKey: true })
    evs = wrapper.emitted()['update:sort'] as unknown[][]
    last = evs[evs.length - 1][0]
    expect(Array.isArray(last)).toBe(true)
    arr = last as Array<Record<string, unknown>>
    expect(arr.length).toBe(2)
    expect(arr[0].column).toBe('k1')
    expect(arr[1].column).toBe('k2')
  })
})

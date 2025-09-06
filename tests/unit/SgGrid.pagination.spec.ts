// Pagination behaviour tests: prev/next handling and request:page payloads

import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SgGrid from '../../src/components/SgGrid.vue'

// Pagination tests: verify Prev/Next controls emit the expected request:page payload
// when the grid is in server-side paging mode. Comments explain expected page numbers.
describe('SgGrid pagination emits', () => {
  test('Prev/Next buttons emit request:page with correct page numbers and payload shape when serverSide=true', async () => {
    const cols = [{ key: 'k1', field: 'name', caption: 'Name', sortable: true, filterable: true }]

    const data = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
    ]

    const wrapper = mount(SgGrid, {
      props: { columns: cols, rows: data, rowKey: 'id', serverSide: true, page: 2, pageSize: 10 },
    })

    const prev = wrapper.find('[data-test-prev-btn]')
    const next = wrapper.find('[data-test-next-btn]')
    expect(prev.exists()).toBe(true)
    expect(next.exists()).toBe(true)

    // click prev -> should request page 1 (current page 2 -> prev is 1)
    await prev.trigger('click')
    const reqPrev = wrapper.emitted()['request:page'] as unknown[][]
    expect(reqPrev).toBeTruthy()
    const payloadPrev = reqPrev[0][0]
    expect(typeof payloadPrev === 'object' && payloadPrev !== null).toBe(true)
    const pPrev = payloadPrev as Record<string, unknown>
    expect(pPrev).toHaveProperty('page')
    expect(pPrev.page).toBe(1)
    expect(pPrev.pageSize).toBe(10)
    // payload should include sort and filter keys even if they are null
    expect(pPrev).toHaveProperty('sort')
    expect(pPrev).toHaveProperty('filter')

    // click next -> should request page 3 (current page 2 -> next is 3)
    await next.trigger('click')
    const reqNext = wrapper.emitted()['request:page'] as unknown[][]
    expect(reqNext).toBeTruthy()
    const payloadNext = reqNext[reqNext.length - 1][0]
    expect(typeof payloadNext === 'object' && payloadNext !== null).toBe(true)
    const pNext = payloadNext as Record<string, unknown>
    expect(pNext.page).toBe(3)
    expect(pNext.pageSize).toBe(10)
    expect(pNext).toHaveProperty('sort')
    expect(pNext).toHaveProperty('filter')
  })
})

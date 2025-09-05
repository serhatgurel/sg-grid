import { mount } from '@vue/test-utils'
import type { MountingOptions, VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import SgGrid from '../../src/components/SgGrid.vue'
import { sampleRows, sampleColumns } from './fixtures'

export type Row = { id: string; [k: string]: unknown }
export type Column = { key: string; field?: string; [k: string]: unknown }

export function mountWithSgGrid(
  options: {
    rows?: Row[]
    columns?: Column[]
    props?: Record<string, unknown>
    mountOptions?: MountingOptions<ComponentPublicInstance>
  } = {},
) {
  const rows = (options.rows ?? sampleRows) as Row[]
  const columns = (options.columns ?? sampleColumns) as Column[]
  const props = { rows, columns, rowKey: 'id', ...(options.props ?? {}) }

  const wrapper: VueWrapper<ComponentPublicInstance> = mount(SgGrid as any, {
    props,
    ...(options.mountOptions ?? {}),
  })

  function headerCells() {
    return wrapper.findAll('th')
  }

  function findHeaderByKey(key: string) {
    // headers should include a data attribute linking to column key when rendered
    const found = wrapper.find(`th[data-col-key="${key}"]`)
    return found.exists() ? found : null
  }

  async function clickHeaderSort(key: string) {
    const hd = findHeaderByKey(key)
    if (!hd) throw new Error(`header for key ${key} not found`)
    await hd.trigger('click')
  }

  function cellText(rowIdx: number, colKey: string) {
    const rowsEls = wrapper.findAll('tbody tr')
    const row = rowsEls[rowIdx]
    if (!row) return ''
    const cell = row.find(`[data-col-key="${colKey}"]`)
    return cell.exists() ? cell.text() : ''
  }

  return { wrapper, headerCells, findHeaderByKey, clickHeaderSort, cellText }
}

export default mountWithSgGrid

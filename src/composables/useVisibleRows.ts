import { computed, Ref, ComputedRef } from 'vue'
import type { Row, FilterClause, SortClause } from '../lib/dataUtils'
import { applyFilters, applySort } from '../lib/dataUtils'

function hasId(x: Row): x is Row & { id: PropertyKey } {
  return x && typeof x['id'] !== 'undefined'
}

export function useVisibleRows(options: {
  rows: Ref<ReadonlyArray<Row>>
  filter?: Ref<FilterClause[] | null>
  sort?: Ref<SortClause[] | null>
  filterMode?: Ref<'and' | 'or'>
  caseSensitive?: Ref<boolean> | boolean
}): { visible: ComputedRef<Array<Row & { id?: PropertyKey }>> } {
  const rowsRef = options.rows
  const filterRef = options.filter
  const sortRef = options.sort
  const filterModeRef = options.filterMode

  const visible = computed(() => {
    const baseRows = rowsRef.value || []
    // fast-fail
    const noFilter = !filterRef || !filterRef.value || filterRef.value.length === 0
    const noSort = !sortRef || !sortRef.value || sortRef.value.length === 0
    if (noFilter && noSort) return baseRows.slice()

    // Apply filters
    let filtered = baseRows.slice()
    if (!noFilter && filterRef) {
      if (!filterModeRef || filterModeRef.value === 'and') {
        filtered = applyFilters(filtered, filterRef.value)
      } else {
        // or: union of individual clause results
        const sets = (filterRef.value || []).map((cl) => applyFilters(baseRows, [cl]))
        const map = new Map<string, Row>()

        for (const s of sets) {
          for (const r of s) {
            // Prefer stable id if present; fallback to JSON string as key
            const key = hasId(r) ? String(r.id) : JSON.stringify(r)
            map.set(key, r)
          }
        }
        filtered = Array.from(map.values())
      }
    }

    // Apply sort
    if (!noSort && sortRef) {
      filtered = applySort(filtered, sortRef.value)
    }

    return filtered
  })

  return { visible: visible as ComputedRef<Array<Row & { id?: PropertyKey }>> }
}

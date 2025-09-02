export type Row = Record<string, unknown>

export type FilterClause = {
  column: string
  operator: string
  value: unknown
}

export type SortClause = {
  column: string
  direction: 'asc' | 'desc'
}

/**
 * Small utility: returns true for null or undefined
 */
function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined
}

/**
 * applyFilters - minimal, pure filter implementation for TDD slice
 *
 * Inputs are treated as readonly and the function returns a new array.
 * Supported operators for the minimal slice: `eq`, `contains`.
 *
 * @param rows - readonly array of rows
 * @param filter - array of filter clauses or null
 * @returns new array of rows matching the filter
 */
export function applyFilters(rows: ReadonlyArray<Row>, filter: FilterClause[] | null): Row[] {
  // fast-fail: return a shallow copy when there's no filter
  if (!filter || filter.length === 0) return rows.slice()

  return rows.filter((r) => {
    for (const clause of filter) {
      const val = (r as Row)[clause.column]
      if (clause.operator === 'eq') {
        if (val !== clause.value) return false
      } else if (clause.operator === 'contains') {
        if (isNil(val) || typeof val !== 'string') return false
        if (!val.includes(String(clause.value))) return false
      } else {
        // unknown operator: treat as non-matching for the minimal slice
        return false
      }
    }
    return true
  })
}

/**
 * applySort - minimal pure sort implementation for TDD slice
 * Supports only single-column asc/desc for now. Returns a new array.
 *
 * @param rows - readonly array of rows
 * @param sort - array of sort clauses or null
 * @returns new sorted array
 */
export function applySort(rows: ReadonlyArray<Row>, sort: SortClause[] | null): Row[] {
  if (!sort || sort.length === 0) return rows.slice()

  const primary = sort[0]
  const copy = rows.slice()
  copy.sort((a, b) => {
    const av = (a as Row)[primary.column]
    const bv = (b as Row)[primary.column]
    if (isNil(av) && isNil(bv)) return 0
    if (isNil(av)) return -1
    if (isNil(bv)) return 1
    // rely on JS ordering for primitives; keep minimal and explicit
    if (av < bv) return primary.direction === 'asc' ? -1 : 1
    if (av > bv) return primary.direction === 'asc' ? 1 : -1
    return 0
  })
  return copy
}

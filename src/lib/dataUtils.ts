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

function isMissingValue(v: unknown): boolean {
  // treat null, undefined and numeric NaN as missing
  return isNil(v) || (typeof v === 'number' && Number.isNaN(v))
}

function tryCoerceNumber(v: unknown): number | null {
  if (typeof v === 'number') {
    if (Number.isNaN(v)) return null
    return v
  }
  if (typeof v === 'string') {
    const n = Number(v)
    if (!Number.isNaN(n)) return n
    return null
  }
  return null
}

// --- Operator helpers (exported for unit testing)
export function opEq(val: unknown, clauseVal: unknown): boolean {
  if (isMissingValue(val)) return false
  const aNum = tryCoerceNumber(val)
  const bNum = tryCoerceNumber(clauseVal)
  if (aNum !== null && bNum !== null) return aNum === bNum
  return val === clauseVal
}

export function opNe(val: unknown, clauseVal: unknown): boolean {
  // per semantics: missing values satisfy `ne`
  if (isMissingValue(val)) return true
  const aNum = tryCoerceNumber(val)
  const bNum = tryCoerceNumber(clauseVal)
  if (aNum !== null && bNum !== null) return aNum !== bNum
  return val !== clauseVal
}

export function opRelational(
  val: unknown,
  clauseVal: unknown,
  operator: 'lt' | 'lte' | 'gt' | 'gte',
): boolean {
  const aNum = tryCoerceNumber(val)
  const bNum = tryCoerceNumber(clauseVal)
  if (aNum === null || bNum === null) return false
  if (operator === 'lt') return aNum < bNum
  if (operator === 'lte') return aNum <= bNum
  if (operator === 'gt') return aNum > bNum
  return aNum >= bNum
}

export function opContains(val: unknown, clauseVal: unknown): boolean {
  if (isMissingValue(val)) return false
  if (typeof val !== 'string') return false
  if (typeof clauseVal !== 'string' && typeof clauseVal !== 'number') return false
  return val.includes(String(clauseVal))
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
      const op = clause.operator

      if (op === 'eq') {
        if (!opEq(val, clause.value)) return false
        continue
      }
      if (op === 'ne') {
        if (!opNe(val, clause.value)) return false
        continue
      }
      if (op === 'lt' || op === 'lte' || op === 'gt' || op === 'gte') {
        // relational helpers expect one of the four operators
        const relOp = op as 'lt' | 'lte' | 'gt' | 'gte'
        if (!opRelational(val, clause.value, relOp)) return false
        continue
      }
      if (op === 'contains') {
        if (!opContains(val, clause.value)) return false
        continue
      }

      // unknown operator -> row doesn't match
      return false
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
  const copy = rows.slice()
  copy.sort((a, b) => {
    for (const clause of sort) {
      const av = (a as Row)[clause.column]
      const bv = (b as Row)[clause.column]

      // both missing -> continue to next clause
      if (isMissingValue(av) && isMissingValue(bv)) continue
      if (isMissingValue(av)) return -1
      if (isMissingValue(bv)) return 1

      const aNum = tryCoerceNumber(av)
      const bNum = tryCoerceNumber(bv)

      let cmp = 0
      if (aNum !== null && bNum !== null) {
        cmp = aNum < bNum ? -1 : aNum > bNum ? 1 : 0
      } else {
        const aStr = String(av)
        const bStr = String(bv)
        if (aStr < bStr) cmp = -1
        else if (aStr > bStr) cmp = 1
        else cmp = 0
      }

      if (cmp !== 0) return clause.direction === 'asc' ? cmp : -cmp
      // else continue to next clause for tie-breaker
    }
    return 0
  })
  return copy
}

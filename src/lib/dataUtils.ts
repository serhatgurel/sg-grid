export type Row = Record<string, unknown>

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

/**
 * coerceIfNumeric - returns a number when the input is numeric or a numeric-like string;
 * returns null for missing/NaN inputs; otherwise returns the original value unchanged.
 */
export function coerceIfNumeric(v: unknown): number | null | unknown {
  if (isMissingValue(v)) return null

  if (typeof v === 'number') {
    // already handled NaN above
    return v as number
  }

  if (typeof v === 'string') {
    const trimmed = v.trim()
    const n = Number(trimmed)
    if (!Number.isNaN(n)) return n
    return v
  }

  return v
}

// --- Operator helpers (exported for unit testing)
export function opEq(val: unknown, clauseVal: unknown): boolean {
  if (isMissingValue(val)) return false

  const a = coerceIfNumeric(val)
  const b = coerceIfNumeric(clauseVal)

  if (a === null || b === null) return false

  if (typeof a === 'number' && typeof b === 'number') return a === b
  return a === b
}

export function opNe(val: unknown, clauseVal: unknown): boolean {
  // per semantics: missing values satisfy `ne`
  if (isMissingValue(val)) return true

  const a = coerceIfNumeric(val)
  const b = coerceIfNumeric(clauseVal)

  if (a === null && b === null) return true
  if (a === null || b === null) return true

  if (typeof a === 'number' && typeof b === 'number') return a !== b
  return a !== b
}

export function opRelational(
  val: unknown,
  clauseVal: unknown,
  operator: 'lt' | 'lte' | 'gt' | 'gte',
): boolean {
  const a = coerceIfNumeric(val)
  const b = coerceIfNumeric(clauseVal)
  if (a === null || b === null) return false
  if (typeof a !== 'number' || typeof b !== 'number') return false
  if (operator === 'lt') return a < b
  if (operator === 'lte') return a <= b
  if (operator === 'gt') return a > b
  return a >= b
}

export function opContains(val: unknown, clauseVal: unknown, caseSensitive = false): boolean {
  if (isMissingValue(val) || isMissingValue(clauseVal)) return false

  const aStr = String(val)
  const bStr = String(clauseVal)

  if (!caseSensitive) {
    return aStr.toLowerCase().includes(bStr.toLowerCase())
  }
  return aStr.includes(bStr)
}

// --- String operator stubs (to be implemented in task 12)
export function opStartsWith(val: unknown, clauseVal: unknown, caseSensitive = false): boolean {
  // treat null/undefined and numeric NaN as missing
  if (isMissingValue(val) || isMissingValue(clauseVal)) return false

  // coerce both values to strings
  const aStr = String(val)
  const bStr = String(clauseVal)

  if (!caseSensitive) {
    return aStr.toLowerCase().startsWith(bStr.toLowerCase())
  }
  return aStr.startsWith(bStr)
}

export function opEndsWith(val: unknown, clauseVal: unknown, caseSensitive = false): boolean {
  if (isMissingValue(val) || isMissingValue(clauseVal)) return false

  const aStr = String(val)
  const bStr = String(clauseVal)

  if (!caseSensitive) {
    return aStr.toLowerCase().endsWith(bStr.toLowerCase())
  }
  return aStr.endsWith(bStr)
}

export function opIn(val: unknown, clauseVal: unknown): boolean {
  if (isMissingValue(val) || isMissingValue(clauseVal)) return false

  // if clauseVal is an array, check membership (with numeric coercion)
  if (Array.isArray(clauseVal)) {
    for (const item of clauseVal) {
      if (opEq(val, item)) return true
    }
    return false
  }

  // fallback: treat clauseVal as single value equality
  return opEq(val, clauseVal)
}

export function opBetween(val: unknown, clauseVal: unknown): boolean {
  if (isMissingValue(val) || isMissingValue(clauseVal)) return false

  // clauseVal must be an array of two values
  if (!Array.isArray(clauseVal) || clauseVal.length !== 2) return false

  const a = coerceIfNumeric(val)
  const low = coerceIfNumeric(clauseVal[0])
  const high = coerceIfNumeric(clauseVal[1])
  if (a === null || low === null || high === null) return false
  if (typeof a !== 'number' || typeof low !== 'number' || typeof high !== 'number') return false
  return a >= low && a <= high
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
import type { ColumnDef, FilterClause, SortClause } from '../components/types'
// Re-export clause types for consumers that import from dataUtils
export type { FilterClause, SortClause }

export function applyFilters(
  rows: ReadonlyArray<Row>,
  filter: FilterClause[] | null,
  // optional columns map/array to lookup column-level hooks. Accepts either array of ColumnDef or a map from key->ColumnDef
  columns?: ColumnDef[] | Record<string, ColumnDef>,
  options?: { caseSensitive?: boolean },
): Row[] {
  // fast-fail: return a shallow copy when there's no filter
  if (!filter || filter.length === 0) return rows.slice()

  const caseSensitive = options?.caseSensitive ?? false

  return rows.filter((r) => {
    for (const clause of filter) {
      // basic clause shape validation: must have a string column and string operator
      if (!clause || typeof clause.column !== 'string' || typeof clause.operator !== 'string') {
        if (process && process.env && process.env.NODE_ENV !== 'production') {
          console.warn(
            `applyFilters: malformed clause detected and ignored: ${JSON.stringify(clause)}`,
          )
        }
        // ignore malformed clause
        continue
      }
      const val = (r as Row)[clause.column]
      const op = clause.operator

      // column-level filterFunction override
      let colDef: ColumnDef | undefined = undefined
      if (Array.isArray(columns)) {
        colDef = (columns as ColumnDef[]).find((c) => c.key === clause.column)
      } else if (columns && typeof columns === 'object') {
        colDef = (columns as Record<string, ColumnDef>)[clause.column]
      }
      if (colDef && typeof colDef.filterFunction === 'function') {
        // filterFunction returns boolean
        if (
          !(
            colDef.filterFunction as unknown as (
              v: unknown,
              clauseVal: unknown,
              row?: Row,
              clause?: FilterClause,
            ) => boolean
          )(val, clause.value, r, clause)
        )
          return false
        continue
      }

      // validate common operator shapes and emit dev warnings for malformed clauses
      // unknown operators are ignored (clause treated as no-op) and warn in dev
      if (op === 'eq') {
        if (!opEq(val, clause.value)) return false
        continue
      }
      if (op === 'ne') {
        if (!opNe(val, clause.value)) return false
        continue
      }
      if (op === 'lt' || op === 'lte' || op === 'gt' || op === 'gte') {
        const relOp = op as 'lt' | 'lte' | 'gt' | 'gte'
        if (!opRelational(val, clause.value, relOp)) return false
        continue
      }
      if (op === 'contains') {
        if (!opContains(val, clause.value, caseSensitive)) return false
        continue
      }
      if (op === 'startsWith') {
        if (!opStartsWith(val, clause.value, caseSensitive)) return false
        continue
      }
      if (op === 'endsWith') {
        if (!opEndsWith(val, clause.value, caseSensitive)) return false
        continue
      }

      if (op === 'in') {
        // opIn already treats non-array clauseVal as equality; no warnings
        if (!opIn(val, clause.value)) return false
        continue
      }

      if (op === 'between') {
        // must be an array of length 2
        if (!Array.isArray(clause.value) || clause.value.length !== 2) {
          if (process && process.env && process.env.NODE_ENV !== 'production') {
            // warn in dev when clauses are malformed

            console.warn(`applyFilters: malformed 'between' clause for column "${clause.column}"`)
          }
          // ignore malformed clause (treat as no-op)
          continue
        }
        if (!opBetween(val, clause.value)) return false
        continue
      }

      // Unknown operator: warn in dev and ignore the clause
      if (process && process.env && process.env.NODE_ENV !== 'production') {
        console.warn(
          `applyFilters: unknown operator '${op}' on column "${clause.column}" - clause ignored`,
        )
      }
      // treat unknown operator as no-op
      continue
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
export function applySort(
  rows: ReadonlyArray<Row>,
  sort: SortClause[] | null,
  columns?: ColumnDef[] | Record<string, ColumnDef>,
): Row[] {
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

      // column-level sortFunction support: if present, use it to compare
      let colDef: ColumnDef | undefined = undefined
      if (Array.isArray(columns)) {
        colDef = (columns as ColumnDef[]).find((c) => c.key === clause.column)
      } else if (columns && typeof columns === 'object') {
        colDef = (columns as Record<string, ColumnDef>)[clause.column]
      }
      if (colDef && typeof colDef.sortFunction === 'function') {
        const cmp = (
          colDef.sortFunction as unknown as (x: unknown, y: unknown, xr?: Row, yr?: Row) => number
        )(av, bv, a, b)
        if (cmp !== 0) return clause.direction === 'asc' ? (cmp < 0 ? -1 : 1) : cmp < 0 ? 1 : -1
        continue
      }

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

// Unit tests for applyFilters: verifies operator handling, malformed clauses, and dev warnings

import { describe, it, expect } from 'vitest'
import { applyFilters } from '../../src/lib/dataUtils'

// applyFilters tests: clarify how filtering behaves with coercion, NaN, null and immutability.
// These tests help junior developers understand expected matching rules.
const rows = [
  { id: 1, val: '10' },
  { id: 2, val: 10 },
  { id: 3, val: null },
  { id: 4, val: 'abc' },
  { id: 5, val: NaN },
]

describe('applyFilters behavior and edge-cases', () => {
  it('eq: numeric-like strings should match numeric values (coercion applied)', () => {
    // intent: demonstrate that '10' (string) matches 10 (number) when using eq
    const res = applyFilters(rows, [{ column: 'val', operator: 'eq', value: 10 }])
    expect(res.map((r) => r.id).sort()).toEqual([1, 2])
  })

  it('ne: excludes values equal to the clause (after coercion)', () => {
    // intent: show that ne removes both numeric-string and numeric matches
    const res = applyFilters(rows, [{ column: 'val', operator: 'ne', value: 10 }])
    expect(res.map((r) => r.id).sort()).toEqual([3, 4, 5])
  })

  it('lt/gt: relational comparisons coerce numeric-like strings', () => {
    const lt = applyFilters(rows, [{ column: 'val', operator: 'lt', value: 15 }])
    expect(lt.map((r) => r.id).sort()).toEqual([1, 2])

    const gt = applyFilters(rows, [{ column: 'val', operator: 'gt', value: 5 }])
    expect(gt.map((r) => r.id).sort()).toEqual([1, 2])
  })

  it('NaN in cells is treated as missing and should not match relational eq', () => {
    // intent: NaN is an absent value for filtering semantics
    const res = applyFilters(rows, [{ column: 'val', operator: 'eq', value: NaN }])
    expect(res).toHaveLength(0)
  })

  it('null/undefined cell values do not match relational or contains clauses', () => {
    const eqNull = applyFilters(rows, [{ column: 'val', operator: 'eq', value: null }])
    expect(eqNull).toHaveLength(0)
  })

  it('immutability: applyFilters returns a new array and does not mutate input', () => {
    const copy = rows.slice()
    const res = applyFilters(rows, [{ column: 'val', operator: 'contains', value: 'a' }])
    expect(res).not.toBe(rows)
    expect(rows).toEqual(copy)
  })
})

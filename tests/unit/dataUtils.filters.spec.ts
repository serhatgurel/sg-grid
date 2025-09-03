import { describe, it, expect } from 'vitest'
import { applyFilters } from '../../src/lib/dataUtils'

const rows = [
  { id: 1, val: '10' },
  { id: 2, val: 10 },
  { id: 3, val: null },
  { id: 4, val: 'abc' },
  { id: 5, val: NaN },
]

describe('applyFilters - relational, coercion, NaN & immutability', () => {
  it('eq should match numeric-like strings when compared to numbers (coercion)', () => {
    const res = applyFilters(rows, [{ column: 'val', operator: 'eq', value: 10 }])
    // Expect both '10' (string) and 10 (number) to match when coercion is applied
    expect(res.map((r) => r.id).sort()).toEqual([1, 2])
  })

  it('ne should exclude numeric-like matches (coercion)', () => {
    const res = applyFilters(rows, [{ column: 'val', operator: 'ne', value: 10 }])
    // Expect rows 1 and 2 to be excluded
    expect(res.map((r) => r.id).sort()).toEqual([3, 4, 5])
  })

  it('lt / gt should work with coercion for numeric-like strings', () => {
    const lt = applyFilters(rows, [{ column: 'val', operator: 'lt', value: 15 }])
    expect(lt.map((r) => r.id).sort()).toEqual([1, 2])

    const gt = applyFilters(rows, [{ column: 'val', operator: 'gt', value: 5 }])
    expect(gt.map((r) => r.id).sort()).toEqual([1, 2])
  })

  it('NaN values should be treated as missing and not match relational ops', () => {
    const res = applyFilters(rows, [{ column: 'val', operator: 'eq', value: NaN }])
    expect(res).toHaveLength(0)
  })

  it('null/undefined cell values should not match relational ops or contains', () => {
    const eqNull = applyFilters(rows, [{ column: 'val', operator: 'eq', value: null }])
    expect(eqNull).toHaveLength(0)
  })

  it('applyFilters should be immutable and return a new array without mutating input', () => {
    const copy = rows.slice()
    const res = applyFilters(rows, [{ column: 'val', operator: 'contains', value: 'a' }])
    expect(res).not.toBe(rows)
    // original input must remain identical in contents
    expect(rows).toEqual(copy)
  })
})

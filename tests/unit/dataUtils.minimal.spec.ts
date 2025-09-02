import { describe, it, expect } from 'vitest'
import { applyFilters, applySort } from '../../src/lib/dataUtils'

const rows = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 35 },
]

describe('dataUtils minimal slice', () => {
  it('applyFilters: eq matches correctly', () => {
    const res = applyFilters(rows, [{ column: 'name', operator: 'eq', value: 'Bob' }])
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe(2)
  })

  it('applyFilters: contains matches substring', () => {
    const res = applyFilters(rows, [{ column: 'name', operator: 'contains', value: 'li' }])
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe(1)
  })

  it('applyFilters: no filter returns copy', () => {
    const res = applyFilters(rows, null)
    expect(res).not.toBe(rows)
    expect(res).toHaveLength(3)
  })

  it('applySort: single column asc', () => {
    const res = applySort(rows, [{ column: 'age', direction: 'asc' }])
    expect(res.map((r) => r.id)).toEqual([2, 1, 3])
  })

  it('applySort: single column desc', () => {
    const res = applySort(rows, [{ column: 'age', direction: 'desc' }])
    expect(res.map((r) => r.id)).toEqual([3, 1, 2])
  })

  it('applySort: no sort returns copy', () => {
    const res = applySort(rows, null)
    expect(res).not.toBe(rows)
    expect(res).toHaveLength(3)
  })
})

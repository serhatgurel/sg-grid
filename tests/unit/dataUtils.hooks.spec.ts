import { describe, it, expect } from 'vitest'
import { applyFilters, applySort } from '../../src/lib/dataUtils'
import type { ColumnDef } from '../../src/components/types'

const rows = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 40 },
]

describe('dataUtils - column-level hook overrides', () => {
  it('applyFilters should call column.filterFunction when provided', () => {
    const col: ColumnDef = {
      key: 'name',
      field: 'name',
      // only match rows whose name starts with 'B'
      filterFunction: (cellValue: unknown) => {
        // ignore clauseValue and implement custom logic for test
        return String(cellValue).startsWith('B')
      },
    }

    // clause would normally ask for 'contains' but filterFunction should take precedence
    const res = applyFilters(rows, [{ column: 'name', operator: 'contains', value: 'A' }], [col])
    expect(res.map((r) => r.id)).toEqual([2])
  })

  it('applySort should call column.sortFunction when provided', () => {
    const col: ColumnDef = {
      key: 'age',
      field: 'age',
      // reverse numeric comparator (sort descending regardless of requested direction)
      sortFunction: (a: unknown, b: unknown) => {
        const an = typeof a === 'number' ? a : Number(a)
        const bn = typeof b === 'number' ? b : Number(b)
        return bn - an
      },
    }

    const sortedAsc = applySort(rows, [{ column: 'age', direction: 'asc' }], [col])
    // our comparator reverses order so ascending request yields descending by age
    expect(sortedAsc.map((r) => r.id)).toEqual([3, 1, 2])

    const sortedDesc = applySort(rows, [{ column: 'age', direction: 'desc' }], [col])
    // descending request should invert comparator result again -> ascending by age
    expect(sortedDesc.map((r) => r.id)).toEqual([2, 1, 3])
  })
})

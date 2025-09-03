import { describe, it, expect } from 'vitest'
import { applySort } from '../../src/lib/dataUtils'

const rows = [
  { id: 1, first: 'Z', last: 'Alpha', age: 30 },
  { id: 2, first: 'A', last: 'Beta', age: 25 },
  { id: 3, first: 'A', last: 'Alpha', age: 28 },
  { id: 4, first: 'B', last: 'Alpha', age: 25 },
]

describe('applySort - multi-column, stability, immutability', () => {
  it('single-column asc/desc unchanged behavior', () => {
    const asc = applySort(rows, [{ column: 'age', direction: 'asc' }])
    expect(asc.map((r) => r.id)).toEqual([2, 4, 3, 1])

    const desc = applySort(rows, [{ column: 'age', direction: 'desc' }])
    expect(desc.map((r) => r.id)).toEqual([1, 3, 2, 4])
  })

  it('multi-column sort respects order (first then second)', () => {
    const sorted = applySort(rows, [
      { column: 'first', direction: 'asc' },
      { column: 'last', direction: 'asc' },
    ])
    // first: A (id 2,3), B (4), Z(1) -> within A sort by last asc: Alpha(3), Beta(2)
    expect(sorted.map((r) => r.id)).toEqual([3, 2, 4, 1])
  })

  it('stable sort: rows with equal keys preserve original relative order when not reordered by later keys', () => {
    const sorted = applySort(rows, [{ column: 'last', direction: 'asc' }])
    // last: Alpha(1,3,4), Beta(2) -> within Alpha preserve original order 1,3,4
    expect(sorted.map((r) => r.id)).toEqual([1, 3, 4, 2])
  })

  it('applySort should be immutable', () => {
    const copy = rows.slice()
    const res = applySort(rows, [{ column: 'first', direction: 'asc' }])
    expect(res).not.toBe(rows)
    expect(rows).toEqual(copy)
  })
})

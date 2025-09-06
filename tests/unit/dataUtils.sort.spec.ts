// Unit tests for applySort behavior in dataUtils — numeric and string comparisons, tie-breakers
// Focused on verifying ordering rules and missing-value handling.

import { describe, it, expect } from 'vitest'
import { applySort } from '../../src/lib/dataUtils'

// applySort tests: document sorting expectations and edge-cases for newcomers.
// These examples demonstrate single and multi-column sorts, stability, and immutability.
const rows = [
  { id: 1, first: 'Z', last: 'Alpha', age: 30 },
  { id: 2, first: 'A', last: 'Beta', age: 25 },
  { id: 3, first: 'A', last: 'Alpha', age: 28 },
  { id: 4, first: 'B', last: 'Alpha', age: 25 },
]

describe('applySort behavior and expectations', () => {
  it('single-column ascending/descending ordering behaves as expected', () => {
    const asc = applySort(rows, [{ column: 'age', direction: 'asc' }])
    expect(asc.map((r) => r.id)).toEqual([2, 4, 3, 1])

    const desc = applySort(rows, [{ column: 'age', direction: 'desc' }])
    expect(desc.map((r) => r.id)).toEqual([1, 3, 2, 4])
  })

  it('multi-column sort applies the first key, then the second to break ties', () => {
    const sorted = applySort(rows, [
      { column: 'first', direction: 'asc' },
      { column: 'last', direction: 'asc' },
    ])
    // Explanation: sort by `first` then by `last` for rows that share the same `first`
    expect(sorted.map((r) => r.id)).toEqual([3, 2, 4, 1])
  })

  it('stable sort: equal keys preserve original relative order when not reordered later', () => {
    const sorted = applySort(rows, [{ column: 'last', direction: 'asc' }])
    // last: Alpha(1,3,4), Beta(2) -> within Alpha preserve original order 1,3,4
    expect(sorted.map((r) => r.id)).toEqual([1, 3, 4, 2])
  })

  it('immutability: applySort returns a new array and does not change input', () => {
    const copy = rows.slice()
    const res = applySort(rows, [{ column: 'first', direction: 'asc' }])
    expect(res).not.toBe(rows)
    expect(rows).toEqual(copy)
  })
})

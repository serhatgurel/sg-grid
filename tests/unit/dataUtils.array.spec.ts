// Tests for array-related utilities used by dataUtils (helpers that operate on arrays)

import { describe, it, expect } from 'vitest'
import { opIn, opBetween } from '../../src/lib/dataUtils'

// These tests verify array-related operator helpers.
// Purpose: make the helpers' behavior explicit for newcomers — how arrays,
// non-arrays, coercion and malformed inputs are handled.
describe('dataUtils array operator helpers', () => {
  it('opIn: returns true when clause is an array that contains the value (with coercion)', () => {
    // intent: opIn should accept an array clause and match values present in it.
    expect(opIn('a', ['a', 'b', 'c'])).toBe(true)
    expect(opIn(2, [1, 2, 3])).toBe(true)
    expect(opIn('2', [1, 2, 3])).toBe(true) // coercion: '2' matches number 2
  })

  it('opIn: falls back to equality when clause is not an array', () => {
    // intent: when a single value is provided as the clause, treat it like eq
    expect(opIn('a', 'a')).toBe(true)
    expect(opIn(2, '2')).toBe(true)
    expect(opIn(null, 'a')).toBe(false)
  })

  it('opBetween: accepts numeric ranges and coerces strings to numbers', () => {
    // intent: accept both numeric values and numeric-like strings for comparisons
    expect(opBetween(5, [1, 10])).toBe(true)
    expect(opBetween('5', ['1', '10'])).toBe(true)
    expect(opBetween(0, [1, 10])).toBe(false)
  })

  it('opBetween: returns false for malformed range clauses', () => {
    // intent: guard against invalid clauses (e.g., wrong length or wrong type)
    expect(opBetween(5, [1])).toBe(false)
    expect(opBetween(5, '1-10')).toBe(false)
    expect(opBetween(null, [1, 10])).toBe(false)
  })
})

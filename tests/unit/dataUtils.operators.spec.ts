// Operator helper unit tests (opEq, opNe, opRelational, opIn, opBetween)
// These ensure primitive and coercion semantics are correct and edge cases covered.

import { describe, it, expect } from 'vitest'
import { opEq, opNe, opRelational, opContains } from '../../src/lib/dataUtils'

// Operator helper tests: make behavior explicit for common operators.
// These tests clarify how equality, inequality, relational comparisons,
// and substring checks behave with coercion and missing values.
describe('dataUtils operator helpers', () => {
  it('opEq: treats numbers and numeric-strings as equal when numeric', () => {
    expect(opEq(5, 5)).toBe(true)
    expect(opEq('5', 5)).toBe(true)
    expect(opEq('5', '5')).toBe(true)
    expect(opEq('5', '6')).toBe(false)
  })

  it('opEq: missing values do not match (missing means no value)', () => {
    expect(opEq(null, null)).toBe(false)
    expect(opEq(undefined, 1)).toBe(false)
  })

  it('opNe: handles missing values as not-equal when appropriate', () => {
    expect(opNe(null, 1)).toBe(true)
    expect(opNe(undefined, undefined)).toBe(true)
  })

  it('opRelational: numeric comparisons coerce strings and compare numerically', () => {
    expect(opRelational('5', 6, 'lt')).toBe(true)
    expect(opRelational(5, '5', 'lte')).toBe(true)
    expect(opRelational('10', '2', 'gt')).toBe(true)
    expect(opRelational('3', 4, 'gte')).toBe(false)
  })

  it('opRelational: non-numeric operands return false (no implicit ordering)', () => {
    expect(opRelational('a', 'b', 'lt')).toBe(false)
  })

  it('opContains: substring checks coerce inputs to strings and handle null safely', () => {
    expect(opContains('hello world', 'world')).toBe(true)
    expect(opContains('12345', 234)).toBe(true)
    expect(opContains(null, 'x')).toBe(false)
  })

  it('NaN handling: treat numeric NaN as missing (no matches for eq/relational)', () => {
    // NaN should not equal NaN for our matching semantics
    expect(opEq(NaN, NaN)).toBe(false)
    expect(opNe(NaN, 1)).toBe(true)
    expect(opRelational(NaN, 1, 'lt')).toBe(false)
    expect(opRelational(1, NaN, 'gt')).toBe(false)
  })
})

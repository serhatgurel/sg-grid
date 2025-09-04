import { describe, it, expect } from 'vitest'
import { opEq, opNe, opRelational, opContains } from '../../src/lib/dataUtils'

describe('dataUtils operator helpers', () => {
  it('opEq: numbers and numeric-strings compare numerically', () => {
    expect(opEq(5, 5)).toBe(true)
    expect(opEq('5', 5)).toBe(true)
    expect(opEq('5', '5')).toBe(true)
    expect(opEq('5', '6')).toBe(false)
  })

  it('opEq: missing values do not match', () => {
    expect(opEq(null, null)).toBe(false)
    expect(opEq(undefined, 1)).toBe(false)
  })

  it('opNe: missing values satisfy ne', () => {
    expect(opNe(null, 1)).toBe(true)
    expect(opNe(undefined, undefined)).toBe(true)
  })

  it('opRelational: numeric comparisons with coercion', () => {
    expect(opRelational('5', 6, 'lt')).toBe(true)
    expect(opRelational(5, '5', 'lte')).toBe(true)
    expect(opRelational('10', '2', 'gt')).toBe(true)
    expect(opRelational('3', 4, 'gte')).toBe(false)
  })

  it('opRelational: non-numeric returns false', () => {
    expect(opRelational('a', 'b', 'lt')).toBe(false)
  })

  it('opContains: string contains works', () => {
    expect(opContains('hello world', 'world')).toBe(true)
    expect(opContains('12345', 234)).toBe(true)
    expect(opContains(null, 'x')).toBe(false)
  })

  it('NaN handling: numeric NaN is treated as missing', () => {
    // opEq should treat NaN as missing -> no match
    expect(opEq(NaN, NaN)).toBe(false)

    // opNe should treat NaN as missing -> satisfy ne
    expect(opNe(NaN, 1)).toBe(true)

    // relational ops with NaN should return false
    expect(opRelational(NaN, 1, 'lt')).toBe(false)
    expect(opRelational(1, NaN, 'gt')).toBe(false)
  })
})

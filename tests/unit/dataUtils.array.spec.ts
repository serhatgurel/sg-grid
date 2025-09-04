import { describe, it, expect } from 'vitest'
import { opIn, opBetween } from '../../src/lib/dataUtils'

describe('dataUtils array operator helpers (TDD)', () => {
  it('opIn: matches when clause is array and contains value', () => {
    expect(opIn('a', ['a', 'b', 'c'])).toBe(true)
    expect(opIn(2, [1, 2, 3])).toBe(true)
    expect(opIn('2', [1, 2, 3])).toBe(true) // coercion
  })

  it('opIn: treats non-array clause as equality fallback', () => {
    expect(opIn('a', 'a')).toBe(true)
    expect(opIn(2, '2')).toBe(true)
    expect(opIn(null, 'a')).toBe(false)
  })

  it('opBetween: numeric ranges and coercion', () => {
    expect(opBetween(5, [1, 10])).toBe(true)
    expect(opBetween('5', ['1', '10'])).toBe(true)
    expect(opBetween(0, [1, 10])).toBe(false)
  })

  it('opBetween: malformed clause returns false', () => {
    expect(opBetween(5, [1])).toBe(false)
    expect(opBetween(5, '1-10')).toBe(false)
    expect(opBetween(null, [1, 10])).toBe(false)
  })
})

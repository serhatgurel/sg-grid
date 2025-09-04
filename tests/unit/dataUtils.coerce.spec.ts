import { describe, it, expect } from 'vitest'
import { coerceIfNumeric } from '../../src/lib/dataUtils'

describe('dataUtils coercion helper (TDD)', () => {
  it('coerces numeric-like strings to numbers', () => {
    expect(coerceIfNumeric('5')).toBe(5)
    expect(coerceIfNumeric(' 3.14 ')).toBe(3.14)
    expect(coerceIfNumeric('0')).toBe(0)
  })

  it('returns original non-numeric strings unchanged', () => {
    const s = 'abc'
    expect(coerceIfNumeric(s)).toBe(s)
  })

  it('treats NaN, null and undefined as missing (returns null)', () => {
    expect(coerceIfNumeric(NaN)).toBeNull()
    expect(coerceIfNumeric(null)).toBeNull()
    expect(coerceIfNumeric(undefined)).toBeNull()
  })

  it('does not mutate input (immutability)', () => {
    const s = '42'
    const res = coerceIfNumeric(s)
    expect(s).toBe('42')
    expect(res).toBe(42)
  })
})

// Tests for numeric coercion helpers (coerceIfNumeric, tryCoerceNumber)
// Ensure strings/numbers/NaN/null handling aligns with expectations.

import { describe, it, expect } from 'vitest'
import { coerceIfNumeric } from '../../src/lib/dataUtils'

// Numeric coercion helper tests.
// Purpose: explain how strings and special values are mapped to numbers or treated as missing.
describe('dataUtils coercion helper', () => {
  it('converts numeric-like strings to numbers (trimming whitespace)', () => {
    expect(coerceIfNumeric('5')).toBe(5)
    expect(coerceIfNumeric(' 3.14 ')).toBe(3.14)
    expect(coerceIfNumeric('0')).toBe(0)
  })

  it('leaves non-numeric strings unchanged', () => {
    const s = 'abc'
    expect(coerceIfNumeric(s)).toBe(s)
  })

  it('treats NaN/null/undefined as missing (returns null)', () => {
    // intent: these values are considered absent for numerical operations
    expect(coerceIfNumeric(NaN)).toBeNull()
    expect(coerceIfNumeric(null)).toBeNull()
    expect(coerceIfNumeric(undefined)).toBeNull()
  })

  it('does not mutate the original input (immutability)', () => {
    const s = '42'
    const res = coerceIfNumeric(s)
    expect(s).toBe('42')
    expect(res).toBe(42)
  })
})

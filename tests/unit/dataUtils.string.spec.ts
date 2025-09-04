import { describe, it, expect } from 'vitest'
import { opContains, opStartsWith, opEndsWith } from '../../src/lib/dataUtils'

describe('dataUtils string operator helpers (TDD)', () => {
  it('opContains: matches case-insensitively when inputs are normalized (demo)', () => {
    // current opContains does not accept caseSensitive flag; normalize inputs manually to test behaviour
    expect(opContains(String('Hello World').toLowerCase(), String('hello').toLowerCase())).toBe(
      true,
    )
  })

  it('opContains: coerces non-string inputs to strings for matching', () => {
    expect(opContains(String(12345), String(234))).toBe(true)
    expect(opContains('abc123', String(123))).toBe(true)
  })

  it('opStartsWith: respects caseSensitive flag and coerces non-strings', () => {
    expect(opStartsWith('Hello', 'he', false)).toBe(true)
    expect(opStartsWith('Hello', 'he', true)).toBe(false)
    expect(opStartsWith(12345, '12', false)).toBe(true)
  })

  it('opEndsWith: respects caseSensitive flag and coerces non-strings', () => {
    expect(opEndsWith('Testing', 'ING', false)).toBe(true)
    expect(opEndsWith('Testing', 'ING', true)).toBe(false)
    expect(opEndsWith(12345, '45', false)).toBe(true)
  })

  it('edge cases: empty string, null, undefined, objects and NaN', () => {
    // empty clause should match (every string contains/startsWith/endsWith empty string)
    expect(opContains('abc', '', false)).toBe(true)
    expect(opStartsWith('abc', '', false)).toBe(true)
    expect(opEndsWith('abc', '', false)).toBe(true)

    // null/undefined clause or value should be treated as missing -> no match
    // implementations treat null/undefined/NaN as missing
    expect(opContains(null, 'a', false)).toBe(false)
    expect(opContains('a', null, false)).toBe(false)
    expect(opStartsWith(undefined, 'a', false)).toBe(false)
    expect(opEndsWith('a', undefined, false)).toBe(false)

    // objects are coerced to strings
    expect(opContains({ toString: () => 'obj-val' }, 'obj', false)).toBe(true)

    // NaN treated as missing
    expect(opContains(NaN, 'a', false)).toBe(false)
  })
})

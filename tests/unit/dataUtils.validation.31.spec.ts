import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { applyFilters } from '../../src/lib/dataUtils'

describe('dataUtils validation behavior (Task 31)', () => {
  let rows: Array<Record<string, unknown>>
  let warnSpy: any

  beforeEach(() => {
    rows = [
      { id: 1, a: 1 },
      { id: 2, a: 2 },
    ]
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('warns and ignores clause missing column', () => {
    // @ts-expect-error - testing malformed clause
    const out = applyFilters(rows, [{ operator: 'eq', value: 1 }])
    expect(warnSpy).toHaveBeenCalled()
    // clause ignored -> all rows retained
    expect(out.length).toBe(rows.length)
  })

  it('warns and ignores clause with non-string operator', () => {
    // @ts-expect-error - testing malformed clause
    const out = applyFilters(rows, [{ column: 'a', operator: 123, value: 1 }])
    expect(warnSpy).toHaveBeenCalled()
    expect(out.length).toBe(rows.length)
  })
})

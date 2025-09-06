import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { applyFilters } from '../../src/lib/dataUtils'

describe('dataUtils validation (Task 30)', () => {
  let rows: Array<Record<string, unknown>>
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    rows = [
      { id: 1, a: 1 },
      { id: 2, a: 2 },
      { id: 3, a: NaN },
      { id: 4, a: '2' },
    ]
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('unknown operator should be ignored with a dev warning', () => {
    const filter = [{ column: 'a', operator: 'bogus', value: 1 }]
    const out = applyFilters(rows, filter)
    expect(warnSpy).toHaveBeenCalled()
    // clause ignored -> all rows retained
    expect(out.length).toBe(rows.length)
  })

  it('malformed between clause should be ignored with a dev warning', () => {
    const filter = [{ column: 'a', operator: 'between', value: [1] }]
    const out = applyFilters(rows, filter)
    expect(warnSpy).toHaveBeenCalled()
    // clause ignored -> all rows retained
    expect(out.length).toBe(rows.length)
  })

  it('in with non-array should be treated as equality (no warning)', () => {
    const filter = [{ column: 'a', operator: 'in', value: '2' }]
    const out = applyFilters(rows, filter)
    // opIn falls back to equality for non-array values
    expect(warnSpy).not.toHaveBeenCalled()
    // should match the numeric 2 and string '2' (coercion)
    expect(out.map((r) => r.id).sort()).toEqual([2, 4])
  })

  it('NaN is treated as missing (eq does not match NaN)', () => {
    const filter = [{ column: 'a', operator: 'eq', value: NaN }]
    const out = applyFilters(rows, filter)
    // NaN treated as missing -> no rows match
    expect(out.length).toBe(0)
  })
})

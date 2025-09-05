import { describe, it, expect } from 'vitest'
import { sampleRows, sampleColumns } from '../utils/fixtures'
import { ariaSortAttr } from '../utils/aria-utils'

describe('test infra fixtures', () => {
  it('fixtures have expected shape', () => {
    expect(Array.isArray(sampleRows)).toBe(true)
    expect(sampleRows.length).toBeGreaterThan(0)
    expect(sampleColumns.find((c) => c.key === 'name')).toBeTruthy()
  })

  it('aria helper maps directions', () => {
    expect(ariaSortAttr('asc')).toBe('ascending')
    expect(ariaSortAttr('desc')).toBe('descending')
    expect(ariaSortAttr(null)).toBe('none')
  })
})

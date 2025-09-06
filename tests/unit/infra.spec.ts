// Infra tests validating test environment helpers and global setup

import { describe, it, expect } from 'vitest'
import { sampleRows, sampleColumns } from '../utils/fixtures'
import { ariaSortAttr } from '../utils/aria-utils'

// Infra tests: document what the test fixtures provide and small helper behavior.
// These are basic sanity checks so tests fail early if helpers change shape.
describe('test infra fixtures and helpers', () => {
  it('sample fixture data has expected shape and basic keys', () => {
    expect(Array.isArray(sampleRows)).toBe(true)
    expect(sampleRows.length).toBeGreaterThan(0)
    expect(sampleColumns.find((c) => c.key === 'name')).toBeTruthy()
  })

  it('ariaSortAttr helper maps internal directions to aria values', () => {
    // intent: ensure accessibility helper returns standard ARIA values
    expect(ariaSortAttr('asc')).toBe('ascending')
    expect(ariaSortAttr('desc')).toBe('descending')
    expect(ariaSortAttr(null)).toBe('none')
  })
})

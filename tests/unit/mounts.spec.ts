// Tests for the mounts helper utilities used in component tests

import { describe, it, expect } from 'vitest'
import { mountWithSgGrid } from '../utils/mounts'

// Tests for mounting helpers used in component tests. These ensure the test
// helpers produce a usable wrapper and convenience helpers for querying headers.
describe('mount helper utilities', () => {
  it('mountWithSgGrid returns a wrapper and helper to get header cells', () => {
    const { wrapper, headerCells } = mountWithSgGrid()
    expect(wrapper.exists()).toBe(true)
    const heads = headerCells()
    expect(Array.isArray(heads)).toBe(true)
  })
})

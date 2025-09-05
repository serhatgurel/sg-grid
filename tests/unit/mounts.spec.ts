import { describe, it, expect } from 'vitest'
import { mountWithSgGrid } from '../utils/mounts'

describe('mount helper', () => {
  it('mounts SgGrid and exposes headerCells', () => {
    const { wrapper, headerCells } = mountWithSgGrid()
    expect(wrapper.exists()).toBe(true)
    const heads = headerCells()
    expect(Array.isArray(heads)).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { mountWithDefaults } from '../utils/test-utils'

describe('test-utils helper', () => {
  it('mounts a basic component with defaults', () => {
    const Comp = {
      template: '<div><slot>hello</slot></div>',
    }
    const wrapper = mountWithDefaults(Comp)
    expect(wrapper.html()).toContain('hello')
  })
})

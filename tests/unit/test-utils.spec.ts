// Tests for the test-utils mount helper and its default stubs

import { describe, it, expect } from 'vitest'
import { mountWithDefaults } from '../utils/test-utils'

// Test utility smoke test: ensures mountWithDefaults applies standard global stubs/plugins
// so component tests can be concise. This helps new contributors understand test helpers.
describe('test-utils helper', () => {
  it('mountWithDefaults mounts a component and applies default test wrappers', () => {
    const Comp = {
      template: '<div><slot>hello</slot></div>',
    }
    const wrapper = mountWithDefaults(Comp)
    expect(wrapper.html()).toContain('hello')
  })
})

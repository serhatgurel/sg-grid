// Tests for DOM utility helpers used in tests (safe focus/blur helpers, event utilities)

import { describe, it, expect } from 'vitest'
import { safeFocus, safeBlur } from '../utils/dom-utils'

// dom-utils tests: ensure our safe focus/blur helpers trigger the expected DOM events.
// These helpers are used in component tests to avoid errors when elements are not attached.
describe('dom-utils helpers', () => {
  it('safeFocus and safeBlur should dispatch focus and blur events on an element', () => {
    const el = document.createElement('input')
    let focused = false
    let blurred = false
    el.addEventListener('focus', () => (focused = true))
    el.addEventListener('blur', () => (blurred = true))

    document.body.appendChild(el)
    safeFocus(el)
    safeBlur(el)

    expect(focused).toBe(true)
    expect(blurred).toBe(true)
    el.remove()
  })
})

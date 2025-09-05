import { describe, it, expect } from 'vitest'
import { safeFocus, safeBlur } from '../utils/dom-utils'

describe('dom-utils', () => {
  it('safeFocus and safeBlur dispatch events', () => {
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

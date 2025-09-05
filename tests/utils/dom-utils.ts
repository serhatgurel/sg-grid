/**
 * DOM test helpers
 * Small utilities to make JSDOM focus/blur and event testing less flaky.
 */
export function safeFocus(el: HTMLElement | null) {
  if (!el) return
  try {
    el.focus()
    // programmatic focus in JSDOM doesn't always emit events; dispatch to be safe
    const ev = new Event('focus', { bubbles: false })
    el.dispatchEvent(ev)
  } catch {
    // ignore
  }
}

export function safeBlur(el: HTMLElement | null) {
  if (!el) return
  try {
    el.blur()
    const ev = new Event('blur', { bubbles: false })
    el.dispatchEvent(ev)
  } catch {
    // ignore
  }
}

export default { safeFocus, safeBlur }

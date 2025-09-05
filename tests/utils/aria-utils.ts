/**
 * Small helpers to compute expected ARIA attributes for header elements.
 * These are intentionally tiny and test-focused.
 */
export function ariaSortAttr(direction: 'asc' | 'desc' | 'none' | null) {
  if (!direction || direction === 'none') return 'none'
  if (direction === 'asc') return 'ascending'
  return 'descending'
}

export default { ariaSortAttr }

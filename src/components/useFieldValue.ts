// Utility to resolve nested field paths like 'phone[0].number' or 'address[0].country.code'
export function getFieldValue(obj: unknown, path: unknown): unknown {
  // gracefully handle missing inputs
  if (!obj || path === undefined || path === null) return undefined
  // coerce non-string path values to string when possible (e.g., number -> '0')
  const pathStr = String(path)
  if (!pathStr) return undefined
  // Split path by dot, but handle brackets for arrays
  const parts = pathStr.replace(/\[(\d+)\]/g, '.$1').split('.')
  let value: unknown = obj
  for (const part of parts) {
    if (value == null) return undefined
    if (typeof value === 'object' && value !== null) {
      value = (value as Record<string | number, unknown>)[part]
    } else {
      return undefined
    }
  }
  return value
}

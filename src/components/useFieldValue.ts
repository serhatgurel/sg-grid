// Utility to resolve nested field paths like 'phone[0].number' or 'address[0].country.code'
export function getFieldValue(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined
  // Split path by dot, but handle brackets for arrays
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
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

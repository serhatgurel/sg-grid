// Utility to resolve nested field paths like 'phone[0].number' or 'address[0].country.code'
export function getFieldValue(obj: any, path: string): any {
  if (!obj || !path) return undefined
  // Split path by dot, but handle brackets for arrays
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let value = obj
  for (const part of parts) {
    if (value == null) return undefined
    value = value[part]
  }
  return value
}

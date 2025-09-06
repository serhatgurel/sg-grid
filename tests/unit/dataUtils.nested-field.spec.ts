import { describe, it, expect } from 'vitest'
import { applySort, applyFilters } from '../../src/lib/dataUtils'

describe('applySort with nested field paths and function fields', () => {
  it('sorts by nested string path (bracket + dot)', () => {
    const rows = [
      { id: 1, address: [{ country: { code: 'US' } }] },
      { id: 2, address: [{ country: { code: 'CA' } }] },
      { id: 3, address: [{ country: { code: 'BR' } }] },
    ]
    const columns = [{ key: 'countryCode', field: 'address[0].country.code', caption: 'Code' }]

    const asc = applySort(rows, [{ column: 'countryCode', direction: 'asc' }], columns)
    expect(asc.map((r) => r.id)).toEqual([3, 2, 1]) // BR, CA, US

    const desc = applySort(rows, [{ column: 'countryCode', direction: 'desc' }], columns)
    expect(desc.map((r) => r.id)).toEqual([1, 2, 3]) // US, CA, BR
  })

  it('sorts by function field defined on ColumnDef', () => {
    const rows = [
      { id: 1, first: 'John', last: 'Z' },
      { id: 2, first: 'Amy', last: 'A' },
      { id: 3, first: 'Amy', last: 'B' },
    ]
    const columns = [
      {
        key: 'fullname',
        field: (r: Record<string, unknown>) => `${String(r.first ?? '')} ${String(r.last ?? '')}`,
        caption: 'Full',
      },
    ]

    const asc = applySort(rows, [{ column: 'fullname', direction: 'asc' }], columns)
    expect(asc.map((r) => r.id)).toEqual([2, 3, 1])
  })

  it("sorts by quoted bracket key like address['home'].street", () => {
    const rows = [
      { id: 1, address: { home: { street: 'Z Road' } } },
      { id: 2, address: { home: { street: 'A Lane' } } },
      { id: 3, address: { home: { street: 'M Blvd' } } },
    ]
    const columns = [{ key: 'street', field: "address['home'].street", caption: 'Street' }]

    const asc = applySort(rows, [{ column: 'street', direction: 'asc' }], columns)
    expect(asc.map((r) => r.id)).toEqual([2, 3, 1])
  })

  it('applyFilters: filters by nested string path', () => {
    const rows = [
      { id: 1, address: [{ city: 'Old Town' }] },
      { id: 2, address: [{ city: 'A Lane' }] },
      { id: 3, address: [{ city: 'Main Blvd' }] },
    ]
    const columns = [{ key: 'city', field: 'address[0].city', caption: 'City' }]
    const res = applyFilters(
      rows,
      [{ column: 'city', operator: 'contains', value: 'Lane' }],
      columns,
    )
    expect(res.map((r) => r.id)).toEqual([2])
  })

  it("applyFilters: filters by quoted bracket key like address['home'].street", () => {
    const rows = [
      { id: 1, address: { home: { street: 'Z Road' } } },
      { id: 2, address: { home: { street: 'A Lane' } } },
      { id: 3, address: { home: { street: 'M Blvd' } } },
    ]
    const columns = [{ key: 'street', field: "address['home'].street", caption: 'Street' }]
    const res = applyFilters(
      rows,
      [{ column: 'street', operator: 'contains', value: 'Lane' }],
      columns,
    )
    expect(res.map((r) => r.id)).toEqual([2])
  })
})

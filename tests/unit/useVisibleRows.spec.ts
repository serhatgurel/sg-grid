import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import type { Row } from '../../src/lib/dataUtils'
import { useVisibleRows } from '../../src/composables/useVisibleRows'

const rows: Row[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 35 },
]

describe('useVisibleRows composable - filterMode & fast-fail', () => {
  it('fast-fail: empty filter and sort returns shallow copy', () => {
    const rowsRef = ref(rows)
    const filterRef = ref(null)
    const sortRef = ref(null)
    const { visible } = useVisibleRows({ rows: rowsRef, filter: filterRef, sort: sortRef })
    const v = visible.value
    expect(v).not.toBe(rows)
    expect(v).toEqual(rows)
  })

  it('filterMode: and combines filters (intersection)', () => {
    const rows2: Row[] = [
      { id: 1, name: 'Alice', age: 30, active: true },
      { id: 2, name: 'Bob', age: 25, active: false },
      { id: 3, name: 'Al', age: 35, active: true },
    ]
    const rowsRef = ref(rows2)
    const filterRef = ref([
      { column: 'name', operator: 'contains', value: 'Al' },
      { column: 'active', operator: 'eq', value: true },
    ])
    const sortRef = ref(null)
    const filterMode = ref<'and' | 'or'>('and')
    const { visible } = useVisibleRows({
      rows: rowsRef,
      filter: filterRef,
      sort: sortRef,
      filterMode,
    })
    expect(visible.value.map((r) => r.id)).toEqual(
      [1, 3]
        .filter((id) => id === 1 || id === 3)
        .filter((id) => id === 1 || id === 3)
        .filter(Boolean),
    )
  })

  it('filterMode: or combines filters (union)', () => {
    const rows2: Row[] = [
      { id: 1, name: 'Alice', age: 30, active: true },
      { id: 2, name: 'Bob', age: 25, active: false },
      { id: 3, name: 'Al', age: 35, active: true },
    ]
    const rowsRef = ref(rows2)
    const filterRef = ref([
      { column: 'name', operator: 'contains', value: 'Al' },
      { column: 'active', operator: 'eq', value: false },
    ])
    const sortRef = ref(null)
    const filterMode = ref<'and' | 'or'>('or')
    const { visible } = useVisibleRows({
      rows: rowsRef,
      filter: filterRef,
      sort: sortRef,
      filterMode,
    })
    // expected union: rows matching name contains 'Al' -> id 1 and 3; active eq false -> id 2 => union [1,3,2]
    expect(visible.value.map((r) => r.id).sort()).toEqual([1, 2, 3])
  })
})

// Unit tests for the useVisibleRows composable verifying filter/sort orchestration and fast-fail

import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import type { Row } from '../../src/lib/dataUtils'
import { useVisibleRows } from '../../src/composables/useVisibleRows'

// Tests for the useVisibleRows composable which applies filtering and sorting to rows.
// These tests explain fast-path behavior (no filter/sort) and how filterMode combines clauses.
const rows: Row[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 35 },
]

describe('useVisibleRows composable - behavior and filterMode', () => {
  it('fast-path: when there are no filter/sort rules the visible rows are a shallow copy of input', () => {
    // intent: avoid unnecessary processing and ensure immutability
    const rowsRef = ref(rows)
    const filterRef = ref(null)
    const sortRef = ref(null)
    const { visible } = useVisibleRows({ rows: rowsRef, filter: filterRef, sort: sortRef })
    const v = visible.value
    expect(v).not.toBe(rows)
    expect(v).toEqual(rows)
  })

  it('filterMode "and" requires rows to match all filter clauses (intersection)', () => {
    // intent: explain that AND mode intersects filter results
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
    // expected intersection: rows matching both clauses -> ids 1 and 3
    expect(visible.value.map((r) => r.id).sort()).toEqual([1, 3])
  })

  it('filterMode "or" returns rows matching any clause (union)', () => {
    // intent: OR mode unions matching rows across clauses
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
    // expected union result includes ids 1,2,3
    expect(visible.value.map((r) => r.id).sort()).toEqual([1, 2, 3])
  })
})

<template>
  <div style="padding: 16px; font-family: ui-sans-serif, system-ui">
    <h2>Filter & Sort Playground</h2>
    <div style="display: flex; gap: 12px; align-items: center; margin: 12px 0">
      <label>
        Column:
        <select v-model="filterColumn">
          <option value="name">name</option>
          <option value="age">age</option>
        </select>
      </label>

      <label>
        Operator:
        <select v-model="filterOp">
          <option value="contains">contains</option>
          <option value="eq">eq</option>
          <option value="ne">ne</option>
          <option value="startsWith">startsWith</option>
          <option value="endsWith">endsWith</option>
          <option value="in">in</option>
          <option value="between">between</option>
          <option value="lt">lt</option>
          <option value="lte">lte</option>
          <option value="gt">gt</option>
          <option value="gte">gte</option>
        </select>
      </label>

      <label>
        Value:
        <input v-model="filterValue" :placeholder="valuePlaceholder" />
      </label>

      <label style="display: flex; align-items: center; gap: 6px">
        <input type="checkbox" v-model="caseSensitive" />
        <span>caseSensitive</span>
      </label>

      <label>
        Value type:
        <select v-model="filterValueType">
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="nan">NaN</option>
          <option value="null">null</option>
        </select>
      </label>

      <label
        >Sort by:
        <select v-model="sortKey">
          <option value="">(none)</option>
          <option value="age">age</option>
          <option value="name">name</option>
        </select>
      </label>

      <label
        >Direction:
        <select v-model="sortDir">
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </label>
    </div>

    <table class="playground-table" border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>age</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in visible" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.name }}</td>
          <td>{{ r.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import people from './people.json'
import { useVisibleRows } from '../composables/useVisibleRows'
import type { ColumnDef } from '../components/types'

// Minimal local type for the demo dataset so SFC type-checking is happy
interface Person {
  id: string
  title?: string
  gender?: string
  firstName?: string
  lastName?: string
  age?: number
  email?: string
  [k: string]: unknown
}

const filterColumn = ref<'name' | 'age'>('name')
const filterOp = ref('contains')
const filterValue = ref('')
const filterValueType = ref<'string' | 'number' | 'nan' | 'null'>('string')
const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

// cast via unknown to avoid unsafe `any` and to align JSON typing with Person
const rows = ref<Person[]>(people as unknown as Person[])

// derive a stable display name for the demo from firstName + lastName
function displayName(p: Person): string {
  const fn = p.firstName || ''
  const ln = p.lastName || ''
  const combined = `${fn} ${ln}`.trim()
  if (combined) return combined
  // fall back to id or email
  return (p.email as string) || p.id
}

const valuePlaceholder = computed(() => {
  if (filterOp.value === 'in') return 'comma-separated values, e.g. a,b,c'
  if (filterOp.value === 'between') return 'two values separated by comma, e.g. 1,10'
  return 'value'
})

const filtersRef = computed(() => {
  if (!filterValue.value) return null

  // parse operator-specific input shapes
  let val: unknown = filterValue.value

  if (filterOp.value === 'in') {
    // split CSV and trim
    val = filterValue.value.split(',').map((s) => s.trim())
  } else if (filterOp.value === 'between') {
    val = filterValue.value.split(',').map((s) => s.trim())
  } else if (filterValueType.value === 'number') {
    const n = Number(filterValue.value)
    val = Number.isNaN(n) ? NaN : n
  } else if (filterValueType.value === 'nan') {
    val = NaN
  } else if (filterValueType.value === 'null') {
    val = null
  }

  // for 'in' and 'between', coerce numeric-looking strings to numbers when type=number
  if (
    (filterOp.value === 'in' || filterOp.value === 'between') &&
    filterValueType.value === 'number' &&
    Array.isArray(val)
  ) {
    val = (val as string[]).map((s) => {
      const n = Number(s)
      return Number.isNaN(n) ? s : n
    })
  }

  return [{ column: filterColumn.value, operator: filterOp.value, value: val }]
})

const sortRef = computed(() =>
  sortKey.value ? [{ column: sortKey.value, direction: sortDir.value }] : null,
)

// The composable expects rows with arbitrary columns; for the demo we map
// visible rows to expose a `name` property used by filter/sort when `column==='name'`.
const computedRows = computed(() => rows.value.map((r) => ({ ...r, name: displayName(r) })))
const caseSensitive = ref(false)

// Demonstration columns with column-level hooks for filter/sort overrides
const columns = ref<ColumnDef[]>([
  {
    key: 'name',
    field: 'name',
    // demo filterFunction: case-insensitive contains using clause.value
    filterFunction: (cellValue: unknown, clauseValue: unknown) => {
      if (cellValue === null || cellValue === undefined) return false
      if (clauseValue === null || clauseValue === undefined) return false
      return String(cellValue).toLowerCase().includes(String(clauseValue).toLowerCase())
    },
  },
  {
    key: 'age',
    field: 'age',
    // demo sortFunction: numeric comparator
    sortFunction: (a: unknown, b: unknown) => {
      const an = typeof a === 'number' ? a : Number(a)
      const bn = typeof b === 'number' ? b : Number(b)
      return an - bn
    },
  },
])

const { visible } = useVisibleRows({
  rows: computedRows as unknown as Ref<ReadonlyArray<Record<string, unknown>>>,
  filter: filtersRef,
  sort: sortRef,
  columns,
  caseSensitive,
})
</script>

<style scoped>
.playground-table {
  border-collapse: collapse;
  border: 1px solid #d1d5db; /* subtle gray border */
}
.playground-table th,
.playground-table td {
  border: 1px solid #d1d5db;
  padding: 6px;
  text-align: left;
}
.playground-table th {
  background-color: #f9fafb; /* very light gray background for headers */
  font-weight: 600;
}
</style>

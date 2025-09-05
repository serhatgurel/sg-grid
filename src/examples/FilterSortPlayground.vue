<template>
  <div style="padding: 16px; font-family: ui-sans-serif, system-ui">
    <h2>Filter & Sort Playground</h2>
    <div style="display: flex; gap: 12px; align-items: center; margin: 12px 0">
      <label style="display: flex; align-items: center; gap: 6px">
        <input type="checkbox" v-model="serverSide" />
        <span>serverSide</span>
      </label>

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

    <SgGrid
      :columns="columns"
      :rows="serverSide ? computedRows : visible"
      :rowKey="'id'"
      :serverSide="serverSide"
      :sort="sortRef"
      :filter="filtersRef"
      @request:page="onRequestPage"
      @update:sort="onUpdateSort"
      @update:filter="onUpdateFilter"
    />
    <div style="margin-top: 12px; font-size: 13px; color: #374151">
      <div>
        Server-side demo: check the <strong>serverSide</strong> box, then use the header controls to
        trigger <code>request:page</code> events which the playground will handle and update rows.
      </div>
      <div style="margin-top: 6px">
        Keyboard: column headers are focusable when sortable — focus a header and press
        <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle sort.
      </div>
      <div v-if="lastRequest" style="margin-top: 6px">
        Last request:
        <pre style="white-space: pre-wrap">{{ JSON.stringify(lastRequest, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import people from './people.json'
import { useVisibleRows } from '../composables/useVisibleRows'
import { applyFilters, applySort } from '../lib/dataUtils'
import type { FilterClause, SortClause } from '../lib/dataUtils'
// ...existing code...
import type { ColumnDef } from '../components/types'
import SgGrid from '../components/SgGrid.vue'

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
    sortable: true,
    filterable: true,
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
    sortable: true,
    filterable: true,
    inputType: 'number',
    // demo sortFunction: numeric comparator
    sortFunction: (a: unknown, b: unknown) => {
      const an = typeof a === 'number' ? a : Number(a)
      const bn = typeof b === 'number' ? b : Number(b)
      return an - bn
    },
  },
])

// server-side demo handling
const serverSide = ref(false)
const lastRequest = ref<unknown | null>(null)

function onRequestPage(payload: unknown) {
  lastRequest.value = payload
  // simulate a server response: apply filters/sort on the server and replace rows
  try {
    const p = payload as unknown as { filter?: unknown; sort?: unknown }
    const serverFilter = (p.filter ?? null) as FilterClause[] | null
    const serverSort = (p.sort ?? null) as SortClause[] | null
    const base = rows.value.map((r) => ({ ...r, name: displayName(r) }))
    const filtered = serverFilter
      ? applyFilters(base, serverFilter, columns.value, { caseSensitive: caseSensitive.value })
      : base
    const sorted = serverSort ? applySort(filtered, serverSort, columns.value) : filtered
    // replace rows with server-provided page (no real pagination slicing for simplicity)
    rows.value = sorted as Person[]
  } catch {
    // ignore errors in demo
  }
}

function onUpdateSort(s: unknown) {
  // reflect sort change in UI and record last request
  lastRequest.value = { type: 'update:sort', payload: s }
  // if in client-side mode, apply the sort to the playground controls so useVisibleRows updates
  if (!serverSide.value) {
    try {
      const arr = (s as SortClause[] | null) ?? null
      if (arr && arr.length > 0) {
        sortKey.value = String(arr[0].column)
        sortDir.value = (arr[0].direction as 'asc' | 'desc') ?? 'asc'
      } else {
        sortKey.value = ''
      }
    } catch {
      /* ignore */
    }
  }
}

function onUpdateFilter(f: unknown) {
  lastRequest.value = { type: 'update:filter', payload: f }
  // if in client-side mode, reflect the filter in the playground controls so useVisibleRows updates
  if (!serverSide.value) {
    try {
      const arr = (f as FilterClause[] | null) ?? null
      if (arr && arr.length > 0) {
        const clause = arr[0]
        filterColumn.value = clause.column as 'name' | 'age'
        filterOp.value = String(clause.operator)
        const v = clause.value
        if (Array.isArray(v)) filterValue.value = (v as unknown[]).join(',')
        else if (v === null) filterValue.value = ''
        else if (typeof v === 'number' && Number.isNaN(v)) filterValue.value = 'NaN'
        else filterValue.value = String(v)
      } else {
        filterValue.value = ''
      }
    } catch {
      /* ignore */
    }
  }
}

// wire client-side visible rows (used when not serverSide)
const { visible } = useVisibleRows({
  rows: computedRows as unknown as any,
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

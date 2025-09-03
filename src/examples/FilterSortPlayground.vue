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
          <option value="lt">lt</option>
          <option value="lte">lte</option>
          <option value="gt">gt</option>
          <option value="gte">gte</option>
        </select>
      </label>

      <label>
        Value:
        <input v-model="filterValue" placeholder="value" />
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

    <table border="1" cellpadding="6" cellspacing="0">
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

const filtersRef = computed(() =>
  filterValue.value
    ? [{ column: filterColumn.value, operator: filterOp.value, value: filterValue.value }]
    : null,
)

const sortRef = computed(() =>
  sortKey.value ? [{ column: sortKey.value, direction: sortDir.value }] : null,
)

// The composable expects rows with arbitrary columns; for the demo we map
// visible rows to expose a `name` property used by filter/sort when `column==='name'`.
const computedRows = computed(() => rows.value.map((r) => ({ ...r, name: displayName(r) })))
const { visible } = useVisibleRows({
  rows: computedRows as unknown as Ref<ReadonlyArray<Record<string, unknown>>>,
  filter: filtersRef,
  sort: sortRef,
})
</script>

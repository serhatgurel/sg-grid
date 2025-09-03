<template>
  <div style="padding: 16px; font-family: ui-sans-serif, system-ui">
    <h2>Filter & Sort Playground</h2>
    <div style="display: flex; gap: 12px; align-items: center; margin: 12px 0">
      <label
        >Filter by name contains:
        <input v-model="filterText" placeholder="substring" />
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
import { ref, computed } from 'vue'
import people from './people.json'
import { applyFilters, applySort } from '../lib/dataUtils'

const filterText = ref('')
const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

const rows = people as Array<Record<string, any>>

const visible = computed(() => {
  const filters = filterText.value
    ? [{ column: 'name', operator: 'contains', value: filterText.value }]
    : null
  const sorted = sortKey.value
    ? applySort(rows, [{ column: sortKey.value, direction: sortDir.value }])
    : rows.slice()
  return applyFilters(sorted, filters)
})
</script>

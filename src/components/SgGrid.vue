<template>
  <table>
    <caption v-if="props.caption">
      {{
        props.caption
      }}
    </caption>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in props.rows || []" :key="getRowKey(row)">
        <sg-column
          v-for="column in columns"
          :key="`${getRowKey(row)}-${column.key}`"
          :data-row="row"
          :data-field="column.field"
          :label="column.label"
        />
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
// no runtime imports needed in this component script
import { computed, useSlots } from 'vue'
import type { SgGridPropTypes, ColumnDef, RowData } from './types'
import SgColumn from '../components/SgColumn.vue'

// Use the exported static prop interface for accurate typing in the template
const props = defineProps<SgGridPropTypes>()

// Read any declarative <SgColumn> children from the default slot and
// treat them as user-declared columns. The grid will infer any remaining
// columns from the row data (union of keys from rows) and append them.
const slots = useSlots()

const declaredColumns = computed<ColumnDef[]>(() => {
  const nodes = slots.default ? slots.default() : []
  const cols: ColumnDef[] = []
  for (const vnode of nodes) {
    // vnode.props may contain camelCased or kebab-cased attributes
    const p = vnode.props || {}
    const field = p.dataField ?? p['data-field'] ?? p.field
    if (!field) continue
    const key = p.key ?? field
    const label = p.label ?? String(field)
    cols.push({ key, field, label })
  }
  return cols
})

const inferredColumns = computed<ColumnDef[]>(() => {
  const rows = props.rows || []
  if (!rows.length) return []
  // Build a set of all keys from the first row (sensible heuristic) but
  // fallback to union of all rows for safety.
  const keys = new Set<string>()
  for (const r of rows) Object.keys(r || {}).forEach((k) => keys.add(k))
  return Array.from(keys).map((k) => ({ key: k, field: k, label: k }))
})

const columns = computed<ColumnDef[]>(() => {
  const declared = declaredColumns.value
  if (declared.length > 0) return declared
  return inferredColumns.value
})

function getRowKey(row: RowData) {
  if (!props.rowKey) return JSON.stringify(row)
  if (typeof props.rowKey === 'function') return String(props.rowKey(row))
  return String(row[props.rowKey as string])
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>

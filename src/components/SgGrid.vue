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
import { computed, useSlots } from 'vue'
import type { SgGridPropTypes, ColumnDef, RowData } from './types'
import SgColumn from './SgColumn.vue'

const props = defineProps<SgGridPropTypes>()

const slots = useSlots()

const declaredColumns = computed<ColumnDef[]>(() => {
  const nodes = slots.default ? slots.default() : []
  const cols: ColumnDef[] = []
  for (const vnode of nodes) {
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
  const keys = new Set<string>()
  for (const r of rows) Object.keys(r || {}).forEach((k) => keys.add(k))
  return Array.from(keys).map((k) => ({ key: k, field: k, label: k }))
})

// Priority: explicit props.columns -> declared slot columns -> inferred columns
const columns = computed<ColumnDef[]>(() => {
  if (props.columns && props.columns.length > 0) return props.columns
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

<template>
  <table class="sg-grid-table">
    <caption v-if="props.caption">
      {{
        props.caption
      }}
    </caption>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ column.caption ?? column.field }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in props.rows || []" :key="getRowKey(row)">
        <sg-column
          v-for="column in columns"
          :key="`${getRowKey(row)}-${column.key}`"
          :data-row="row"
          :data-field="column.field"
          :caption="column.caption"
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
  for (const vNode of nodes) {
    const p = vNode.props || {}
    const field = p.dataField ?? p['data-field'] ?? p.field
    if (!field) continue
    const key = p.key ?? field
    const caption = p.caption ?? String(field)
    cols.push({ key, field, caption })
  }
  return cols
})

const inferredColumns = computed<ColumnDef[]>(() => {
  const rows = props.rows || []
  if (!rows.length) return []
  const keys = new Set<string>()
  for (const r of rows) Object.keys(r || {}).forEach((k) => keys.add(k))
  return Array.from(keys).map((k) => ({ key: k, field: k, caption: k }))
})

// Priority: explicit props.columns -> declared slot columns -> inferred columns
// Use caption only; do not reference legacy keys.
const columns = computed<ColumnDef[]>(() => {
  if (props.columns && props.columns.length > 0) {
    // Ensure every supplied column has a caption (derived from caption, field, or key)
    return props.columns.map((c) => {
      const maybe = c as unknown as Record<string, unknown>
      const captionFromC = typeof maybe.caption === 'string' ? (maybe.caption as string) : undefined
      const fieldOrKey =
        typeof maybe.field === 'string'
          ? maybe.field
          : typeof maybe.key === 'string'
            ? maybe.key
            : ''
      const caption = captionFromC ?? String(fieldOrKey)
      return { ...c, caption }
    })
  }
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

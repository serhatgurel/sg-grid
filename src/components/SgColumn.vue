<template>
  <td class="sg-cell" :style="cellStyle">
    <slot v-bind="slotProps">{{ defaultDisplay }}</slot>
  </td>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { getFieldValue } from './useFieldValue'

import type { FieldPath } from './types'
const props = defineProps({
  dataField: { type: [String, Function] as PropType<FieldPath>, required: true },
  dataRow: { type: Object as () => Record<string, unknown> | undefined },
  id: { type: String },
  caption: { type: String },
  width: { type: [String, Number] as PropType<string | number> },
  align: { type: String as PropType<'left' | 'center' | 'right'> },
  value: { type: null as unknown as PropType<unknown> },
})

// resolvedValue supports function or string for dataField
const resolvedValue = computed(() => {
  if (!props.dataRow) return props.value
  if (typeof props.dataField === 'function') {
    // If dataField is a function, call it with the row
    return props.dataField(props.dataRow)
  }
  // Otherwise, treat as string path
  return getFieldValue(props.dataRow, props.dataField)
})

// columnData mirrors the structure from SgColumn and uses the resolved value
const columnData = computed(() => ({
  id: props.id,
  // prefer `caption` for the human readable column name
  name: props.caption,
  value: resolvedValue.value,
  dataRow: props.dataRow,
  dataField: props.dataField,
  width: props.width,
  align: props.align,
}))

// Provide defensive copies for slot props so slot implementations cannot
// accidentally mutate the parent/internal objects. We use JSON-based cloning
// which is sufficient for the simple POJO shapes used by the grid (no funcs,
// no circular refs). This keeps nested objects (like dataRow) isolated from
// mutations inside slots while keeping the API shape intact.
const slotProps = computed(() => {
  const dataClone = columnData.value ? JSON.parse(JSON.stringify(columnData.value)) : undefined
  const rowClone = props.dataRow ? JSON.parse(JSON.stringify(props.dataRow)) : undefined
  return {
    data: dataClone,
    name: props.dataField,
    row: rowClone,
    field: props.dataField,
    // prefer the cloned snapshot's own `value` when the snapshot contains
    // the property (even if it's null). The previous nullish-coalescing
    // allowed `null` (from JSON-cloning NaN) to fall back to the original
    // resolvedValue which could be NaN again. Use a hasOwnProperty check
    // so slots receive the snapshot's value when present.
    value:
      dataClone && Object.prototype.hasOwnProperty.call(dataClone, 'value')
        ? (dataClone as Record<string, unknown>).value
        : resolvedValue.value,
  }
})

const defaultDisplay = computed(() => {
  const v = columnData.value?.value ?? resolvedValue.value
  // treat missing, null, or numeric NaN as empty/missing display
  if (v === undefined || v === null) return ''
  if (typeof v === 'number' && Number.isNaN(v)) return ''
  return String(v)
})

const cellStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.width !== undefined && props.width !== null) {
    // Treat explicit zero widths as a request to hide the column.
    if (typeof props.width === 'number') {
      if (props.width === 0) s.display = 'none'
      else s.width = `${props.width}px`
    } else {
      const w = String(props.width).trim().toLowerCase()
      if (w === '0' || w === '0px') s.display = 'none'
      else s.width = String(props.width)
    }
  }
  if (props.align) s.textAlign = props.align
  return s
})
</script>

<style scoped></style>

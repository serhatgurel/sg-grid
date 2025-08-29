<template>
  <td style="padding: 8px; border: 1px solid #eee">
    <!-- expose both old APIs: `data/name` and `row/field/value` -->
    <slot v-bind="slotProps">{{ defaultDisplay }}</slot>
  </td>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'

const props = defineProps({
  dataField: { type: String, required: true },
  dataRow: { type: Object as () => Record<string, unknown> | undefined },
  id: { type: String },
  caption: { type: String },
  value: { type: null as unknown as PropType<unknown> },
  label: { type: String },
})

// columnData mirrors the structure from SgColumn and prefers values from dataRow when present
const columnData = computed(() => ({
  id: props.id,
  name: props.caption ?? props.label,
  value: props.dataRow ? props.dataRow[props.dataField as string] : props.value,
  dataRow: props.dataRow,
  dataField: props.dataField,
}))

// cellValue mirrors the lightweight lookup from SgDeclarativeColumn
const cellValue = computed(() => {
  if (!props.dataRow) return props.value
  const row = props.dataRow as Record<string, unknown>
  const key = props.dataField as keyof Record<string, unknown>
  return row[key]
})

// slotProps provides both APIs so existing consumers keep working
const slotProps = computed(() => ({
  data: columnData.value,
  name: props.dataField,
  row: props.dataRow,
  field: props.dataField,
  value: cellValue.value,
}))

// default display keeps a sensible fallback (empty string when no value)
const defaultDisplay = computed(() => {
  const v = columnData.value?.value ?? cellValue.value
  if (v === undefined || v === null) return ''
  return String(v)
})
</script>

<style scoped></style>

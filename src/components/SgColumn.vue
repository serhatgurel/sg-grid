<template>
  <td class="sg-cell">
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
}))

const slotProps = computed(() => ({
  data: columnData.value,
  name: props.dataField,
  row: props.dataRow,
  field: props.dataField,
  value: resolvedValue.value,
}))

const defaultDisplay = computed(() => {
  const v = columnData.value?.value ?? resolvedValue.value
  if (v === undefined || v === null) return ''
  return String(v)
})
</script>

<style scoped></style>

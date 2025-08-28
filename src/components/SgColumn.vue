<template>
  <td style="padding: 8px; border: 1px solid #eee">
    <slot :row="dataRow" :field="dataField" :value="cellValue">{{ cellValue ?? '' }}</slot>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  dataField: { type: String, required: true },
  dataRow: { type: Object as () => Record<string, unknown> | undefined },
  label: { type: String },
})

const dataRow = props.dataRow as Record<string, unknown> | undefined

const cellValue = computed(() => {
  if (!dataRow) return undefined
  const key = props.dataField as keyof Record<string, unknown>
  return dataRow[key]
})
</script>

<style scoped></style>

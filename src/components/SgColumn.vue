<template>
  <td style="padding: 8px; border: 1px solid #eee;">
    <slot :data="columnData">{{ columnData.value ?? 'No Value' }}</slot>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  dataField: { type: String },
  dataRow: { type: Object },
  id: { type: String },
  caption: { type: String },
  value: { type: String },
})

const columnData = computed(() => ({
  id: props.id,
  name: props.caption,
  value: props.value,
  dataRow: props.dataRow,
  dataField: props.dataField,
}))
if (props.dataRow) {
  columnData.value.value = props.dataRow[props.dataField as string]
}
</script>

<style scoped></style>

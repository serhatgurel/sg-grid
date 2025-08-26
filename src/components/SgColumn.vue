<template>
  <div>
    <slot :data="columnData">{{ columnData.value ?? '****' }}</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  dataField: { type: String },
  dataRow: { type: Object },
  id: { type: [String, Number] },
  name: { type: String },
  value: { type: [Number, String] },
  age: { type: Number },
})

// Expose a plain object to slots. If `value` isn't provided but `age` is,
// derive value from age so `v-bind="row"` (which has `age`) still works.
const columnData = computed(() => ({
  id: props.id,
  name: props.name,
  // prefer explicit value prop, fallback to age
  value: props.value ?? props.age,
  // keep age for consumers who need it
  age: props.age,
  dataRow: props.dataRow,
  dataField: props.dataField,
}))
if (props.dataRow) {
  columnData.value.value = props.dataRow[props.dataField as string]
}
</script>

<style scoped></style>

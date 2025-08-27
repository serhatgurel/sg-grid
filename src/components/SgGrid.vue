<template>
  Row Count: {{ props.rows?.length ?? 0 }}
  <table v-if="$slots.default">
    <thead>
      <tr>
        <th v-for="column in props.columns" :key="column.key">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in props.rows" :key="row[props.rowKey]">
        <sg-column
          v-for="column in props.columns"
          :key="column.key"
          :data-row="row"
          :data-field="column.field"
          :label="column.label"
        ></sg-column>
      </tr>
    </tbody>
  </table>
  <span v-else>
    <table>
      <thead>
        <tr>
          <th v-for="column in props.columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in props.rows" :key="row[props.rowKey]">
          <sg-column
            v-for="column in props.columns"
            :key="column.key"
            :data-row="row"
            :data-field="column.field"
            :label="column.label"
          ></sg-column>
        </tr>
      </tbody>
    </table>
  </span>
</template>

<script setup lang="ts">
// no runtime imports needed in this component script
import type { SgGridPropTypes } from './types'
import SgColumn from '../components/SgColumn.vue'

// Use the exported static prop interface for accurate typing in the template
const props = defineProps<SgGridPropTypes>()
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

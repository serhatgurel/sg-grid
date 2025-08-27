<template>
    <table>
      <caption v-if="props.caption"> {{ props.caption }} </caption>
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

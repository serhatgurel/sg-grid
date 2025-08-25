<script setup lang="ts">
import SgGrid from '../components/SgGrid.vue'
import SgColumn from '../components/SgColumn.vue'
import SgHeader from '../components/SgHeader.vue'

const rows = [
  { id: 'r1', name: 'Alice', age: 30, birthdate: '1993-01-01' },
  { id: 'r2', name: 'Bob', age: 25, birthdate: '1998-01-01' },
  { id: 'r3', name: 'Charlie', age: 35, birthdate: '1988-01-01' },
  { id: 'r4', name: 'David', age: 40, birthdate: '1983-01-01' },
]

const columns = [
  { key: 'name', field: 'name', label: 'Name', width: '200px' },
  { key: 'age', field: 'age', label: 'Age', width: '60px' },
  { key: 'birthdate', field: 'birthdate', label: 'Birthdate', width: '120px' },
]

function onRowClick() {
  // noop
}
</script>

<template>
  <h3>Declarative example</h3>
  <SgGrid :data="rows" rowKey="id" @row-click="onRowClick">
    <SgColumn data-field="name">
      <SgHeader data-field="name" label="Name" />
    </SgColumn>
    <SgColumn data-field="age">
      <SgHeader data-field="age" label="Age" />
    </SgColumn>
    <SgColumn data-field="birthdate">
      <SgHeader data-field="birthdate" label="Birthdate" />
    </SgColumn>
  </SgGrid>

  <h3>Props-based example</h3>
  <SgGrid :columns="columns" :rows="rows" rowKey="id" @row-click="onRowClick" />
</template>

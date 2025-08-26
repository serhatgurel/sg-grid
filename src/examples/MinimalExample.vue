<script setup lang="ts">
import SgGrid from '../components/SgGrid.vue'
import SgColumn from '../components/SgColumn.vue'
import { computed, ref } from 'vue'
import rowsJson from './rows.json'

interface RowDef {
  id?: string
  name?: string
  age?: number
  birthdate?: string
  lastname?: string
  title?: string
  gender?: string
  phone?: string
  email?: string
  job?: string
  salary?: number
}

const rows = computed(() => rowsJson as Array<Partial<RowDef>>)

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
  <SgColumn :id="33" :name="'Serhat Gurel'" :value="102" v-slot="colProps"
    >{{ colProps.data.name }} - {{ colProps.data.value }}</SgColumn
  >
  <hr />

  <h3>Declarative example</h3>
  <SgGrid :data="rows" rowKey="id" @row-click="onRowClick">
    <SgColumn v-bind="rows[1]" />
    <SgColumn v-bind="rows[2]" />
    <SgColumn v-bind="rows[3]" />
    <SgColumn>{{ rows[2].name }}</SgColumn>

    <SgColumn :data-row="rows[3]" data-field="id" label="Id" />
    <SgColumn :data-row="rows[3]" data-field="title" label="Title" />
    <SgColumn :data-row="rows[3]" data-field="name" label="Name" />
    <SgColumn :data-row="rows[3]" data-field="lastname" label="Lastname" />
    <SgColumn :data-row="rows[3]" data-field="age" label="Age" />
    <SgColumn :data-row="rows[3]" data-field="birthdate" label="Birthdate" />
    <SgColumn :data-row="rows[3]" data-field="email" label="Email" />
  </SgGrid>

  <h3>Props-based example</h3>
  <SgGrid :columns="columns" :rows="rows" rowKey="id" @row-click="onRowClick" />
</template>

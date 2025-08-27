<script setup lang="ts">
import SgGrid from '../components/SgGrid.vue'
import SgColumn from '../components/SgColumn.vue'
import SgTable from '../components/SgTable.vue'
import { computed } from 'vue'
import rowsJson from './rows.json'

interface RowDef {
  id?: string
  firstName?: string
  age?: number
  birthdate?: string
  lastName?: string
  title?: string
  gender?: string
  phone?: string
  email?: string
  job?: string
  salary?: number
}

const rows = computed(() => rowsJson as Array<Partial<RowDef>>)
const fiveRows = computed(() => rows.value.slice(0, 5));

const columns = [
  { key: 'title', field: 'title', label: 'Title', width: '200px' },
  { key: 'firstName', field: 'firstName', label: 'First Name', width: '200px' },
  { key: 'lastName', field: 'lastName', label: 'Last Name', width: '200px' },
  { key: 'age', field: 'age', label: 'Age', width: '60px' },
  { key: 'birthdate', field: 'birthdate', label: 'Birthdate', width: '120px' },
  { key: 'gender', field: 'gender', label: 'Gender', width: '120px' },
  { key: 'phone', field: 'phone', label: 'Phone', width: '120px' },
  { key: 'email', field: 'email', label: 'Email', width: '200px' },
  { key: 'salary', field: 'salary', label: 'Salary', width: '120px' },
  { key: 'job', field: 'job', label: 'Job', width: '200px' },
]
</script>

<template>
  <!-- 
   <h3>Just a column</h3>
  <SgColumn>{{ rows[2].title }} {{ rows[2].firstName }} {{ rows[2].lastName }}</SgColumn> 
  -->
  <hr />
  <h3>Declarative example</h3>
  <SgGrid :rows="rows.slice(0, 5)" rowKey="id" @row-click="() => {}">
    <SgColumn data-field="id" label="Id" />
    <SgColumn data-field="title" label="Title" />
    <SgColumn data-field="firstName" label="First Name" />
    <SgColumn data-field="lastName" label="Last Name" />
    <SgColumn data-field="age" label="Age" />
    <SgColumn data-field="birthdate" label="Birthdate" />
    <SgColumn data-field="email" label="Email" />
  </SgGrid>
  <hr />

  <h3>Props-based example</h3>
  <SgGrid :columns="columns" :rows="rows.slice(0, 8)" rowKey="id" @row-click="() => {}" />

  <hr />
  <SgTable :fields="columns" :items="rows.slice(20, 25)" :caption=" 'User Information' "></SgTable>
</template>

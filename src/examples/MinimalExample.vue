<script setup lang="ts">
import { computed } from 'vue'
import rowsJson from './people.json'
import SgGrid from '@/components/SgGrid.vue'
import SgColumn from '@/components/SgColumn.vue'

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

// rowsJson is declared as a generic Record in the project's JSON shim.
// Cast via `unknown` first to safely assert the correct array shape for this example.
const rows = computed(() => rowsJson as unknown as Array<Partial<RowDef>>)

const columns = [
  { key: 'title', field: 'title', caption: 'Title', width: '200px' },
  { key: 'firstName', field: 'firstName', caption: 'First Name', width: '200px' },
  { key: 'lastName', field: 'lastName', caption: 'Last Name', width: '200px' },
  { key: 'age', field: 'age', caption: 'Age', width: '60px' },
  { key: 'birthdate', field: 'birthdate', caption: 'Birthdate', width: '120px' },
  { key: 'gender', field: 'gender', caption: 'Gender', width: '120px' },
  { key: 'phone', field: 'phone[0].number', caption: 'Phone', width: '120px' },
  { key: 'email', field: 'email', caption: 'Email', width: '200px' },
  { key: 'salary', field: 'salary', caption: 'Salary', width: '120px' },
  { key: 'job', field: 'job', caption: 'Job', width: '200px' },
  { key: 'exclamation', field: (row: Partial<RowDef>) => (row.firstName ? row.firstName + '!' : ''), caption: 'Exclamation', width: '120px' },
]
</script>

<template>
  <!--
    <h3>Just a column</h3>
    <SgColumn>{{ rows[2].title }} {{ rows[2].firstName }} {{ rows[2].lastName }}</SgColumn>
  -->

  <SgGrid :rows="rows.slice(0, 5)" rowKey="id" caption="DECLARATIVE EXAMPLE">
    <SgColumn data-field="id" caption="Id" />
    <SgColumn data-field="title" caption="Title" />
    <SgColumn data-field="firstName" caption="First Name" />
    <SgColumn data-field="lastName" caption="Last Name" />
    <SgColumn data-field="email" caption="Email" />
    <SgColumn data-field="phone[0].type" caption="Phone" />
  </SgGrid>

  <SgGrid :rows="rows.slice(0, 3)" rowKey="id" caption="* DECLARATIVE EXAMPLE NO CAPTION *">
    <SgColumn data-field="id" />
    <SgColumn data-field="firstName" />
    <SgColumn data-field="lastName" />
    <SgColumn data-field="email" />
    <SgColumn data-field="job" />
  </SgGrid>

  <SgGrid :rows="rows.slice(0, 3)" rowKey="id" caption="* DECLARATIVE EXAMPLE WITH CAPTION *">
    <SgColumn data-field="id" caption="Id" />
    <SgColumn data-field="firstName" caption="First Name" />
    <SgColumn data-field="lastName" caption="Last Name" />
    <SgColumn data-field="email" caption="Email" />
    <SgColumn data-field="job" caption="Job" />
    <SgColumn data-field="salary" caption="Salary" />
    <SgColumn data-field="phone[0].number" caption="Phone" />
    <SgColumn data-field="address[0].country.code" caption="Country" />
    <SgColumn :data-field="(row) => (row.firstName ? row.firstName + '@' : '')" caption="Exclamation" />
  </SgGrid>

  <SgGrid :columns="columns" :rows="rows.slice(0, 8)" rowKey="id" caption="PROPS BASED EXAMPLE" />
</template>

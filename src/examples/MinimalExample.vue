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
  { key: 'title', field: 'title', caption: 'Title', width: '2px' },
  { key: 'firstName', field: 'firstName', caption: 'First Name', width: '50px' },
  { key: 'lastName', field: 'lastName', caption: 'Last Name', width: '200px' },
  { key: 'age', field: 'age', caption: 'Age', width: '60px' },
  { key: 'birthdate', field: 'birthdate', caption: 'Birthdate', width: '120px' },
  { key: 'gender', field: 'gender', caption: 'Gender', width: '120px' },
  { key: 'phone', field: 'phone[0].number', caption: 'Phone', width: '120px' },
  { key: 'email', field: 'email', caption: 'Email', width: '200px' },
  { key: 'salary', field: 'salary', caption: 'Salary', width: '120px' },
  { key: 'job', field: 'job', caption: 'Job', width: '200px' },
  // example of percentage width
  { key: 'country', field: 'address[0].country.code', caption: 'Country', width: '10%' },
  {
    key: 'exclamation',
    field: (row: Partial<RowDef>) => (row.firstName ? row.firstName + '!' : ''),
    caption: 'Exclamation',
    width: '120px',
  },
]
</script>

<template>
  <!--
    <h3>Just a column</h3>
    <SgColumn>{{ rows[2].title }} {{ rows[2].firstName }} {{ rows[2].lastName }}</SgColumn>
  -->

  <SgGrid
    :rows="
      rows
        .slice(0, 5)
        .map((r) => ({
          id: r.id,
          title: r.title,
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
        }))
    "
    rowKey="id"
    caption="NO COLUMNS EXAMPLE"
  />

  <SgGrid rowKey="id" caption="NO ROWS EXAMPLE">
    <SgColumn data-field="id" caption="Id" width="60px" />
    <SgColumn data-field="title" caption="Title" width="10px" />
    <SgColumn data-field="firstName" caption="First Name" width="100px" />
    <SgColumn data-field="lastName" caption="Last Name" width="200px" />
    <SgColumn data-field="email" caption="Email" width="200px" />
    <SgColumn data-field="phone[0].type" caption="Phone" width="120px" />
    <SgColumn data-field="address[0].country.code" caption="Country" width="10%" />
  </SgGrid>

  <SgGrid rowKey="id" caption="NO ROWS OR COLUMNS EXAMPLE" />

  <SgGrid :rows="rows.slice(0, 5)" rowKey="id" caption="DECLARATIVE EXAMPLE">
    <SgColumn data-field="id" caption="Id" width="60px" />
    <SgColumn data-field="title" caption="Title" width="10px" />
    <SgColumn data-field="firstName" caption="First Name" width="100px" />
    <SgColumn data-field="lastName" caption="Last Name" width="200px" />
    <SgColumn data-field="email" caption="Email" width="200px" />
    <SgColumn data-field="phone[0].type" caption="Phone" width="120px" />
    <SgColumn data-field="address[0].country.code" caption="Country" width="10%" />
  </SgGrid>

  <SgGrid :rows="rows.slice(0, 3)" rowKey="id" caption="* DECLARATIVE EXAMPLE NO CAPTION *">
    <SgColumn data-field="id" width="60px" />
    <SgColumn data-field="firstName" width="100px" />
    <SgColumn data-field="lastName" width="200px" />
    <SgColumn data-field="email" width="200px" />
    <SgColumn data-field="job" width="200px" />
  </SgGrid>

  <SgGrid :rows="rows.slice(0, 3)" rowKey="id" caption="* DECLARATIVE EXAMPLE WITH CAPTION *">
    <SgColumn data-field="id" caption="Id" width="60px" />
    <SgColumn data-field="firstName" caption="First Name" width="100px" />
    <SgColumn data-field="lastName" caption="Last Name" width="200px" />
    <SgColumn data-field="email" caption="Email" width="200px" />
    <SgColumn data-field="job" caption="Job" width="200px" />
    <SgColumn data-field="salary" caption="Salary" width="120px" />
    <SgColumn data-field="phone[0].number" caption="Phone" width="120px" />
    <SgColumn data-field="address[0].country.code" caption="Country" width="10%" />
    <SgColumn
      :data-field="(row) => (row.firstName ? row.firstName + '@' : '')"
      caption="Exclamation"
      width="120px"
    />
  </SgGrid>

  <SgGrid :columns="columns" :rows="rows.slice(0, 8)" rowKey="id" caption="PROPS BASED EXAMPLE" />

  <!-- Simple server-side demo: grid emits request:page which the host can handle -->
  <SgGrid
    :columns="columns"
    :rows="rows.slice(0, 5)"
    rowKey="id"
    caption="SERVER-SIDE DEMO"
    :serverSide="true"
    @request:page="onRequestPage"
  />
</template>

function onRequestPage(payload: unknown) { // Demo handler: in a real app you would query a server
using payload.page/pageSize/sort/filter // For this minimal example we do nothing (playground shows
a richer server-side demo). // Keeping a no-op handler ensures the template reference type-checks.
// eslint-disable-next-line no-console console.debug('MinimalExample: request:page payload',
payload) }

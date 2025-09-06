<template>
  <div
    style="
      padding: 16px;
      font-family: ui-sans-serif, system-ui;
      display: flex;
      flex-direction: column;
      gap: 18px;
    "
  >
    <h2 class="page-title">Full Feature Demo</h2>

    <div>
      <SgGrid :rows="rows.slice(0, 8)" rowKey="id" caption="Declarative Full Columns Example">
        <SgColumn data-field="id" caption="Id" width="60px" />
        <SgColumn data-field="title" caption="Title" width="60px" />
        <SgColumn data-field="firstName" caption="First Name" width="120px" />
        <SgColumn data-field="middleName" caption="Middle" width="100px" />
        <SgColumn data-field="lastName" caption="Last Name" width="140px" />
        <SgColumn data-field="nickname" caption="Nickname" width="120px" />
        <SgColumn data-field="suffix" caption="Suffix" width="60px" />
        <SgColumn data-field="gender" caption="Gender" width="60px" />
        <SgColumn data-field="age" caption="Age" width="60px" />
        <SgColumn data-field="birthdate" caption="Birthdate" width="110px" />
        <SgColumn data-field="married" caption="Marital" width="100px" />
        <SgColumn data-field="spouse" caption="Spouse" width="160px" />
        <SgColumn data-field="phone[0].number" caption="Phone" width="140px" />
        <SgColumn data-field="phone[0].type" caption="Phone Type" width="90px" />
        <SgColumn data-field="address[0].street" caption="Street" width="180px" />
        <SgColumn data-field="address[0].city" caption="City" width="120px" />
        <SgColumn data-field="address[0].state" caption="State" width="100px" />
        <SgColumn data-field="address[0].zip" caption="Zip" width="100px" />
        <SgColumn data-field="address[0].country.name" caption="Country" width="140px" />
        <SgColumn data-field="email" caption="Email" width="220px" />
        <SgColumn data-field="job" caption="Job" width="200px" />
        <SgColumn data-field="salary" caption="Salary" width="110px" />
        <SgColumn data-field="hobbies" caption="Hobbies" width="220px" />
        <SgColumn data-field="skills" caption="Skills" width="160px" />
        <SgColumn data-field="languages" caption="Languages" width="140px" />
        <SgColumn data-field="pets[0].name" caption="Pet" width="110px" />
        <SgColumn
          :data-field="
            (row) =>
              Array.isArray(row.kids)
                ? row.kids
                    .map((k) => k.name ?? '')
                    .filter((n) => n)
                    .join(', ')
                : ''
          "
          caption="Kids"
          width="140px"
        />
        <SgColumn data-field="personalityType" caption="Personality" width="110px" />
        <SgColumn data-field="certifications" caption="Certs" width="140px" />
        <SgColumn data-field="memberships" caption="Memberships" width="180px" />
      </SgGrid>
    </div>

    <div>
      <SgGrid
        :rows="rows.slice(0, 12)"
        :columns="columns"
        rowKey="id"
        caption="Props-based Full Columns Example"
      />
    </div>

    <div>
      <ExampleTabs
        :notes="notes"
        :changelog="changelog"
        title="FullDemo Changelog"
        aria-label="Full demo views"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SgGrid from '@/components/SgGrid.vue'
import SgColumn from '@/components/SgColumn.vue'
import ExampleTabs from '@/components/ExampleTabs.vue'
import rowsJson from './people.json'

// cast via unknown to satisfy JSON shim typing
const rows = computed(() => rowsJson as unknown as Array<Record<string, unknown>>)

// load the changelog kept alongside the demo
import fullChangelogRaw from './FullDemo.changelog.md?raw'
const changelog =
  (typeof fullChangelogRaw === 'string' && fullChangelogRaw) || 'No changelog available.'

// load notes kept alongside the demo
import fullNotesRaw from './FullDemo.notes.md?raw'
const notes = (typeof fullNotesRaw === 'string' && fullNotesRaw) || 'No notes available.'

// Note: ExampleTabs manages its own internal selection. We no longer keep an example-level selectedView.

// helper: join arrays into comma lists for display using field functions
function joinArrayField(key: string) {
  return (row: Record<string, unknown>) => {
    const v = row[key] as unknown
    if (Array.isArray(v)) return (v as unknown[]).map((x) => String(x ?? '')).join(', ')
    return String(v ?? '')
  }
}

const columns = [
  { key: 'id', field: 'id', caption: 'Id', width: '60px' },
  {
    key: 'name',
    field: (r: Record<string, unknown>) =>
      `${String((r as Record<string, unknown>)['firstName'] ?? '')} ${String(
        (r as Record<string, unknown>)['lastName'] ?? '',
      )}`.trim(),
    caption: 'Name',
    width: '180px',
  },
  { key: 'title', field: 'title', caption: 'Title', width: '60px' },
  { key: 'age', field: 'age', caption: 'Age', width: '60px', inputType: 'number' },
  { key: 'birthdate', field: 'birthdate', caption: 'Birthdate', width: '110px' },
  { key: 'email', field: 'email', caption: 'Email', width: '220px' },
  { key: 'phone', field: 'phone[0].number', caption: 'Phone', width: '140px' },
  { key: 'country', field: 'address[0].country.code', caption: 'Country', width: '80px' },
  { key: 'job', field: 'job', caption: 'Job', width: '200px' },
  { key: 'salary', field: 'salary', caption: 'Salary', width: '110px' },
  { key: 'hobbies', field: joinArrayField('hobbies'), caption: 'Hobbies', width: '220px' },
  { key: 'skills', field: joinArrayField('skills'), caption: 'Skills', width: '160px' },
  { key: 'languages', field: joinArrayField('languages'), caption: 'Languages', width: '140px' },
  { key: 'pets', field: 'pets[0].name', caption: 'Pet', width: '110px' },
  {
    key: 'kids',
    field: (r: Record<string, unknown>) => {
      const kids = (r as Record<string, unknown>)['kids'] as unknown
      if (Array.isArray(kids)) {
        return (kids as unknown[])
          .map((k) => {
            const name = (k as Record<string, unknown>)['name']
            return name ? String(name) : ''
          })
          .filter(Boolean)
          .join(', ')
      }
      return ''
    },
    caption: 'Kids',
    width: '140px',
  },
  { key: 'personalityType', field: 'personalityType', caption: 'Personality', width: '110px' },
  {
    key: 'certifications',
    field: joinArrayField('certifications'),
    caption: 'Certs',
    width: '140px',
  },
  {
    key: 'memberships',
    field: joinArrayField('memberships'),
    caption: 'Memberships',
    width: '180px',
  },
]
</script>

<style scoped>
h2 {
  margin: 0 0 6px 0;
}
h3 {
  margin: 6px 0;
}

.page-title {
  font-size: 1.5rem; /* larger than h3 */
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #0f172a; /* dark slate */
}

/* tabs for notes/changelog */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.tabs button {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #0f172a;
}
.tabs button.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}
.panel h3 {
  margin: 0 0 8px 0;
}
</style>

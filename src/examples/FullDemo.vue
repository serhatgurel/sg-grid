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
        <SgColumn data-field="id" caption="Id" :sortable="true" :filterable="true" />
        <SgColumn data-field="title" caption="Title" :sortable="true" :filterable="true" />
        <SgColumn data-field="firstName" caption="First Name" :sortable="true" :filterable="true" />
        <SgColumn data-field="middleName" caption="Middle" :sortable="true" :filterable="true" />
        <SgColumn data-field="lastName" caption="Last Name" :sortable="true" :filterable="true" />
        <SgColumn data-field="nickname" caption="Nickname" :sortable="true" :filterable="true" />
        <SgColumn data-field="suffix" caption="Suffix" :sortable="true" :filterable="true" />
        <SgColumn data-field="gender" caption="Gender" :sortable="true" :filterable="true" />
        <SgColumn data-field="age" caption="Age" :sortable="true" :filterable="true" />
        <SgColumn data-field="birthdate" caption="Birthdate" :sortable="true" :filterable="true" />
        <SgColumn data-field="married" caption="Marital" :sortable="true" :filterable="true" />
        <SgColumn data-field="spouse" caption="Spouse" :sortable="true" :filterable="true" />
        <SgColumn
          data-field="phone[0].number"
          caption="Phone"
          :sortable="true"
          :filterable="true"
        />
        <SgColumn
          data-field="phone[0].type"
          caption="Phone Type"
          :sortable="true"
          :filterable="true"
        />
        <SgColumn
          data-field="address[0].street"
          caption="Street"
          :sortable="true"
          :filterable="true"
        />
        <SgColumn data-field="address[0].city" caption="City" :sortable="true" :filterable="true" />
        <SgColumn
          data-field="address[0].state"
          caption="State"
          :sortable="true"
          :filterable="true"
        />
        <SgColumn data-field="address[0].zip" caption="Zip" :sortable="true" :filterable="true" />
        <SgColumn
          data-field="address[0].country.name"
          caption="Country"
          :sortable="true"
          :filterable="true"
        />
        <SgColumn data-field="email" caption="Email" :sortable="true" :filterable="true" />
        <SgColumn data-field="job" caption="Job" :sortable="true" :filterable="true" />
        <SgColumn data-field="salary" caption="Salary" :sortable="true" :filterable="true" />
        <SgColumn data-field="hobbies" caption="Hobbies" :sortable="true" :filterable="true" />
        <SgColumn data-field="skills" caption="Skills" :sortable="true" :filterable="true" />
        <SgColumn data-field="languages" caption="Languages" :sortable="true" :filterable="true" />
        <SgColumn data-field="pets[0].name" caption="Pet" :sortable="true" :filterable="true" />
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
          :sortable="true"
        />
        <SgColumn
          data-field="personalityType"
          caption="Personality"
          :sortable="true"
          :filterable="true"
        />
        <SgColumn data-field="certifications" caption="Certs" :sortable="true" :filterable="true" />
        <SgColumn
          data-field="memberships"
          caption="Memberships"
          :sortable="true"
          :filterable="true"
        />
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
  { key: 'id', field: 'id', caption: 'Id', sortable: true, filterable: true },
  {
    key: 'name',
    field: (r: Record<string, unknown>) =>
      `${String((r as Record<string, unknown>)['firstName'] ?? '')} ${String(
        (r as Record<string, unknown>)['lastName'] ?? '',
      )}`.trim(),
    caption: 'Name',
    sortable: true,
    filterable: true,
  },
  {
    key: 'title',
    field: 'title',
    caption: 'Title',
    sortable: true,
    filterable: true,
  },
  {
    key: 'age',
    field: 'age',
    caption: 'Age',
    inputType: 'number',
    sortable: true,
    filterable: true,
  },
  { key: 'birthdate', field: 'birthdate', caption: 'Birthdate', sortable: true, filterable: true },
  {
    key: 'email',
    field: 'email',
    caption: 'Email',
    sortable: true,
    filterable: true,
  },
  { key: 'phone', field: 'phone[0].number', caption: 'Phone', sortable: true, filterable: true },
  {
    key: 'country',
    field: 'address[0].country.code',
    caption: 'Country',
    sortable: true,
    filterable: true,
  },
  { key: 'job', field: 'job', caption: 'Job', sortable: true, filterable: true },
  {
    key: 'salary',
    field: 'salary',
    caption: 'Salary',
    sortable: true,
    filterable: true,
  },
  {
    key: 'hobbies',
    field: joinArrayField('hobbies'),
    caption: 'Hobbies',
    sortable: true,
    filterable: true,
  },
  {
    key: 'skills',
    field: joinArrayField('skills'),
    caption: 'Skills',
    sortable: true,
    filterable: true,
  },
  {
    key: 'languages',
    field: joinArrayField('languages'),
    caption: 'Languages',
    sortable: true,
    filterable: true,
  },
  {
    key: 'pets',
    field: 'pets[0].name',
    caption: 'Pet',
    sortable: true,
    filterable: true,
  },
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
    sortable: true,
    filterable: true,
  },
  {
    key: 'personalityType',
    field: 'personalityType',
    caption: 'Personality',
    sortable: true,
    filterable: true,
  },
  {
    key: 'certifications',
    field: joinArrayField('certifications'),
    caption: 'Certs',
    sortable: true,
    filterable: true,
  },
  {
    key: 'memberships',
    field: joinArrayField('memberships'),
    caption: 'Memberships',
    sortable: true,
    filterable: true,
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

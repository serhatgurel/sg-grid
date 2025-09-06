# Usage examples — quick copyable snippets

Small, copyable snippets that show common wiring patterns for `SgGrid` (sort/filter). These are intentionally minimal; use the playground for interactive experimentation.

## Single-column client-side sort

Pass a `sort` prop (array of clauses) to the grid. In client-side mode the grid will apply the sort when `serverSide` is false.

```vue
<template>
  <SgGrid
    :columns="columns"
    :rows="rows"
    :rowKey="'id'"
    :sort="[{ column: 'age', direction: 'asc' }]"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SgGrid from '@/components/SgGrid.vue'

const rows = ref([
  { id: '1', age: 40 },
  { id: '2', age: 25 },
])
const columns = ref([{ key: 'age', field: 'age', sortable: true }])
</script>
```

## Multi-column sort

Order by `age` ascending then `name` descending by providing multiple clauses (stability is preserved by utilities):

```vue
<SgGrid
  :columns="columns"
  :rows="rows"
  :rowKey="'id'"
  :sort="[
    { column: 'age', direction: 'asc' },
    { column: 'name', direction: 'desc' },
  ]"
/>
```

## Simple `contains` filter (client-side)

Provide a `filter` prop with a clause. The `applyFilters` implementation supports string operators like `contains` and respects column-level `filterFunction` when present.

```vue
<SgGrid
  :columns="columns"
  :rows="rows"
  :rowKey="'id'"
  :filter="[{ column: 'name', operator: 'contains', value: 'Alice' }]"
/>
```

## Server-side request example

When `serverSide` is true the grid emits `request:page` events for the host app to handle. Listen for the event and return a page (or update your rows based on the payload):

```vue
<SgGrid
  :columns="columns"
  :rows="rows"
  :rowKey="'id'"
  :serverSide="true"
  @request:page="onRequestPage"
/>

// ... function onRequestPage(payload) { // payload contains page, pageSize, sort, filter // perform
server query, then update rows with the returned page }
```

Tips

- Use the playground `src/examples/FilterSortPlayground.vue` to experiment with combinations and to see runtime warnings for malformed clauses.
- Prefer `column.sortFunction` and `column.filterFunction` for custom comparisons and matching logic.

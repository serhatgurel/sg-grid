<template>
  <table class="sg-grid-table">
    <caption v-if="props.caption">
      {{
        props.caption
      }}
    </caption>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key" :style="columnStyle(column)">
          <slot name="header" :column="column">
            <div style="display: flex; align-items: center; gap: 6px">
              <span>{{ column.caption ?? column.field }}</span>
              <!-- simple sort toggle button for tests -->
              <button
                v-if="column.sortable"
                data-test-sort-button
                @click="onHeaderSortClick(column, $event)"
              >
                sort
              </button>
              <!-- simple filter input for tests -->
              <input
                v-if="column.filterable"
                data-test-filter-input
                @input="onFilterInput(column, $event)"
              />
            </div>
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in props.rows || []" :key="getRowKey(row)">
        <sg-column
          v-for="column in columns"
          :key="`${getRowKey(row)}-${column.key}`"
          :data-row="row"
          :data-field="column.field"
          :caption="column.caption"
          :width="column.width"
          :align="column.align"
        />
      </tr>
    </tbody>
  </table>
  <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center">
    <button data-test-prev-btn @click="onPrevPage">Prev</button>
    <span data-test-page-indicator>Page: {{ props.page ?? 1 }}</span>
    <button data-test-next-btn @click="onNextPage">Next</button>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { SgGridPropTypes, ColumnDef, RowData } from './types'
import SgColumn from './SgColumn.vue'

const props = defineProps<SgGridPropTypes>()

const slots = useSlots()

const declaredColumns = computed<ColumnDef[]>(() => {
  const nodes = slots.default ? slots.default() : []
  const cols: ColumnDef[] = []
  for (const vNode of nodes) {
    const p = vNode.props || {}
    const field = p.dataField ?? p['data-field'] ?? p.field
    if (!field) continue
    const key = p.key ?? field
    const caption = p.caption ?? String(field)
    // try to read width and align from the declared <SgColumn> vnode props
    const width = p.width ?? p['data-width']
    const align = p.align
    cols.push({ key, field, caption, width, align })
  }
  return cols
})

const inferredColumns = computed<ColumnDef[]>(() => {
  const rows = props.rows || []
  if (!rows.length) return []
  const keys = new Set<string>()
  for (const r of rows) Object.keys(r || {}).forEach((k) => keys.add(k))
  return Array.from(keys).map((k) => ({ key: k, field: k, caption: k }))
})

// Priority: explicit props.columns -> declared slot columns -> inferred columns
// Use caption only; do not reference legacy keys.
const columns = computed<ColumnDef[]>(() => {
  if (props.columns && props.columns.length > 0) {
    // Ensure every supplied column has a caption (derived from caption, field, or key)
    return props.columns.map((c) => {
      const maybe = c as unknown as Record<string, unknown>
      const captionFromC = typeof maybe.caption === 'string' ? (maybe.caption as string) : undefined
      const fieldOrKey =
        typeof maybe.field === 'string'
          ? maybe.field
          : typeof maybe.key === 'string'
            ? maybe.key
            : ''
      const caption = captionFromC ?? String(fieldOrKey)
      // preserve width/align if provided on the column objects
      const width = maybe.width as string | number | undefined
      const align = maybe.align as 'left' | 'center' | 'right' | undefined
      return { ...c, caption, width, align }
    })
  }
  const declared = declaredColumns.value
  if (declared.length > 0) return declared
  return inferredColumns.value
})

const emit = defineEmits(['update:sort', 'update:filter', 'request:page'])

import { ref } from 'vue'
import type { SortClause } from '../lib/dataUtils'

// local sort state for header interactions. Start from provided prop if present.
const localSort = ref<SortClause[]>(
  Array.isArray(props.sort) ? (props.sort as unknown as SortClause[]) : [],
)

function buildPagePayload(overrides: { sort?: unknown; filter?: unknown; page?: number } = {}) {
  return {
    page: overrides.page ?? props.page ?? 1,
    pageSize: props.pageSize ?? 50,
    sort: overrides.sort ?? props.sort ?? localSort.value ?? null,
    filter: overrides.filter ?? props.filter ?? null,
  }
}

function onHeaderSortClick(column: ColumnDef, ev?: MouseEvent) {
  const key = column.key
  const shift = !!ev?.shiftKey

  // find existing index
  const idx = localSort.value.findIndex((s) => s && s.column === key)

  if (!shift) {
    // non-shift: replace with single-column toggled state
    if (idx === -1) {
      localSort.value = [{ column: key, direction: 'asc' }]
    } else {
      const cur = localSort.value[idx]
      if (cur.direction === 'asc') localSort.value = [{ column: key, direction: 'desc' }]
      else localSort.value = []
    }
  } else {
    // shift: modify multi-sort array
    if (idx === -1) {
      localSort.value.push({ column: key, direction: 'asc' })
    } else {
      const cur = localSort.value[idx]
      if (cur.direction === 'asc') localSort.value[idx] = { column: key, direction: 'desc' }
      else localSort.value.splice(idx, 1)
    }
  }

  emit('update:sort', JSON.parse(JSON.stringify(localSort.value)))

  if (props.serverSide) {
    emit('request:page', buildPagePayload({ sort: localSort.value }))
  }
}

function onFilterInput(column: ColumnDef, ev: Event) {
  const input = ev.target as HTMLInputElement
  const value = input.value
  const payload = [{ column: column.key, operator: 'contains', value }]
  emit('update:filter', payload)
  if (props.serverSide) {
    emit('request:page', buildPagePayload({ filter: payload }))
  }
}

function onPrevPage() {
  const cur = props.page ?? 1
  const next = Math.max(1, cur - 1)
  if (props.serverSide) {
    emit(
      'request:page',
      buildPagePayload({ ...{}, sort: localSort.value, filter: props.filter ?? null, page: next }),
    )
  }
}

function onNextPage() {
  const cur = props.page ?? 1
  const next = cur + 1
  if (props.serverSide) {
    emit(
      'request:page',
      buildPagePayload({ ...{}, sort: localSort.value, filter: props.filter ?? null, page: next }),
    )
  }
}

function columnStyle(col: ColumnDef | undefined) {
  if (!col) return undefined
  const style: Record<string, string> = {}
  if (col.width !== undefined && col.width !== null) {
    if (typeof col.width === 'number') {
      if (col.width === 0) style.display = 'none'
      else style.width = `${col.width}px`
    } else {
      const w = String(col.width).trim().toLowerCase()
      if (w === '0' || w === '0px') style.display = 'none'
      else style.width = String(col.width)
    }
  }
  if (col.align) style.textAlign = col.align
  return style
}

function getRowKey(row: RowData) {
  if (!props.rowKey) return JSON.stringify(row)
  if (typeof props.rowKey === 'function') return String(props.rowKey(row))
  return String(row[props.rowKey as string])
}
</script>

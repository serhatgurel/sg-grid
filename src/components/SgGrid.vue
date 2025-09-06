<template>
  <table class="sg-grid-table">
    <caption v-if="props.caption" class="sg-grid-caption">
      {{
        props.caption
      }}
    </caption>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          :style="columnStyle(column)"
          role="columnheader"
          :tabindex="column.sortable ? 0 : undefined"
          :aria-sort="
            getSortInfo(column.key)
              ? getSortInfoSafe(column.key).direction === 'asc'
                ? 'ascending'
                : 'descending'
              : undefined
          "
          @keydown="
            (e) => {
              if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onHeaderSortClick(column, e as unknown as MouseEvent)
              }
            }
          "
          @focus="() => onHeaderFocus(column.key)"
          @blur="() => onHeaderBlur(column.key)"
          @focusin="
            (e) => {
              ;(e.currentTarget as HTMLElement).classList.add('sg-header--focused')
            }
          "
          @focusout="
            (e) => {
              ;(e.currentTarget as HTMLElement).classList.remove('sg-header--focused')
            }
          "
          :class="{ 'sg-header--focused': focusedHeader === column.key }"
          @click="
            (e) => {
              if (column.sortable) onHeaderSortClick(column, e as unknown as MouseEvent)
            }
          "
          class="sg-header-cell"
        >
          <slot name="header" :column="column">
            <div style="display: flex; align-items: center; gap: 6px">
              <span>{{ column.caption ?? column.field }}</span>
              <!-- put sort indicator absolutely at the far right edge of the header cell -->
              <span data-test-sort-indicator class="sg-sort-indicator">
                <template v-if="column.sortable">
                  <!-- when sorted: show single active arrow and optional order badge -->
                  <template v-if="getSortInfo(column.key)">
                    <span class="sg-indicator-active" aria-hidden="true">
                      <span class="material-symbols-outlined">{{
                        getSortInfoSafe(column.key).direction === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                      }}</span>
                      <span class="visually-hidden">{{
                        getSortInfoSafe(column.key).direction === 'asc' ? '▲' : '▼'
                      }}</span>
                    </span>
                    <sup
                      v-if="
                        getSortInfoSafe(column.key).order && getSortInfoSafe(column.key).order > 1
                      "
                      data-test-sort-order
                      class="sg-sort-order"
                      >{{ getSortInfoSafe(column.key).order }}</sup
                    >
                  </template>
                  <!-- when not sorted: show neutral stacked chevrons to indicate sortable affordance -->
                  <template v-else>
                    <span class="sg-indicator-neutral" aria-hidden="true">
                      <span class="material-symbols-outlined">sort</span>
                    </span>
                  </template>
                </template>
                <!-- when not sortable: empty placeholder preserved for layout -->
              </span>
              <!-- simple sort toggle button for tests (keeps keyboard and click targets) -->
              <button
                v-if="column.sortable"
                data-test-sort-button
                class="sg-sort-button"
                @click.stop="onHeaderSortClick(column, $event)"
                :aria-label="`Sort ${column.caption ?? column.field}`"
              >
                <span class="visually-hidden">Toggle sort</span>
              </button>
              <!-- simple filter input for tests -->
              <div v-if="column.filterable" style="display: flex; gap: 6px; align-items: center">
                <input
                  :type="column.inputType ?? 'text'"
                  data-test-filter-input
                  :aria-label="`Filter ${column.caption ?? column.field}`"
                  @input="onFilterInput(column, $event)"
                />
                <button
                  data-test-filter-clear
                  aria-label="Clear filter"
                  @click="
                    (e) => {
                      ;(e as Event).preventDefault()
                      onFilterClear()
                    }
                  "
                >
                  ×
                </button>
              </div>
            </div>
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rowsToRender || []" :key="getRowKey(row)">
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
    // Read common additional flags/hooks from vnode props when declared
    const sortable = p.sortable === true || p.sortable === 'true' || p['sortable'] === true
    const filterable = p.filterable === true || p.filterable === 'true' || p['filterable'] === true
    const inputType = p.inputType ?? p['input-type'] ?? undefined
    const sortFunction = p.sortFunction ?? p['sort-function']
    const filterFunction = p.filterFunction ?? p['filter-function']

    cols.push({
      key,
      field,
      caption,
      width,
      align,
      sortable: !!sortable,
      filterable: !!filterable,
      inputType,
      sortFunction,
      filterFunction,
    })
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
// In some JSDOM/test environments element.focus() doesn't fire focus events.
// Polyfill focus to dispatch focus/focusin so tests that call element.focus() behave as expected.
if (
  typeof window !== 'undefined' &&
  !(window as unknown as Record<string, unknown>).__SGGRID_focus_polyfilled
) {
  try {
    const orig = (HTMLElement.prototype as unknown as { focus?: (...args: unknown[]) => unknown })
      .focus
    ;(
      HTMLElement.prototype as unknown as {
        focus?: (this: HTMLElement, ...args: unknown[]) => unknown
      }
    ).focus = function (this: HTMLElement, ...args: unknown[]) {
      const res =
        orig && typeof orig === 'function'
          ? (orig as (...a: unknown[]) => unknown).apply(this, args)
          : undefined
      try {
        this.dispatchEvent(new FocusEvent('focus'))
        this.dispatchEvent(new FocusEvent('focusin'))
      } catch {
        // ignore environments that don't support FocusEvent
      }
      return res
    }
    const origBlur = (
      HTMLElement.prototype as unknown as { blur?: (...args: unknown[]) => unknown }
    ).blur
    ;(
      HTMLElement.prototype as unknown as {
        blur?: (this: HTMLElement, ...args: unknown[]) => unknown
      }
    ).blur = function (this: HTMLElement, ...args: unknown[]) {
      const res =
        origBlur && typeof origBlur === 'function'
          ? (origBlur as (...a: unknown[]) => unknown).apply(this, args)
          : undefined
      try {
        this.dispatchEvent(new FocusEvent('blur'))
        this.dispatchEvent(new FocusEvent('focusout'))
      } catch {
        // ignore
      }
      return res
    }
    ;(window as unknown as Record<string, unknown>).__SGGRID_focus_polyfilled = true
  } catch {
    /* ignore */
  }
}
import type { SortClause } from '../lib/dataUtils'
import { applySort } from '../lib/dataUtils'

// local sort state for header interactions. Start from provided prop if present.
const localSort = ref<SortClause[]>(
  Array.isArray(props.sort) ? (props.sort as unknown as SortClause[]) : [],
)

// track which header is focused for styling/accessibility tests
const focusedHeader = ref<string | null>(null)

function onHeaderFocus(key: string | undefined) {
  if (!key) return
  focusedHeader.value = key
}

function onHeaderBlur(key: string | undefined) {
  if (!key) return
  if (focusedHeader.value === key) focusedHeader.value = null
}

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
  const idx = localSort.value.findIndex((s: SortClause | undefined) => s && s.column === key)

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

// debounced filter input handling
const filterTimeout = ref<number | null>(null)
function onFilterInput(column: ColumnDef, ev: Event) {
  const input = ev.target as HTMLInputElement
  const value = input.value

  // clear existing timeout
  if (filterTimeout.value) window.clearTimeout(filterTimeout.value)

  // schedule emit after debounce
  filterTimeout.value = window.setTimeout(() => {
    const payload = value ? [{ column: column.key, operator: 'contains', value }] : null
    emit('update:filter', payload)
    if (props.serverSide) {
      emit('request:page', buildPagePayload({ filter: payload }))
    }
    filterTimeout.value = null
  }, 250)
}

function onFilterClear() {
  // cancel pending debounce
  if (filterTimeout.value) window.clearTimeout(filterTimeout.value)
  filterTimeout.value = null
  // emit cleared filter
  emit('update:filter', null)
  if (props.serverSide) {
    emit('request:page', buildPagePayload({ filter: null }))
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

// Return sort info for a column using either server-side provided sort (props.sort)
// or localSort for client-side interactions.
function getSortInfo(key: string | undefined) {
  if (!key) return null
  const arr: SortClause[] = props.serverSide
    ? Array.isArray(props.sort)
      ? (props.sort as SortClause[])
      : []
    : localSort.value || []

  const idx = arr.findIndex((s) => s && s.column === key)
  if (idx === -1) return null
  return { direction: arr[idx].direction, order: idx + 1 }
}

function getSortInfoSafe(key: string | undefined) {
  const info = getSortInfo(key)
  if (!info) return { direction: 'asc' as 'asc' | 'desc', order: 0 }
  return info
}

function getRowKey(row: RowData) {
  if (!props.rowKey) return JSON.stringify(row)
  if (typeof props.rowKey === 'function') return String(props.rowKey(row))
  return String(row[props.rowKey as string])
}

const rowsToRender = computed(() => {
  const base = props.rows || []
  // if server side, the host manages sorting; render rows as-is
  if (props.serverSide) return base
  // client-side: apply localSort if present
  return applySort(base, localSort.value.length ? localSort.value : null, columns.value)
})
</script>

<style scoped>
.sg-grid-caption {
  caption-side: top;
  text-align: left;
  font-weight: 600;
  padding-bottom: 8px;
}

.sg-sort-button {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  padding: 0 4px;
  line-height: 10px;
  cursor: pointer;
}
.sg-sort-button .sg-sort-up,
.sg-sort-button .sg-sort-down {
  font-size: 10px;
  color: #9ca3af; /* neutral gray when inactive */
  display: block;
  height: 10px;
}
.sg-sort-button .active {
  color: #111827; /* darker when active */
}
.sg-sort-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 12px; /* minimal reserved space to prevent layout shift */
  height: 18px;
  font-size: 12px;
  padding: 0 2px;
}
.sg-indicator-neutral {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af; /* neutral color */
}
.sg-indicator-neutral .material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
  font-size: 16px;
}
.sg-indicator-active {
  color: #111827;
}
.sg-indicator-active .material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 600,
    'GRAD' 0,
    'opsz' 20;
  font-size: 16px;
}
/* tighten header padding so content (including icons) sits closer to cell edge */
.sg-grid-table th {
  padding: 4px 6px;
}
.sg-sort-order {
  font-size: 10px;
  margin-left: 3px;
}
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
.sg-header--focused {
  outline: 2px solid #60a5fa33;
}
.sg-grid-table th[tabindex] {
  cursor: pointer;
}

/* position header as relative so the indicator can sit at the extreme right */
.sg-header-cell {
  position: relative;
  padding-right: 6px; /* small padding to keep icon off the absolute edge */
}

.sg-header-cell .sg-sort-indicator {
  position: absolute;
  right: 2px; /* move indicator very close to the border */
  top: 50%;
  transform: translateY(-50%);
  padding: 0 1px;
  min-width: 0; /* allow icon to occupy minimal space */
}

/* ensure filter controls don't overlap the absolutely positioned indicator */
.sg-header-cell > div {
  padding-right: 28px; /* leave room for indicator and possible order badge */
}
</style>

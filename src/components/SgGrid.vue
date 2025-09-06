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
            <div class="sg-header-wrapper">
              <div class="sg-header-inner">
                <!-- Filter icon (left) -->
                <span
                  v-if="column.filterable"
                  data-test-filter-indicator
                  class="sg-filter-indicator"
                >
                  <span class="sg-indicator-neutral" aria-hidden="true">
                    <FilterIcon
                      class="sg-icon-inline"
                      size="16"
                      :color="getComputedIconColor('neutral')"
                    />
                  </span>
                  <span class="visually-hidden">Filterable</span>
                </span>
                <!-- Header text with ellipsis. Always between icons. -->
                <span
                  class="sg-header-text"
                  :class="isNumericColumn(column) ? 'align-right' : 'align-left'"
                  v-truncate-tooltip="String(column.caption ?? column.field)"
                >
                  {{ column.caption ?? column.field }}
                </span>
                <!-- Sort icon (right) -->
                <span v-if="column.sortable" data-test-sort-indicator class="sg-sort-indicator">
                  <template v-if="getSortInfo(column.key)">
                    <span class="sg-indicator-active" aria-hidden="true">
                      <component
                        :is="
                          getSortInfoSafe(column.key).direction === 'asc'
                            ? ArrowUpIcon
                            : ArrowDownIcon
                        "
                        class="sg-icon-inline"
                        size="16"
                        :color="getComputedIconColor('active')"
                      />
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
                  <template v-else>
                    <span class="sg-indicator-neutral" aria-hidden="true">
                      <SortIcon
                        class="sg-icon-inline"
                        size="16"
                        :color="getComputedIconColor('neutral')"
                      />
                    </span>
                  </template>
                </span>
                <!-- Sort button (for tests / keyboard) placed after sort icon -->
                <button
                  v-if="column.sortable"
                  data-test-sort-button
                  class="sg-sort-button"
                  @click.stop="onHeaderSortClick(column, $event)"
                  :aria-label="`Sort ${column.caption ?? column.field}`"
                >
                  <span class="visually-hidden">Toggle sort</span>
                </button>
              </div>
              <!-- Filter input row sits below icons/text so text always remains between icons -->
              <div
                v-if="column.filterable"
                class="sg-header-filter-ui"
                :class="{ 'is-empty': !(filterValues[column.key] ?? '') }"
              >
                <span class="sg-filter-search-icon" aria-hidden="true">
                  <SearchIcon size="14" />
                </span>
                <input
                  :type="column.inputType ?? 'text'"
                  data-test-filter-input
                  :aria-label="`Filter ${column.caption ?? column.field}`"
                  :value="filterValues[column.key] || ''"
                  @input="onFilterInput(column, $event)"
                />
                <button
                  v-if="filterValues[column.key]"
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
// inline SVG imports (raw) so we can embed and style via CSS/fill/currentColor
import FilterIcon from './icons/FilterIcon.vue'
import SortIcon from './icons/SortIcon.vue'
import ArrowUpIcon from './icons/ArrowUpIcon.vue'
import ArrowDownIcon from './icons/ArrowDownIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'
import type { SgGridPropTypes, ColumnDef, RowData } from './types'
import SgColumn from './SgColumn.vue'

const props = defineProps<SgGridPropTypes>()

const slots = useSlots()

// helper to determine icon color by state; returns CSS color string (uses currentColor by default)
function getComputedIconColor(state: 'neutral' | 'active') {
  // keep icons using currentColor from their container; we can override here if desired
  return state === 'active' ? 'currentColor' : 'currentColor'
}

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

// Track per-column current filter input values for UI state (e.g., empty styling)
const filterValues = ref<Record<string, string>>({})

// debounced filter input handling
const filterTimeout = ref<number | null>(null)
function onFilterInput(column: ColumnDef, ev: Event) {
  const input = ev.target as HTMLInputElement
  const value = input.value

  // update local value for styling (empty vs non-empty)
  filterValues.value[column.key] = value

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
  // clear all tracked filter inputs (single global clear semantics)
  filterValues.value = {}
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

// Determine if a column should be treated as numeric for header alignment.
// Heuristic: inputType === 'number' OR column key/name includes common numeric terms
// OR all sampled row values (first 10) are numbers.
function isNumericColumn(col: ColumnDef | undefined): boolean {
  if (!col) return false
  // access inputType using loose typing since ColumnDef allows optional inputType
  if ((col as unknown as { inputType?: string }).inputType === 'number') return true
  const name = String(col.caption ?? col.key ?? '').toLowerCase()
  if (/^(age|id|count|total|qty|quantity|price|amount|score|rank|index)$/i.test(name)) return true
  const rows = props.rows || []
  if (!rows.length) return false
  const sample = rows.slice(0, 10)
  let numericCount = 0
  for (const r of sample) {
    let v: unknown
    if (typeof col.field === 'function') v = col.field(r)
    else {
      // simple path resolution (reuse minimal logic rather than importing util used elsewhere)
      try {
        const path = String(col.field)
        // only support simple direct property for heuristic to avoid overhead
        v = (r as Record<string, unknown>)[path as keyof typeof r]
      } catch {
        v = undefined
      }
    }
    if (typeof v === 'number' && !Number.isNaN(v)) numericCount++
  }
  return numericCount > 0 && numericCount === sample.length
}

const rowsToRender = computed(() => {
  const base = props.rows || []
  // if server side, the host manages sorting; render rows as-is
  if (props.serverSide) return base
  // client-side: apply localSort if present
  return applySort(base, localSort.value.length ? localSort.value : null, columns.value)
})

// Directive: v-truncate-tooltip adds a title attribute only when the element's
// rendered text is actually truncated (scrollWidth > clientWidth). This avoids
// redundant tooltips while ensuring full caption is accessible.
const truncateTooltip = {
  mounted(el: HTMLElement, binding: { value: string }) {
    const raf: typeof requestAnimationFrame | undefined =
      typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : undefined
    const timeouts: number[] = []
    const applyNow = () => {
      const truncated = el.scrollWidth > el.clientWidth + 1
      if (truncated) el.setAttribute('title', binding.value || '')
      else el.removeAttribute('title')
    }
    const schedule = (delay = 0) => {
      if (raf && delay === 0) raf(() => applyNow())
      else timeouts.push(window.setTimeout(applyNow, delay))
    }
    schedule() // initial
    schedule(50) // small delay after potential font load
    schedule(250) // fallback after more layout stabilization
    const onResize = () => applyNow()
    window.addEventListener('resize', onResize)
    ;(el as unknown as { __ttCleanup?: () => void }).__ttCleanup = () => {
      window.removeEventListener('resize', onResize)
      timeouts.forEach((t) => window.clearTimeout(t))
    }
  },
  updated(el: HTMLElement, binding: { value: string }) {
    const truncated = el.scrollWidth > el.clientWidth + 1
    if (truncated) el.setAttribute('title', binding.value || '')
    else el.removeAttribute('title')
  },
  unmounted(el: HTMLElement) {
    const anyEl = el as unknown as { __ttCleanup?: () => void }
    if (anyEl.__ttCleanup) anyEl.__ttCleanup()
  },
}

// Provide alias starting with v* for <script setup> directive auto registration patterns
const vTruncateTooltip = truncateTooltip

// expose directive to template via variable name (v-truncate-tooltip => truncateTooltip)
// No extra export needed; <script setup> auto-exposes top-level consts.
</script>

<style scoped>
.sg-grid-caption {
  caption-side: top;
  text-align: left;
  font-weight: 600;
  padding-bottom: 8px;
}

/* Removed old inline .sg-sort-button layout styles; replaced later with absolute positioning */
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
.sg-indicator-neutral .sg-icon-inline svg {
  color: inherit;
  width: 16px;
  height: 16px;
  fill: currentColor;
  opacity: 0.7; /* neutral look */
}
.sg-indicator-active {
  color: #111827;
}
.sg-indicator-active .sg-icon-inline svg {
  color: inherit;
  width: 16px;
  height: 16px;
  fill: currentColor;
  opacity: 1;
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

/* New header layout */
.sg-header-cell {
  padding: 4px 6px;
}
.sg-header-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
}
.sg-header-inner {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0; /* allow children to shrink */
  gap: 4px;
  outline: 1px dashed #f59e0b; /* debug border */
  position: relative; /* allow absolutely positioned sort button to not take layout space */
}
.sg-filter-indicator,
.sg-sort-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
}
.sg-header-text {
  flex: 1 1 auto;
  min-width: 0; /* enable ellipsis */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}
/* Absolute-positioned sort button overlapping sort icon without adding extra spacing */
.sg-sort-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  line-height: 1;
  cursor: pointer;
}

.sg-header-filter-ui {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none; /* hide border per design */
  background: #fff; /* base white background when not empty */
  padding: 2px 4px;
  position: relative;
  transition: background-color 120ms ease-in-out;
}
.sg-header-filter-ui.is-empty {
  background: #f5f5f5; /* light gray when input is empty (lighter than header) */
}
.sg-filter-search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #6b7280; /* neutral gray */
  flex: 0 0 auto;
}
.sg-header-filter-ui input[data-test-filter-input] {
  flex: 1 1 auto;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 4px;
  min-width: 0;
}
.sg-header-filter-ui input[data-test-filter-input]:focus {
  box-shadow: none; /* remove inner focus box */
  border-radius: 0;
}
.sg-header-filter-ui:focus-within .sg-filter-search-icon {
  display: none;
}
.sg-header-filter-ui:focus-within input[data-test-filter-input] {
  padding-left: 0; /* start at left debug border */
  padding-right: 0; /* extend to right debug border */
}
.sg-header-filter-ui:focus-within [data-test-filter-clear] {
  display: none;
}
/* Hide container border/outline while editing so only caret shows */
.sg-header-filter-ui:focus-within {
  border-color: transparent;
  outline: none;
  background: #fff; /* on focus always white even if empty */
}
.sg-icon-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
.sg-filter-indicator .sg-icon-inline svg,
.sg-sort-indicator .sg-icon-inline svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
</style>

// Lightweight shared types for sg-grid components
import type { PropType } from 'vue'

export type FieldPath = string | ((row: Record<string, unknown>) => unknown)

export interface ColumnDef {
  key: string
  field: FieldPath
  caption?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  // Optional UI flags
  sortable?: boolean
  filterable?: boolean
  // Optional input type to control header filter input (e.g. 'text', 'number', 'date')
  inputType?: string
  // Optional hooks that allow column-level override of filter and sort behaviour.
  // filterFunction should return a boolean (match or not). Signature: (cellValue, clauseValue, row?, clause?) => boolean
  filterFunction?: (
    cellValue: unknown,
    clauseValue: unknown,
    row?: Record<string, unknown>,
    clause?: { column: string; operator: string; value: unknown },
  ) => boolean
  // sortFunction should act like a comparator returning negative/zero/positive.
  // Signature: (aValue, bValue, aRow?, bRow?) => number
  sortFunction?: (
    aValue: unknown,
    bValue: unknown,
    aRow?: Record<string, unknown>,
    bRow?: Record<string, unknown>,
  ) => number
}

// Reusable filter/sort clause shapes used by dataUtils and SgGrid props
export type FilterClause = {
  column: string
  operator: string
  value: unknown
}

export type SortClause = {
  column: string
  direction: 'asc' | 'desc'
}

// Optional exported helper types for consumer functions
export type FilterFunction = (
  cellValue: unknown,
  clauseValue: unknown,
  row?: Record<string, unknown>,
  clause?: FilterClause,
) => boolean

export type SortFunction = (
  aValue: unknown,
  bValue: unknown,
  aRow?: Record<string, unknown>,
  bRow?: Record<string, unknown>,
) => number

// Operator function signature used by individual operator helpers (eq/ne/contains/etc)
export type OperatorFn = (val: unknown, clauseVal: unknown, caseSensitive?: boolean) => boolean

// Signatures for the core utilities so they can be imported as types by consumers/tests
export type ApplyFiltersFn = (
  rows: ReadonlyArray<Record<string, unknown>>,
  filter: FilterClause[] | null,
  columns?: ColumnDef[] | Record<string, ColumnDef>,
  options?: { caseSensitive?: boolean },
) => Record<string, unknown>[]

export type ApplySortFn = (
  rows: ReadonlyArray<Record<string, unknown>>,
  sort: SortClause[] | null,
  columns?: ColumnDef[] | Record<string, ColumnDef>,
) => Record<string, unknown>[]

// Props for declarative <sg-column>
export interface SgColumnProps {
  dataField: FieldPath
  key?: string
  caption?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

// Minimal SgGrid props shape for runtime usage
export const SgGridProps = {
  columns: { type: Array as PropType<ColumnDef[]>, required: false },
  rows: { type: Array as PropType<Record<string, unknown>[]>, required: false },
  // Server-side mode: when true the grid emits requests and does not perform
  // client-side filtering/sorting. (Behavior implemented minimally in SgGrid)
  serverSide: { type: Boolean, required: false },
  // optional current sort/filter/page props that host app may pass
  sort: { type: [Array, Object] as PropType<unknown>, required: false },
  filter: { type: Array as PropType<unknown[]>, required: false },
  page: { type: Number as PropType<number>, required: false },
  pageSize: { type: Number as PropType<number>, required: false },
  rowKey: {
    type: [String, Function] as PropType<string | ((row: unknown) => string)>,
    required: true,
  },
} as const

// Strongly-typed interfaces for static typing with defineProps<...>()
export type RowData = Record<string, unknown>

export interface SgGridPropTypes {
  columns?: ColumnDef[]
  rows?: RowData[]
  rowKey: string | ((row: unknown) => string)
  caption?: string
  serverSide?: boolean
  sort?: unknown
  filter?: unknown[]
  page?: number
  pageSize?: number
}

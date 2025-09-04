// Lightweight shared types for sg-grid components
import type { PropType } from 'vue'

export type FieldPath = string | ((row: Record<string, unknown>) => unknown)

export interface ColumnDef {
  key: string
  field: FieldPath
  caption?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
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
}

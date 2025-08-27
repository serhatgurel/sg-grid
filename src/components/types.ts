// Lightweight shared types for sg-grid components
import type { PropType } from 'vue'

export interface ColumnDef {
  key: string
  field: string
  label?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

// Props for declarative <sg-column>
export interface SgColumnProps {
  dataField: string
  key?: string
  label?: string
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
}

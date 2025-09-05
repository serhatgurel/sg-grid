import { test, expect } from 'vitest'
import type { ApplyFiltersFn, ApplySortFn, OperatorFn } from '../../src/components/types'
import { applyFilters, applySort, opEq, opContains } from '../../src/lib/dataUtils'

// Type-level assignments - if signatures differ this file will fail to compile.
const _applyFilters: ApplyFiltersFn = applyFilters
const _applySort: ApplySortFn = applySort
const _opEq: OperatorFn = opEq
const _opContains: OperatorFn = opContains

test('types exported and implementations assignable to types', () => {
  expect(typeof _applyFilters).toBe('function')
  expect(typeof _applySort).toBe('function')
  expect(typeof _opEq).toBe('function')
  expect(typeof _opContains).toBe('function')
})

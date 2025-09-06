// Type-level export tests ensuring public types are available for consumers

import { test, expect } from 'vitest'
import type { ApplyFiltersFn, ApplySortFn, OperatorFn } from '../../src/components/types'
import { applyFilters, applySort, opEq, opContains } from '../../src/lib/dataUtils'

// Type export smoke test: ensures public types match implementations so consumers
// importing the types can assign the functions without TypeScript errors.
const _applyFilters: ApplyFiltersFn = applyFilters
const _applySort: ApplySortFn = applySort
const _opEq: OperatorFn = opEq
const _opContains: OperatorFn = opContains

test('public types are exported and implementations are assignable', () => {
  expect(typeof _applyFilters).toBe('function')
  expect(typeof _applySort).toBe('function')
  expect(typeof _opEq).toBe('function')
  expect(typeof _opContains).toBe('function')
})

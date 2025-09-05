/**
 * Common test fixtures used across unit tests.
 * Keep small, deterministic, and easy to extend.
 */
export const sampleRows = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Carol', age: 40 },
]

export const sampleColumns = [
  { key: 'name', field: 'name', sortable: true, filterable: true },
  { key: 'age', field: 'age', sortable: true, filterable: true, inputType: 'number' },
]

export default { sampleRows, sampleColumns }

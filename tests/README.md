# Test patterns and helpers

This folder contains shared test helpers, fixtures and patterns used across the unit tests.

Conventions

- Keep tests deterministic and small.
- Prefer `mountWithDefaults` from `tests/utils/test-utils.ts` to centralize global stubs.
- Use fixtures in `tests/utils/fixtures.ts` for sample rows/columns.
- Use DOM helpers in `tests/utils/dom-utils.ts` when interacting with focus/blur.

Helpers

- `mountWithDefaults(component, options?)` — small wrapper around `@vue/test-utils` mount with shared global stubs.
- `mountWithSgGrid(opts?)` — (provided in `tests/utils/mounts.ts`) mounts `SgGrid` with sane defaults for columns/rows and returns the wrapper.

Example

```ts
import { mountWithSgGrid } from './utils/mounts'
import { sampleRows, sampleColumns } from './utils/fixtures'

const { wrapper } = mountWithSgGrid({ rows: sampleRows, columns: sampleColumns })
// perform assertions against wrapper
```

Testing tips

- Run the test suite with the exact command used by CI locally:

```
npm run test:run --silent
```

ARIA and keyboard testing patterns

- Verify ARIA attributes on header cells: when a column is sorted the header should expose `aria-sort` with one of `none`, `ascending`, or `descending`.

```ts
// find the header cell and assert its aria-sort value
const hd = wrapper.find('th[data-col-key="name"]')
expect(hd.attributes('aria-sort')).toBe('ascending')
```

- Use small helpers for expected ARIA mapping (see `tests/utils/aria-utils.ts`) to avoid brittle strings in tests.

- Keyboard interaction tests: simulate focus and key events to exercise keyboard activation (Enter/Space) for sorting.

```ts
import { safeFocus } from './utils/dom-utils'

const hd = wrapper.find('th[data-col-key="age"]')
// programmatically focus, then dispatch keydown Enter
safeFocus(hd.element as HTMLElement)
await hd.trigger('keydown', { key: 'Enter' })
// assert sort state changed or update:sort emitted
expect(wrapper.emitted('update:sort')).toBeTruthy()
```

- When testing keyboard+focus, prefer `safeFocus`/`safeBlur` to ensure events fire reliably in JSDOM.

- For components that emit accessibility-related events or aria changes, prefer asserting emitted payloads and ARIA attributes rather than implementation details (DOM structure) so tests remain robust to small markup changes.

New / recent tests

- `tests/unit/SgGrid.headerIcons.spec.ts` — small unit tests that assert header UI elements are rendered and accessible:
  - verifies the filter icon indicator (`[data-test-filter-indicator]`) and its accessible label
  - verifies the sort affordance (`[data-test-sort-indicator]`) in neutral and active states
  - verifies combined filter+sort presence for columns that are both filterable and sortable
  - verifies long header captions render intact (sanity on length/truncation)

When adding similar UI tests prefer querying by data-test attributes (e.g., `data-test-filter-indicator`, `data-test-sort-indicator`, `data-test-sort-button`) and assert behavior (emits/ARIA) rather than fragile DOM structure.

Common patterns

- Use fixtures for deterministic row/column data (`tests/utils/fixtures.ts`).
- Keep helper functions small and focused: find header by key, click header sort, read cell text.
- Add demonstration tests for new helpers to validate their behavior (see `tests/unit/mounts.spec.ts`).

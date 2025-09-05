# Changelog (draft)

## Unreleased — Filter & Sort (dev-filter-sort)

Summary

- Added client-side filtering and sorting utilities (`applyFilters`, `applySort`) with deterministic coercion and NaN-safe handling.
- Implemented operator helpers: `eq`, `ne`, relational (`lt`, `lte`, `gt`, `gte`), string ops (`contains`, `startsWith`, `endsWith`), and array ops (`in`, `between`).
- Column-level hooks: `column.filterFunction` and `column.sortFunction` enable custom per-column behavior.
- Server-side wiring: `serverSide` mode emits `request:page` and `update:sort` / `update:filter` events; playground includes a demo handler.
- Accessibility: keyboard activation and `aria-sort` attributes for headers.
- Types: exported TypeScript types for filter/sort clauses and operator signatures; added a small type-level test to keep typings correct.

Notes

- This is a draft changelog entry intended for review. It lists major user-facing changes and developer notes. Adjust wording for release notes as needed.

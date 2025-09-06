# Review checklist — Filter & Sort feature (dev-filter-sort)

This lightweight checklist documents the quick review steps performed for the filter & sort feature set.

Code review

- [x] Confirm `src/lib/dataUtils.ts` is pure and immutable (returns new arrays).
- [x] Verify `applyFilters`/`applySort` respect `column.filterFunction` / `column.sortFunction` overrides.
- [x] Ensure fast-fail behaviour in `useVisibleRows` and utilities when filter/sort are empty.

Docs review

- [x] Ensure `changelog-draft.md` accurately summarizes developer-facing changes.
- [x] Playground (`src/examples/FilterSortPlayground.vue`) surfaces warnings and the changelog preview.

Tests review

- [x] All unit tests pass (`npm run test:run --silent`).
- [x] Type-level test (`tests/unit/types.export.spec.ts`) enforces exported types.

Notes

- This checklist is intentionally minimal — expand with code pointers or PR feedback items when preparing a formal PR.

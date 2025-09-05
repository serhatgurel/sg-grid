# Review checklist — Filter & Sort feature (dev-filter-sort)

This lightweight checklist documents the quick review steps performed for the filter & sort feature set.

Code review

- [ ] Confirm `src/lib/dataUtils.ts` is pure and immutable (returns new arrays).
- [ ] Verify `applyFilters`/`applySort` respect `column.filterFunction` / `column.sortFunction` overrides.
- [ ] Ensure fast-fail behaviour in `useVisibleRows` and utilities when filter/sort are empty.

Docs review

- [ ] Ensure `docs/changelog-draft.md` accurately summarizes developer-facing changes.
- [ ] Playground (`src/examples/FilterSortPlayground.vue`) surfaces warnings and the changelog preview.

Tests review

- [ ] All unit tests pass (`npm run test:run --silent`).
- [ ] Type-level test (`tests/unit/types.export.spec.ts`) enforces exported types.

Notes

- This checklist is intentionally minimal — expand with code pointers or PR feedback items when preparing a formal PR.

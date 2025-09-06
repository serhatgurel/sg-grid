# Tasks — Summaries

This document summarizes each top-level task from `docs/tasks/tasks.md` with a one-line description, current status, and a recommended next step.

- [x] 1. Minimal declarative grid — Done
  - Summary: Implement a minimal `sg-grid` that renders headers and rows and supports basic column metadata (caption, width) and row keys.
  - Next step: None (implemented). Keep examples and tests maintained.

- [x] 2. Filter & Sort — Done
  - Summary: Filtering and sorting (including per-column filters and multi-column sort) implemented with composables and header UI; wired to client/server adapters.
  - Next step: Maintain tests and expand filter types as needed.

- [ ] 3. Pagination (client/server) — Not started
  - Summary: Add configurable page size, client-side paging, and server-side paging adapter contract.
  - Next step: Define adapter interface and implement client-side paging composable.

- [ ] 4. Selection modes & persistence — Not started
  - Summary: Provide none/single/multi selection with persistence across pages and keyboard/checkbox UI.
  - Next step: Design selection API and implement `sg-selection` composable.

- [ ] 5. Editing modes & validation — Not started
  - Summary: Inline and popup editors with validation hooks and editor templates.
  - Next step: Design editor API and add validation hooks.

- [ ] 6. Easy installation & build outputs — Not started
  - Summary: Ensure package entrypoints, scripts (`dev`, `build`, `test`) and TypeScript declarations for distribution.
  - Next step: Finalize package outputs and add build scripts.

- [ ] 7. First-class TypeScript typings — Not started
  - Summary: Publish typings for public API and export types for composables/components.
  - Next step: Audit public surface and add/adjust type exports.

- [ ] 8. Column data types & custom cell templates — Not started
  - Summary: Built-in renderers for string/number/date/boolean/link/image and custom cell template API.
  - Next step: Implement core renderers and template registration.

- [ ] 9. Accessibility basics — Not started
  - Summary: Keyboard navigation, ARIA semantics, focus management, and live announcements.
  - Next step: Define keyboard flows and add ARIA attributes to `SgGrid`.

- [ ] 10. Minimal example app — Not started
  - Summary: Example app showcasing major flows (paging, editing, selection) and dev script for examples.
  - Next step: Extend `examples` with scenario pages and ensure examples run locally.

- [ ] 11. Grouping & aggregations — Not started
  - Summary: Group-by UI, aggregation functions (count,sum,avg,min,max), and summary row.
  - Next step: Design grouping model and implement aggregation helpers.

- [ ] 12. Bulk-edit & batch actions — Not started
  - Summary: Batch toolbar for selected rows with optimistic updates and rollback.
  - Next step: Design batch action API and toolbar UX.

- [ ] 13. Conditional formatting & custom renderers — Not started
  - Summary: Rule engine to apply conditional styles and custom renderers per cell.
  - Next step: Define rule API and integrate with renderer pipeline.

- [ ] 14. Theming hooks & style isolation — Not started
  - Summary: CSS tokens, optional Shadow DOM wrapper, and token helper utilities.
  - Next step: Add tokens CSS and provide theme examples.

- [ ] 15. Plugin/extension API & lifecycle hooks — Not started
  - Summary: Plugin registration system and lifecycle/event hooks for extensions.
  - Next step: Draft plugin API and a simple plugin example.

- [ ] 16. Tests, fixtures, and CI — Not started
  - Summary: Vitest config, fixtures, CI pipeline, and visual regression harness.
  - Next step: Add CI workflows and baseline tests.

- [ ] 17. Streaming & conflict resolution — Not started
  - Summary: Optional streaming adapter and merge strategies for real-time updates.
  - Next step: Design streaming adapter contract and conflict-resolution rules.

- [ ] 18. Offline/cached access & sync — Not started
  - Summary: Local cache layer and sync routines with merge rules.
  - Next step: Define cache model and sync strategies.

- [ ] 19. Real-time collaboration — Not started
  - Summary: Collaborative adapter and notifications for multi-user scenarios.
  - Next step: Identify collaboration primitives and adapter API.

- [ ] 20. Import/Export & print-friendly reports — Not started
  - Summary: CSV/Excel/PDF export and print styles.
  - Next step: Implement CSV export and add print CSS.

- [ ] 21. Debug/log hooks & runtime warnings — Not started
  - Summary: Logger adapter and structured warnings for misconfiguration.
  - Next step: Add a lightweight logger abstraction and prop validation warnings.

- [ ] 22. Release/versioning & deprecation policy — Not started
  - Summary: Semantic versioning, deprecation policy, and automated release tooling.
  - Next step: Define policy and add release scripts.

- [ ] 23. Positionable/collapsible panels — Not started
  - Summary: Panel container with positioning and collapse behaviour.
  - Next step: Implement panel container component and toggle UI.

- [ ] 24. Configurable search panel — Not started
  - Summary: Search panel with placeholder, debounce, and scope controls.
  - Next step: Implement `sg-search-panel` with debounced input.

- [ ] 25. Visual/display options — Not started
  - Summary: Expose row numbers, alignment, ellipsis/wrap, borders, and CSS hooks.
  - Next step: Add style props and CSS variables.

- [ ] 26. Column chooser preserve-order — Not started
  - Summary: Column chooser that can preserve original order when toggling visibility.
  - Next step: Implement chooser and preserve-order flag.

- [ ] 27. Filter controls inline/panel modes — Not started
  - Summary: Inline `sg-filter-row` and `sg-filter-panel` with clearable inputs and debounce.
  - Next step: Implement both UI variants and debounce handling.

- [ ] 28. Configurable paging controls — Not started
  - Summary: Individual toggles for goto/jump/start-end/next-prev controls.
  - Next step: Extend paging UI to accept visibility props.

- [ ] 29. Column-level data-sources & mapping — Not started
  - Summary: Columns accept local data-sources and mapping props.
  - Next step: Define column data-source API and implement mapping.

- [ ] 30. Contextual tooltips & per-column loading indicators — Not started
  - Summary: Tooltip component and per-column/grid loading states.
  - Next step: Add tooltip utility and loading indicator hooks.

- [ ] 31. Automated CI pipelines — Not started
  - Summary: GitHub Actions workflows to run lint, type-check, tests, and scans on PRs.
  - Next step: Add workflows and ensure tests pass in CI.

- [ ] 32. Pre-commit hooks & contributor onboarding — Not started
  - Summary: Husky/lefthook + lint-staged and contributor docs.
  - Next step: Add hooks and onboarding documentation.

- [ ] 33. Generated API docs & publishing — Not started
  - Summary: Typedoc (or similar) generation and versioned docs site pipeline.
  - Next step: Add doc generator config and publish pipeline.


Requirements coverage
- Create summaries file at `docs/tasks/tasks.summaries.md`: Done
- Summarize each top-level task with status and next step: Done

Files created
- `docs/tasks/tasks.summaries.md` — concise task summaries and recommended next steps

Completion note: I created the summaries file reflecting the checked/unchecked state in `docs/tasks/tasks.md`. If you want a more detailed per-subtask summary or a CSV/CSV-exportable view, I can add that next.

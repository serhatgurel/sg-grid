## Tasks derived from `docs/grid-prd.md`

Below is a structured task list created from the PRD. Each user story is a high-level task followed by bite-sized subtasks (design, implementation, tests, docs, reviews). Each line starts on a new line, uses numbered numbering and a checkbox as requested. Save this file as `docs/tasks.md`.

- [x] 1.  As a developer, implement a minimal, declarative `sg-grid` and a minimal example that accept `columns` and `rows` and render headers and rows only (no editing/sorting/paging). Ensure row key and column field metadata (caption, width) are supported.
- [x] 1.1 Design: define minimal public API and example data shape
- [x] 1.2 Implementation: small `sg-grid` component that accepts `columns` and `rows` props and renders header + rows
- [x] 1.3 Example: add `examples/minimal` or `src/examples/MinimalExample.vue` to show usage
- [x] 1.4 Tests: smoke render test for the component
- [x] 1.5 Docs: update README and examples index with minimal example

- [ ] 2.  As a user, I want filter and sort so I can find information quickly.
- [ ] 2.1 Design: define filter & sort API (props/events/edge-cases)
- [ ] 2.2 Implementation: composable and header UI
  - [ ] 2.2.1 Implement sorting logic (multi-column, direction)
  - [ ] 2.2.2 Implement per-column filter controls (string/number/date)
  - [ ] 2.2.3 Wire sort/filter to data-source adapters (client/server)
- [ ] 2.3 Tests: unit tests for composables
- [ ] 2.4 Tests: component tests (header + interaction)
- [ ] 2.5 Docs: usage examples + API docs
- [ ] 2.6 Code review
- [ ] 2.7 Doc review
- [ ] 2.8 Unit test review

- [ ] 3. As a user, I want pagination with configurable page size and client/server paging so I can navigate large datasets.
  - [ ] 3.1 Design: paging adapter interface (client/server)
  - [ ] 3.2 Implementation: paging composable + `sg-paging-panel`
    - [ ] 3.2.1 Implement client-side paging
    - [ ] 3.2.2 Implement server-side paging adapter contract
    - [ ] 3.2.3 Add page-size controls and UI options
  - [ ] 3.3 Tests: unit tests for adapters
  - [ ] 3.4 Tests: integration test with large dataset
  - [ ] 3.5 Docs: examples showing both modes
  - [ ] 3.6 Code review
  - [ ] 3.7 Doc review
  - [ ] 3.8 Unit test review

- [ ] 4. As a user, I want selection modes (none, single, multi) and persistence across paging so I can operate on rows.
  - [ ] 4.1 Design: selection API (persist mode, identifiers)
  - [ ] 4.2 Implementation: `sg-selection` composable + UI
    - [ ] 4.2.1 Implement none/single/multi modes
    - [ ] 4.2.2 Implement persistence across pages (store by key)
    - [ ] 4.2.3 Add checkbox/radio UI and keyboard support
  - [ ] 4.3 Tests: unit tests for selection state
  - [ ] 4.4 Tests: component tests with paging
  - [ ] 4.5 Docs: selection usage and caveats
  - [ ] 4.6 Code review
  - [ ] 4.7 Doc review
  - [ ] 4.8 Unit test review

- [ ] 5. As a user, I want editing modes (none, inline, popup) with validation so I can correct data safely.
  - [ ] 5.1 Design: editors API, validation hooks, events
  - [ ] 5.2 Implementation: `sg-editing` + editor template support
    - [ ] 5.2.1 Inline editor flow
    - [ ] 5.2.2 Popup editor flow
    - [ ] 5.2.3 Validation and error display
    - [ ] 5.2.4 Editor templates registration API
  - [ ] 5.3 Tests: unit tests for validation and editor flows
  - [ ] 5.4 Tests: component tests for inline and popup
  - [ ] 5.5 Docs: editor configuration and examples
  - [ ] 5.6 Code review
  - [ ] 5.7 Doc review
  - [ ] 5.8 Unit test review

- [ ] 6. As a developer, I want easy installation (npm/yarn/pnpm) and simple initialization so I can add the grid quickly.
  - [ ] 6.1 Design: package entrypoints and examples
  - [ ] 6.2 Implementation: package.json scripts and build outputs
    - [ ] 6.2.1 Add `dev`, `build`, `test`, `example` scripts
  - [ ] 6.2.2 Ensure TypeScript declaration generation
  - [ ] 6.2.3 Build outputs and bundling targets (ESM, CJS, types, browser UMD/UMD-like)
  - [ ] 6.3 Tests: smoke install/test in example
  - [ ] 6.4 Docs: installation and quickstart
  - [ ] 6.5 Code review
  - [ ] 6.6 Doc review
  - [ ] 6.7 Unit test review

- [ ] 7. As a developer, I want first-class TypeScript typings and clear public APIs for discoverability.
  - [ ] 7.1 Design: public API surface and typing strategy
  - [ ] 7.2 Implementation: add types, refine props and events
    - [ ] 7.2.1 Export types for composables and components
    - [ ] 7.2.2 Add examples in TS showing typing benefits
  - [ ] 7.3 Tests: type-check CI job
  - [ ] 7.4 Docs: API reference with types
  - [ ] 7.5 Code review
  - [ ] 7.6 Doc review
  - [ ] 7.7 Unit test review

- [ ] 8. As a user, I want support for common column data types and custom cell templates.
  - [ ] 8.1 Design: column type plugin API and template registration
  - [ ] 8.2 Implementation: built-in types (string, number, date, boolean, link, image)
    - [ ] 8.2.1 Implement date/time with timezone awareness
    - [ ] 8.2.2 Implement boolean renderers (checkbox/yes-no)
    - [ ] 8.2.3 Implement custom cell-template API
  - [ ] 8.2.4 Tests: timezone handling tests (DST, offsets, display vs storage)
  - [ ] 8.2.5 Docs: timezone guidance and examples
  - [ ] 8.3 Tests: unit tests per type + template rendering
  - [ ] 8.4 Tests: example app usage
  - [ ] 8.5 Docs: type usage and how to create custom templates
  - [ ] 8.6 Code review
  - [ ] 8.7 Doc review
  - [ ] 8.8 Unit test review

- [ ] 9. As a user, I want accessibility basics: keyboard navigation and meaningful names for screen readers.
  - [ ] 9.1 Design: keyboard nav flows and ARIA semantics
  - [ ] 9.2 Implementation: add keyboard handlers and ARIA attributes
    - [ ] 9.2.1 Row and cell focus management
    - [ ] 9.2.2 Announcements for dynamic changes (aria-live)
  - [ ] 9.3 Tests: accessibility tests (axe or similar)
  - [ ] 9.4 Docs: accessibility notes and keyboard shortcuts
  - [ ] 9.5 Code review
  - [ ] 9.6 Doc review
  - [ ] 9.7 Unit test review

- [ ] 10. As a developer, I want a minimal example app demonstrating components and flows.
  - [ ] 10.1 Design: example app scenarios to cover (paging, editing, selection)
  - [ ] 10.2 Implementation: `examples/minimal` enhancements
    - [ ] 10.2.1 Add pages demonstrating MVP features
    - [ ] 10.2.2 Wire local dev script for examples
  - [ ] 10.3 Tests: smoke-run example in CI
  - [ ] 10.4 Docs: guide to run the example
  - [ ] 10.5 Code review
  - [ ] 10.6 Doc review
  - [ ] 10.7 Unit test review

- [ ] 11. As a user, I want grouping and aggregations and a summary row.
  - [ ] 11.1 Design: grouping model and summary calculation API
  - [ ] 11.2 Implementation: `sg-group-panel` + `sg-summary-row`
    - [ ] 11.2.1 Implement group dropzone and group-by logic
    - [ ] 11.2.2 Implement aggregation functions (count,sum,avg,min,max)
  - [ ] 11.3 Tests: unit tests for aggregations
  - [ ] 11.4 Tests: component tests for grouped UI
  - [ ] 11.5 Docs: grouping and aggregation examples
  - [ ] 11.6 Code review
  - [ ] 11.7 Doc review
  - [ ] 11.8 Unit test review

- [ ] 12. As a user, I want bulk-edit and batch actions for multiple selected rows.
  - [ ] 12.1 Design: batch action API and UX
  - [ ] 12.2 Implementation: batch action toolbar and handlers
    - [ ] 12.2.1 Implement selection->batch action flow
    - [ ] 12.2.2 Add optimistic UI and rollback for failures
  - [ ] 12.3 Tests: unit/integration tests for batch actions
  - [ ] 12.4 Docs: batch actions examples
  - [ ] 12.5 Code review
  - [ ] 12.6 Doc review
  - [ ] 12.7 Unit test review

- [ ] 13. As a user, I want conditional formatting and custom renderers.
  - [ ] 13.1 Design: conditional formatting rules and renderer API
  - [ ] 13.2 Implementation: renderer registration and rule engine
  - [ ] 13.3 Tests: unit tests for rule evaluation and renderers
  - [ ] 13.4 Docs: examples of conditional formatting
  - [ ] 13.5 Code review
  - [ ] 13.6 Doc review
  - [ ] 13.7 Unit test review

- [ ] 14. As a developer, I want theming hooks and style isolation options.
  - [ ] 14.1 Design: CSS tokens and optional shadow DOM wrapper
  - [ ] 14.2 Implementation: `src/styles/tokens.css` and token helper
  - [ ] 14.3 Tests: visual smoke tests for themes
  - [ ] 14.4 Docs: theming guide and examples
  - [ ] 14.5 Code review
  - [ ] 14.6 Doc review
  - [ ] 14.7 Unit test review

- [ ] 15. As a developer, I want plugin/extension API and lifecycle hooks/events.
  - [ ] 15.1 Design: plugin API surface and lifecycle events
  - [ ] 15.2 Implementation: event system and plugin registration
  - [ ] 15.3 Tests: unit tests for event/plugin behaviour
  - [ ] 15.4 Docs: plugin API docs and example plugin
  - [ ] 15.5 Code review
  - [ ] 15.6 Doc review
  - [ ] 15.7 Unit test review

- [ ] 16. As a developer, I want test fixtures, unit/integration tests, and CI configuration.
  - [ ] 16.1 Design: test strategy and CI workflow
  - [ ] 16.2 Implementation: add Vitest configs, example fixtures, and CI pipeline
  - [ ] 16.2.1 Add Storybook and visual-regression test harness (Chromatic/Percy/Playwright snapshots)
  - [ ] 16.3 Tests: add baseline unit tests and integration tests
  - [ ] 16.3.1 Add visual regression tests and baseline screenshots for example pages
  - [ ] 16.4 Docs: testing guide
  - [ ] 16.5 Code review
  - [ ] 16.6 Doc review
  - [ ] 16.7 Unit test review

- [ ] 17. As a user, I want streaming/push-updated rows and conflict-resolution strategies.
  - [ ] 17.1 Design: real-time update model and conflict resolution options
  - [ ] 17.2 Implementation: optional streaming adapter + merge strategies
  - [ ] 17.3 Tests: integration tests for streaming and conflict resolution
  - [ ] 17.4 Docs: guidance and best practices
  - [ ] 17.5 Code review
  - [ ] 17.6 Doc review
  - [ ] 17.7 Unit test review

- [ ] 18. As a user, I want offline/cached access and sync with merge rules.
  - [ ] 18.1 Design: offline sync model and conflict rules
  - [ ] 18.2 Implementation: local cache layer and sync routines
  - [ ] 18.3 Tests: offline sync tests
  - [ ] 18.4 Docs: offline usage and caveats
  - [ ] 18.5 Code review
  - [ ] 18.6 Doc review
  - [ ] 18.7 Unit test review

- [ ] 19. As a user, I want real-time collaboration features and notifications.
  - [ ] 19.1 Design: collaboration model and notification UX
  - [ ] 19.2 Implementation: collaborative adapter (optional)
  - [ ] 19.3 Tests: collaboration simulation tests
  - [ ] 19.4 Docs: collaboration guide
  - [ ] 19.5 Code review
  - [ ] 19.6 Doc review
  - [ ] 19.7 Unit test review

- [ ] 20. As a user, I want advanced import/export (Excel/PDF) and print-friendly reports.
  - [ ] 20.1 Design: import/export feature spec
  - [ ] 20.2 Implementation: CSV/Excel/PDF export + print styles
  - [ ] 20.3 Tests: import/export unit tests and round-trip tests
  - [ ] 20.4 Docs: import/export usage
  - [ ] 20.5 Code review
  - [ ] 20.6 Doc review
  - [ ] 20.7 Unit test review

- [ ] 21. As a developer, I want debug/logging hooks and runtime warnings for misconfiguration.
  - [ ] 21.1 Design: logger adapter and structured warnings
  - [ ] 21.2 Implementation: logger adapter + prop validation warnings
  - [ ] 21.3 Tests: tests for warnings and logger
  - [ ] 21.4 Docs: diagnostics and troubleshooting
  - [ ] 21.5 Code review
  - [ ] 21.6 Doc review
  - [ ] 21.7 Unit test review

- [ ] 22. As a developer, I want stable semantic versioning, a deprecation policy, and automated release tooling.
  - [ ] 22.1 Design: release/versioning policy and deprecation plan
  - [ ] 22.2 Implementation: release scripts and changelog automation
  - [ ] 22.3 Tests: release dry-run in CI
  - [ ] 22.4 Docs: release and deprecation guide
  - [ ] 22.5 Code review
  - [ ] 22.6 Doc review
  - [ ] 22.7 Unit test review

- [ ] 23. As a user, I want panels to be positionable and collapsible.
  - [ ] 23.1 Design: panel API and positioning rules
  - [ ] 23.2 Implementation: panel container and collapse behaviour
  - [ ] 23.3 Tests: UI behaviour tests
  - [ ] 23.4 Docs: panel config examples
  - [ ] 23.5 Code review
  - [ ] 23.6 Doc review
  - [ ] 23.7 Unit test review

- [ ] 24. As a user, I want a configurable search panel with placeholder, debounce, and scope.
  - [ ] 24.1 Design: search API and debounce strategy
  - [ ] 24.2 Implementation: `sg-search-panel` with debounce and scope
  - [ ] 24.3 Tests: debounce and scope tests
  - [ ] 24.4 Docs: search usage examples
  - [ ] 24.5 Code review
  - [ ] 24.6 Doc review
  - [ ] 24.7 Unit test review

- [ ] 25. As a user, I want visual/display options exposed (row numbers, alignment, ellipsis, wrap text, border toggles, fonts, CSS hooks).
  - [ ] 25.1 Design: style props and CSS hook conventions
  - [ ] 25.2 Implementation: expose props + CSS variables
  - [ ] 25.3 Tests: visual smoke tests and snapshot tests
  - [ ] 25.4 Docs: style guide and examples
  - [ ] 25.5 Code review
  - [ ] 25.6 Doc review
  - [ ] 25.7 Unit test review

- [ ] 26. As a user, I want the column chooser to optionally preserve original column order when toggling visibility.
  - [ ] 26.1 Design: column chooser behaviour and preserve-order flag
  - [ ] 26.2 Implementation: `sg-column-chooser-panel` with preserve-order
  - [ ] 26.3 Tests: behaviour tests for ordering
  - [ ] 26.4 Docs: usage and examples
  - [ ] 26.5 Code review
  - [ ] 26.6 Doc review
  - [ ] 26.7 Unit test review

- [ ] 27. As a user, I want filter controls to support inline row or panel modes with clearable inputs and debounce.
  - [ ] 27.1 Design: filter-mode options and debounce/clearable specs
  - [ ] 27.2 Implementation: inline `sg-filter-row` and `sg-filter-panel`
  - [ ] 27.3 Tests: debounce and clear behaviour
  - [ ] 27.4 Docs: configuration examples
  - [ ] 27.5 Code review
  - [ ] 27.6 Doc review
  - [ ] 27.7 Unit test review

- [ ] 28. As a user, I want paging controls to be individually configurable (showGotoPage, showJumpToStart/End, showNext/Prev).
  - [ ] 28.1 Design: paging UI options and prop names
  - [ ] 28.2 Implementation: expose individual control toggles
  - [ ] 28.3 Tests: UI visibility and behaviour tests
  - [ ] 28.4 Docs: paging config examples
  - [ ] 28.5 Code review
  - [ ] 28.6 Doc review
  - [ ] 28.7 Unit test review

- [ ] 29. As a developer, I want columns to accept local data-sources and mapping props.
  - [ ] 29.1 Design: column local data source props and mapping semantics
  - [ ] 29.2 Implementation: column-level data-source handling
  - [ ] 29.3 Tests: mapping and data-source unit tests
  - [ ] 29.4 Docs: column data-source examples
  - [ ] 29.5 Code review
  - [ ] 29.6 Doc review
  - [ ] 29.7 Unit test review

- [ ] 30. As a user, I want contextual tooltips and per-column or per-grid loading indicators.
  - [ ] 30.1 Design: tooltip and loading indicator API
  - [ ] 30.2 Implementation: tooltip component and loading state
  - [ ] 30.3 Tests: tooltip accessibility and loading behaviour
  - [ ] 30.4 Docs: usage examples
  - [ ] 30.5 Code review
  - [ ] 30.6 Doc review
  - [ ] 30.7 Unit test review

- [ ] 31. As a developer, I want automated CI pipelines that run lint, type-checks, unit tests, and security scans on every PR.
  - [ ] 31.1 Design: CI stages and checks
  - [ ] 31.2 Implementation: GitHub Actions workflows (lint, type, test, security)
  - [ ] 31.3 Tests: verify CI runs on PRs
  - [ ] 31.4 Docs: CI expectations and contribution guide
  - [ ] 31.5 Code review
  - [ ] 31.6 Doc review
  - [ ] 31.7 Unit test review

- [ ] 32. As a developer, I want pre-commit hooks (format, lint), a code-style config, and contributor onboarding docs.
  - [ ] 32.1 Design: pre-commit hooks and style rules
  - [ ] 32.2 Implementation: add Husky/lefthook + lint-staged
  - [ ] 32.3 Tests: verify hooks block bad commits locally
  - [ ] 32.4 Docs: contributor onboarding
  - [ ] 32.5 Code review
  - [ ] 32.6 Doc review
  - [ ] 32.7 Unit test review

- [ ] 33. As a developer, I want generated API documentation published and versioned per release.
  - [ ] 33.1 Design: doc generator and publishing strategy
  - [ ] 33.2 Implementation: typedoc or similar + docs site pipeline
  - [ ] 33.3 Tests: doc generation in CI
  - [ ] 33.4 Docs: doc site content and navigation
  - [ ] 33.5 Code review
  - [ ] 33.6 Doc review
  - [ ] 33.7 Unit test review

## Tasks derived from `docs/grid-prd.md`

Below is a structured task list created from the PRD. Each user story is a high-level task followed by bite-sized subtasks (design, implementation, tests, docs, reviews). Each line starts on a new line, uses numbered numbering and a checkbox as requested. Save this file as `docs/tasks.md`.

```markdown
- [ ] 1. As a user, I want filter and sort so I can find information quickly.
  - [ ] 1.1 Design: define filter & sort API (props/events/edge-cases)
  - [ ] 1.2 Implementation: composable and header UI
    - [ ] 1.2.1 Implement sorting logic (multi-column, direction)
    - [ ] 1.2.2 Implement per-column filter controls (string/number/date)
    - [ ] 1.2.3 Wire sort/filter to data-source adapters (client/server)
  - [ ] 1.3 Tests: unit tests for composables
  - [ ] 1.4 Tests: component tests (header + interaction)
  - [ ] 1.5 Docs: usage examples + API docs
  - [ ] 1.6 Code review
  - [ ] 1.7 Doc review
  - [ ] 1.8 Unit test review

- [ ] 2. As a user, I want pagination with configurable page size and client/server paging so I can navigate large datasets.
  - [ ] 2.1 Design: paging adapter interface (client/server)
  - [ ] 2.2 Implementation: paging composable + `sg-paging-panel`
    - [ ] 2.2.1 Implement client-side paging
    - [ ] 2.2.2 Implement server-side paging adapter contract
    - [ ] 2.2.3 Add page-size controls and UI options
  - [ ] 2.3 Tests: unit tests for adapters
  - [ ] 2.4 Tests: integration test with large dataset
  - [ ] 2.5 Docs: examples showing both modes
  - [ ] 2.6 Code review
  - [ ] 2.7 Doc review
  - [ ] 2.8 Unit test review

- [ ] 3. As a user, I want selection modes (none, single, multi) and persistence across paging so I can operate on rows.
  - [ ] 3.1 Design: selection API (persist mode, identifiers)
  - [ ] 3.2 Implementation: `sg-selection` composable + UI
    - [ ] 3.2.1 Implement none/single/multi modes
    - [ ] 3.2.2 Implement persistence across pages (store by key)
    - [ ] 3.2.3 Add checkbox/radio UI and keyboard support
  - [ ] 3.3 Tests: unit tests for selection state
  - [ ] 3.4 Tests: component tests with paging
  - [ ] 3.5 Docs: selection usage and caveats
  - [ ] 3.6 Code review
  - [ ] 3.7 Doc review
  - [ ] 3.8 Unit test review

- [ ] 4. As a user, I want editing modes (none, inline, popup) with validation so I can correct data safely.
  - [ ] 4.1 Design: editors API, validation hooks, events
  - [ ] 4.2 Implementation: `sg-editing` + editor template support
    - [ ] 4.2.1 Inline editor flow
    - [ ] 4.2.2 Popup editor flow
    - [ ] 4.2.3 Validation and error display
    - [ ] 4.2.4 Editor templates registration API
  - [ ] 4.3 Tests: unit tests for validation and editor flows
  - [ ] 4.4 Tests: component tests for inline and popup
  - [ ] 4.5 Docs: editor configuration and examples
  - [ ] 4.6 Code review
  - [ ] 4.7 Doc review
  - [ ] 4.8 Unit test review

- [ ] 5. As a developer, I want easy installation (npm/yarn/pnpm) and simple initialization so I can add the grid quickly.
  - [ ] 5.1 Design: package entrypoints and examples
  - [ ] 5.2 Implementation: package.json scripts and build outputs
    - [ ] 5.2.1 Add `dev`, `build`, `test`, `example` scripts
  - [ ] 5.2.2 Ensure TypeScript declaration generation
  - [ ] 5.2.3 Build outputs and bundling targets (ESM, CJS, types, browser UMD/UMD-like)
  - [ ] 5.3 Tests: smoke install/test in example
  - [ ] 5.4 Docs: installation and quickstart
  - [ ] 5.5 Code review
  - [ ] 5.6 Doc review
  - [ ] 5.7 Unit test review

- [ ] 6. As a developer, I want first-class TypeScript typings and clear public APIs for discoverability.
  - [ ] 6.1 Design: public API surface and typing strategy
  - [ ] 6.2 Implementation: add types, refine props and events
    - [ ] 6.2.1 Export types for composables and components
    - [ ] 6.2.2 Add examples in TS showing typing benefits
  - [ ] 6.3 Tests: type-check CI job
  - [ ] 6.4 Docs: API reference with types
  - [ ] 6.5 Code review
  - [ ] 6.6 Doc review
  - [ ] 6.7 Unit test review

- [ ] 7. As a user, I want support for common column data types and custom cell templates.
  - [ ] 7.1 Design: column type plugin API and template registration
  - [ ] 7.2 Implementation: built-in types (string, number, date, boolean, link, image)
    - [ ] 7.2.1 Implement date/time with timezone awareness
    - [ ] 7.2.2 Implement boolean renderers (checkbox/yes-no)
    - [ ] 7.2.3 Implement custom cell-template API
  - [ ] 7.2.4 Tests: timezone handling tests (DST, offsets, display vs storage)
  - [ ] 7.2.5 Docs: timezone guidance and examples
  - [ ] 7.3 Tests: unit tests per type + template rendering
  - [ ] 7.4 Tests: example app usage
  - [ ] 7.5 Docs: type usage and how to create custom templates
  - [ ] 7.6 Code review
  - [ ] 7.7 Doc review
  - [ ] 7.8 Unit test review

- [ ] 8. As a user, I want accessibility basics: keyboard navigation and screen-reader labels.
  - [ ] 8.1 Design: keyboard nav flows and ARIA semantics
  - [ ] 8.2 Implementation: add keyboard handlers and ARIA attributes
    - [ ] 8.2.1 Row and cell focus management
    - [ ] 8.2.2 Announcements for dynamic changes (aria-live)
  - [ ] 8.3 Tests: accessibility tests (axe or similar)
  - [ ] 8.4 Docs: accessibility notes and keyboard shortcuts
  - [ ] 8.5 Code review
  - [ ] 8.6 Doc review
  - [ ] 8.7 Unit test review

- [ ] 9. As a developer, I want a minimal example app demonstrating components and flows.
  - [ ] 9.1 Design: example app scenarios to cover (paging, editing, selection)
  - [ ] 9.2 Implementation: `examples/minimal` enhancements
    - [ ] 9.2.1 Add pages demonstrating MVP features
    - [ ] 9.2.2 Wire local dev script for examples
  - [ ] 9.3 Tests: smoke-run example in CI
  - [ ] 9.4 Docs: guide to run the example
  - [ ] 9.5 Code review
  - [ ] 9.6 Doc review
  - [ ] 9.7 Unit test review

- [ ] 10. As a user, I want grouping and aggregations and a summary row.
  - [ ] 10.1 Design: grouping model and summary calculation API
  - [ ] 10.2 Implementation: `sg-group-panel` + `sg-summary-row`
    - [ ] 10.2.1 Implement group dropzone and group-by logic
    - [ ] 10.2.2 Implement aggregation functions (count,sum,avg,min,max)
  - [ ] 10.3 Tests: unit tests for aggregations
  - [ ] 10.4 Tests: component tests for grouped UI
  - [ ] 10.5 Docs: grouping and aggregation examples
  - [ ] 10.6 Code review
  - [ ] 10.7 Doc review
  - [ ] 10.8 Unit test review

- [ ] 11. As a user, I want bulk-edit and batch actions for multiple selected rows.
  - [ ] 11.1 Design: batch action API and UX
  - [ ] 11.2 Implementation: batch action toolbar and handlers
    - [ ] 11.2.1 Implement selection->batch action flow
    - [ ] 11.2.2 Add optimistic UI and rollback for failures
  - [ ] 11.3 Tests: unit/integration tests for batch actions
  - [ ] 11.4 Docs: batch actions examples
  - [ ] 11.5 Code review
  - [ ] 11.6 Doc review
  - [ ] 11.7 Unit test review

- [ ] 12. As a user, I want conditional formatting and custom renderers.
  - [ ] 12.1 Design: conditional formatting rules and renderer API
  - [ ] 12.2 Implementation: renderer registration and rule engine
  - [ ] 12.3 Tests: unit tests for rule evaluation and renderers
  - [ ] 12.4 Docs: examples of conditional formatting
  - [ ] 12.5 Code review
  - [ ] 12.6 Doc review
  - [ ] 12.7 Unit test review

- [ ] 13. As a developer, I want theming hooks and style isolation options.
  - [ ] 13.1 Design: CSS tokens and optional shadow DOM wrapper
  - [ ] 13.2 Implementation: `src/styles/tokens.css` and token helper
  - [ ] 13.3 Tests: visual smoke tests for themes
  - [ ] 13.4 Docs: theming guide and examples
  - [ ] 13.5 Code review
  - [ ] 13.6 Doc review
  - [ ] 13.7 Unit test review

- [ ] 14. As a developer, I want plugin/extension API and lifecycle hooks/events.
  - [ ] 14.1 Design: plugin API surface and lifecycle events
  - [ ] 14.2 Implementation: event system and plugin registration
  - [ ] 14.3 Tests: unit tests for event/plugin behaviour
  - [ ] 14.4 Docs: plugin API docs and example plugin
  - [ ] 14.5 Code review
  - [ ] 14.6 Doc review
  - [ ] 14.7 Unit test review

- [ ] 15. As a developer, I want test fixtures, unit/integration tests, and CI configuration.
  - [ ] 15.1 Design: test strategy and CI workflow
  - [ ] 15.2 Implementation: add Vitest configs, example fixtures, and CI pipeline
  - [ ] 15.2.1 Add Storybook and visual-regression test harness (Chromatic/Percy/Playwright snapshots)
  - [ ] 15.3 Tests: add baseline unit tests and integration tests
  - [ ] 15.3.1 Add visual regression tests and baseline screenshots for example pages
  - [ ] 15.4 Docs: testing guide
  - [ ] 15.5 Code review
  - [ ] 15.6 Doc review
  - [ ] 15.7 Unit test review

- [ ] 16. As a user, I want streaming/push-updated rows and conflict-resolution strategies.
  - [ ] 16.1 Design: real-time update model and conflict resolution options
  - [ ] 16.2 Implementation: optional streaming adapter + merge strategies
  - [ ] 16.3 Tests: integration tests for streaming and conflict resolution
  - [ ] 16.4 Docs: guidance and best practices
  - [ ] 16.5 Code review
  - [ ] 16.6 Doc review
  - [ ] 16.7 Unit test review

- [ ] 17. As a user, I want offline/cached access and sync with merge rules.
  - [ ] 17.1 Design: offline sync model and conflict rules
  - [ ] 17.2 Implementation: local cache layer and sync routines
  - [ ] 17.3 Tests: offline sync tests
  - [ ] 17.4 Docs: offline usage and caveats
  - [ ] 17.5 Code review
  - [ ] 17.6 Doc review
  - [ ] 17.7 Unit test review

- [ ] 18. As a user, I want real-time collaboration features and notifications.
  - [ ] 18.1 Design: collaboration model and notification UX
  - [ ] 18.2 Implementation: collaborative adapter (optional)
  - [ ] 18.3 Tests: collaboration simulation tests
  - [ ] 18.4 Docs: collaboration guide
  - [ ] 18.5 Code review
  - [ ] 18.6 Doc review
  - [ ] 18.7 Unit test review

- [ ] 19. As a user, I want advanced import/export (Excel/PDF) and print-friendly reports.
  - [ ] 19.1 Design: import/export feature spec
  - [ ] 19.2 Implementation: CSV/Excel/PDF export + print styles
  - [ ] 19.3 Tests: import/export unit tests and round-trip tests
  - [ ] 19.4 Docs: import/export usage
  - [ ] 19.5 Code review
  - [ ] 19.6 Doc review
  - [ ] 19.7 Unit test review

- [ ] 20. As a developer, I want debug/logging hooks and runtime warnings for misconfiguration.
  - [ ] 20.1 Design: logger adapter and structured warnings
  - [ ] 20.2 Implementation: logger adapter + prop validation warnings
  - [ ] 20.3 Tests: tests for warnings and logger
  - [ ] 20.4 Docs: diagnostics and troubleshooting
  - [ ] 20.5 Code review
  - [ ] 20.6 Doc review
  - [ ] 20.7 Unit test review

- [ ] 21. As a developer, I want stable semantic versioning, a deprecation policy, and automated release tooling.
  - [ ] 21.1 Design: release/versioning policy and deprecation plan
  - [ ] 21.2 Implementation: release scripts and changelog automation
  - [ ] 21.3 Tests: release dry-run in CI
  - [ ] 21.4 Docs: release and deprecation guide
  - [ ] 21.5 Code review
  - [ ] 21.6 Doc review
  - [ ] 21.7 Unit test review

- [ ] 22. As a user, I want panels to be positionable and collapsible.
  - [ ] 22.1 Design: panel API and positioning rules
  - [ ] 22.2 Implementation: panel container and collapse behaviour
  - [ ] 22.3 Tests: UI behaviour tests
  - [ ] 22.4 Docs: panel config examples
  - [ ] 22.5 Code review
  - [ ] 22.6 Doc review
  - [ ] 22.7 Unit test review

- [ ] 23. As a user, I want a configurable search panel with placeholder, debounce, and scope.
  - [ ] 23.1 Design: search API and debounce strategy
  - [ ] 23.2 Implementation: `sg-search-panel` with debounce and scope
  - [ ] 23.3 Tests: debounce and scope tests
  - [ ] 23.4 Docs: search usage examples
  - [ ] 23.5 Code review
  - [ ] 23.6 Doc review
  - [ ] 23.7 Unit test review

- [ ] 24. As a user, I want visual/display options exposed (row numbers, alignment, ellipsis, wrap text, border toggles, fonts, CSS hooks).
  - [ ] 24.1 Design: style props and CSS hook conventions
  - [ ] 24.2 Implementation: expose props + CSS variables
  - [ ] 24.3 Tests: visual smoke tests and snapshot tests
  - [ ] 24.4 Docs: style guide and examples
  - [ ] 24.5 Code review
  - [ ] 24.6 Doc review
  - [ ] 24.7 Unit test review

- [ ] 25. As a user, I want the column chooser to optionally preserve original column order when toggling visibility.
  - [ ] 25.1 Design: column chooser behaviour and preserve-order flag
  - [ ] 25.2 Implementation: `sg-column-chooser-panel` with preserve-order
  - [ ] 25.3 Tests: behaviour tests for ordering
  - [ ] 25.4 Docs: usage and examples
  - [ ] 25.5 Code review
  - [ ] 25.6 Doc review
  - [ ] 25.7 Unit test review

- [ ] 26. As a user, I want filter controls to support inline row or panel modes with clearable inputs and debounce.
  - [ ] 26.1 Design: filter-mode options and debounce/clearable specs
  - [ ] 26.2 Implementation: inline `sg-filter-row` and `sg-filter-panel`
  - [ ] 26.3 Tests: debounce and clear behaviour
  - [ ] 26.4 Docs: configuration examples
  - [ ] 26.5 Code review
  - [ ] 26.6 Doc review
  - [ ] 26.7 Unit test review

- [ ] 27. As a user, I want paging controls to be individually configurable (showGotoPage, showJumpToStart/End, showNext/Prev).
  - [ ] 27.1 Design: paging UI options and prop names
  - [ ] 27.2 Implementation: expose individual control toggles
  - [ ] 27.3 Tests: UI visibility and behaviour tests
  - [ ] 27.4 Docs: paging config examples
  - [ ] 27.5 Code review
  - [ ] 27.6 Doc review
  - [ ] 27.7 Unit test review

- [ ] 28. As a developer, I want columns to accept local data-sources and mapping props.
  - [ ] 28.1 Design: column local data source props and mapping semantics
  - [ ] 28.2 Implementation: column-level data-source handling
  - [ ] 28.3 Tests: mapping and data-source unit tests
  - [ ] 28.4 Docs: column data-source examples
  - [ ] 28.5 Code review
  - [ ] 28.6 Doc review
  - [ ] 28.7 Unit test review

- [ ] 29. As a user, I want contextual tooltips and per-column or per-grid loading indicators.
  - [ ] 29.1 Design: tooltip and loading indicator API
  - [ ] 29.2 Implementation: tooltip component and loading state
  - [ ] 29.3 Tests: tooltip accessibility and loading behaviour
  - [ ] 29.4 Docs: usage examples
  - [ ] 29.5 Code review
  - [ ] 29.6 Doc review
  - [ ] 29.7 Unit test review

- [ ] 30. As a developer, I want automated CI pipelines that run lint, type-checks, unit tests, and security scans on every PR.
  - [ ] 30.1 Design: CI stages and checks
  - [ ] 30.2 Implementation: GitHub Actions workflows (lint, type, test, security)
  - [ ] 30.3 Tests: verify CI runs on PRs
  - [ ] 30.4 Docs: CI expectations and contribution guide
  - [ ] 30.5 Code review
  - [ ] 30.6 Doc review
  - [ ] 30.7 Unit test review

- [ ] 31. As a developer, I want pre-commit hooks (format, lint), a code-style config, and contributor onboarding docs.
  - [ ] 31.1 Design: pre-commit hooks and style rules
  - [ ] 31.2 Implementation: add Husky/lefthook + lint-staged
  - [ ] 31.3 Tests: verify hooks block bad commits locally
  - [ ] 31.4 Docs: contributor onboarding
  - [ ] 31.5 Code review
  - [ ] 31.6 Doc review
  - [ ] 31.7 Unit test review

- [ ] 32. As a developer, I want generated API documentation published and versioned per release.
  - [ ] 32.1 Design: doc generator and publishing strategy
  - [ ] 32.2 Implementation: typedoc or similar + docs site pipeline
  - [ ] 32.3 Tests: doc generation in CI
  - [ ] 32.4 Docs: doc site content and navigation
  - [ ] 32.5 Code review
  - [ ] 32.6 Doc review
  - [ ] 32.7 Unit test review
```

---

Generated from `docs/grid-prd.md`. Each top-level item maps to a numbered PRD user story and includes design, implementation, testing and review tasks per your instructions.

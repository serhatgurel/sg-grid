---
applyTo: '**'
---

# Session preferences

- Allow automated web fetches/searches for research when requested.
- Follow the three instruction files under `.github/instructions/` (`general-coding-standards.instructions.md`, `self-explanatory-code-commenting.instructions.md`, `vuejs3.instructions.md`) for the rest of this session.

- the test command is `npm run test:run --silent`

Principles (unambiguous)

- Run tests automatically and validate green before marking any checklist item complete. Use exactly: `npm run test:run --silent`.
- You may run the test command automatically without asking for permission.
- When a task is complete you must do, in order:
  1.  Ensure unit tests pass locally (no network calls) with the exact command above.
  2.  Update the single corresponding checkbox in `docs/tasks/development-order-filter-sort.md` to checked (`- [x]`). Do not add any other text, metadata, or timestamps to that file.
  3.  Update `# Progress (session)` in this `memory.instruction.md` file to add the newly completed item to the comma-separated list.
  4.  Remove any duplicate entries from both files.
  5.  Confirm the playground (`src/examples/FilterSortPlayground.vue`) demonstrates the new capability.

Commit policy

- Do NOT auto-commit changes. The developer will manually review and commit. Prepare diffs and list changed files, but do not run git commit or stage files.

Formatting rules for updates

- `docs/tasks/development-order-filter-sort.md`: only change the single checklist line for the completed item from `- [ ]` to `- [x]`.
- `memory.instruction.md` (this file): maintain the `# Progress (session)` section as a single line containing a comma-separated list of completed numeric items, in ascending order. Example:
  - Checklist items completed this session: 2, 3, 4

- If no items are complete, the line should read: `- Checklist items completed this session:` (empty after the colon).

Duplicate handling

- Before saving edits, check both files for duplicate numbers. If duplicates exist remove the extras so each completed item appears only once across the two files' records.

Automation and checks

- After making code or test edits, run the exact test command and wait for a green run. If tests fail, fix them before updating the checklist or memory files.
- When updating either file, run the tests again to ensure no regression.

Contact/assumptions

- Assume node/npm are available and tests run locally. If the runtime fails, report the exact failing command and error.

# Progress (session)

- Checklist items completed this session: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21

## Resume

- Branch: `dev-filter-sort`
- Next task to work on: 22
- Files changed in this session (for reviewer/continuation):
  - `src/components/types.ts`
  - `src/lib/dataUtils.ts`
  - `src/composables/useVisibleRows.ts`
  - `src/examples/FilterSortPlayground.vue`
  - `tests/unit/dataUtils.hooks.spec.ts`
  - `docs/tasks/development-order-filter-sort.md`
  - `.github/instructions/memory.instructions.md`
  - `tests/unit/SgGrid.pagination.spec.ts`
  - `tests/unit/SgGrid.headerEmits.spec.ts`
  - `docs/server-side-playground.md`

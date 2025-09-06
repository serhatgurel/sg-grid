# Performance recommendations & fast-fail behaviour

This short guide documents the project's recommended performance practices for the grid and where the library implements fast-fail behaviour to avoid unnecessary work on empty inputs.

Threshold guidance

- Client-side sorting and filtering are useful for small to medium datasets. For interactive UIs we recommend using server-side mode when datasets exceed ~5,000 rows. This is a heuristic; the exact threshold depends on your users' devices and the complexity of column-level comparators.
- If you expect frequent, complex filtering (many operators, heavy coercion, or custom column hooks) prefer `serverSide=true` earlier (for example >1,000 rows) or paginate on the server.

Why server-side helps

- Offloads CPU work from the client to backend servers which typically have more CPU and memory.
- Removes the need to ship the entire dataset to the client which can improve perceived load time and memory usage.

Built-in fast-fail behaviour

The codebase already implements several fast-fail/cheap-paths to avoid wasted work when no filter or sort is applied:

- `applyFilters(rows, filter, ...)` returns a shallow copy of `rows` immediately when `filter` is null or empty. See `src/lib/dataUtils.ts` (`applyFilters` fast-fail near the top of the function).
- `applySort(rows, sort, ...)` returns a shallow copy when `sort` is null or empty. See `src/lib/dataUtils.ts` (`applySort` fast-fail at function start).
- The `useVisibleRows` composable checks for both empty filter and sort and returns the underlying rows shallow copy quickly when nothing needs to be done. See `src/composables/useVisibleRows.ts` (`noFilter && noSort` fast-path).

Micro-optimizations (optional)

- If you measure hotspots in a large app, consider memoizing repeated filter/sort combinations (for example a small LRU cache keyed by JSON-serialized filter+sort) — avoid global caches unless carefully invalidated when rows change.
- Batch heavy computation off the main thread (Web Worker) for very large datasets and complex comparator logic.

How to validate locally

- Use the playground `src/examples/FilterSortPlayground.vue` to toggle `serverSide` and exercise filters/sorts on sample data.
- Measure with browser devtools performance profiler when verifying client-side thresholds.

This document is intentionally short. If you'd like I can add a small benchmark script under `scripts/` to run simple micro-benchmarks measuring `applyFilters` and `applySort` across dataset sizes.

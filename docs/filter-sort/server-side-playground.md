# Server-side Playground Example

This short note explains the server-side demo in `src/examples/FilterSortPlayground.vue`.

- Toggle the `serverSide` checkbox in the playground to switch modes.
- When `serverSide=true`, header interactions (sort clicks, filter input) will emit `update:sort`, `update:filter`, and a `request:page` event.
- The playground demonstrates a simple handler for `request:page` that applies `applyFilters` and `applySort` on the demo dataset and replaces the grid `rows` with the result. This simulates how a server would respond with sorted/filtered data.

Use this example as a starting point when wiring a real server: send `{ page, pageSize, sort, filter }` to your API and update the grid's `rows` prop with the returned page of data.

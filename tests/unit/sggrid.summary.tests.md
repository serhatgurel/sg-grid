## SgGrid — Summary of Tests

1. As a developer, I want the grid to use `props.columns` when provided, such that declared or inferred columns are ignored and headers match the prop list.

2. As a developer, I want declarative `<SgColumn>` children detected from the default slot, such that kebab-case (`data-field`) and camelCase (`dataField`) props both produce columns in the correct order.

3. As a developer, I want the grid to infer columns from `rows` when no columns are provided, such that headers represent the union (or first-row heuristic) of row keys.

4. As a developer, I want `getRowKey` to accept a string key name, such that each `<tr>` uses `row[rowKey]` as its key and keys remain stable.

5. As a developer, I want `getRowKey` to accept a function, such that custom composite keys can be generated for each row.

6. As a developer, I want `getRowKey` fallback behaviour when `rowKey` is missing, such that the fallback is a stable `JSON.stringify` of the row.

7. As a developer, I want each cell to render an `SgCol` and receive correct props (`dataRow`, `dataField`, `label`), such that cell renderers have the data they need.

8. As a developer, I want a `<caption>` to render when `props.caption` is set, such that table-level labeling is present for accessibility.

9. As a developer, I want slot children without a `field`/`data-field` to be ignored when building declared columns, such that only valid column definitions are used.

10. As a developer, I want the grid to render no body rows when `rows` is empty or undefined, such that headers appear (if columns exist) but the body is empty.

11. As a developer, I want the component to be reactive to `columns` updates, such that `wrapper.setProps({ columns: newCols })` updates headers accordingly.

12. As a developer, I want the component to be reactive to `rows` updates, such that replacing or updating `rows` changes the rendered body rows.

13. As a developer, I want stable and unique keys for large datasets, such that no key collisions occur in realistic scenarios (edge/perf test).

14. As a developer, I want a small integration/smoke test rendering with the real `SgCol`, such that the full table structure is validated (snapshot or DOM assertions).

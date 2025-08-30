## SgColumn — Summary of Tests

1. As a consumer, I want `SgColumn` to render `props.value` when `dataRow` is undefined, such that a fallback display appears.

2. As a consumer, I want `SgColumn` to prefer `dataRow[dataField]` over `value`, such that row data overrides fallback props.

3. As a consumer, I want falsy but valid values (`0`, `false`, `''`) to render correctly, such that they are not treated as missing.

4. As a consumer, I want a missing key on `dataRow` to render an empty default display (`''`), such that absent fields don't show `undefined` text.

5. As a consumer, I want slot content to replace default rendering and receive correct slot props (`{ id, name, value, dataRow, dataField }`), such that custom renderers can use the data.

6. As a consumer, I want slot prop aliases to be available (`name` as alias for `dataField`, `row` as alias for `dataRow`, and `field`), such that consumers can access the values using older or newer API names.

7. As a developer, I want mutating the same `dataRow` object to update the cell, such that in-place changes reflect in the DOM.

8. As a developer, I want replacing the `dataRow` object via `setProps` to update the cell, such that parent-level replacements re-render correctly.

9. As a developer, I want `columnData.name` to prefer `caption` then `label`, such that display names follow the defined priority.

10. As a consumer, I want the `slotProps.data` shape to include `{ id, name, value, dataRow, dataField }`, such that consumers receive a predictable API.

11. As a developer, I want the component to render a `td` element and act as a proper table cell, such that table semantics and basic styling are retained (smoke test).

12. Optional: As a product owner, I want an explicit test for nested-field behaviour if added later, such that `a.b.c` style paths are validated (note: not currently supported).

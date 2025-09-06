For column "{column.caption ?? column.field}" (key: {column.key}):

1. Filter indicator

- If column.filterable === true then assert a visible filter indicator exists:
  - selector: [data-test-filter-indicator]
  - it contains the filter SVG icon (data-test or <img.sg-icon>) and a visually-hidden label "Filterable"
  - the visual icon container must be aria-hidden="true"

2. Sort indicator

- If column.sortable === true then assert a visible sort indicator exists:
  - selector: [data-test-sort-indicator]
  - when not sorted show neutral SVG sort icon
  - when sorted show active arrow SVG (up or down) in .sg-indicator-active and a visually-hidden symbol "▲" or "▼"
  - header cell (<th>) must expose aria-sort with values: undefined/absent (unsorted), "ascending", "descending"

3. Both icons

- If the column is both filterable and sortable, assert both indicators exist simultaneously and are visually separate (filter at left, sort at right).

4. No overlap rule

- Assert header text does not overlap icon bounding boxes:
  - compute boundingClientRect for header text element and each indicator; they must not intersect.
  - alternatively assert sufficient padding: th > div has padding-left >= indicator width + gap and padding-right >= indicator width + gap.

5. Long-caption behavior

- If the rendered header text exceeds available space:
  - header text must use CSS truncation (text-overflow: ellipsis / overflow: hidden / white-space: nowrap)
  - the full caption must be available to users via a tooltip/title attribute or aria-label set to the full caption.

6. Width-exception

- The only permitted violation of step 5 is when author explicitly sets a column width that makes ellipsis impossible. In that case:
  - assert the test observes the provided width and record that truncation rule is intentionally not met (test should pass with a note).

Notes / implementation hints

- Prefer querying by data-test attributes to avoid brittle selectors.
- For overlap checks prefer JS geometry assertions (getBoundingClientRect) rather than visually comparing strings.
- For tooltips, prefer checking title or an accessible tooltip element (aria-describedby) rather than relying on hover.

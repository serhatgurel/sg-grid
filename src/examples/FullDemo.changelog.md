# FullDemo Changelog

## 0.1.0 - Initial demo

- Add `FullDemo.vue` example showcasing declarative and data-driven usage of `SgGrid`.
- Include many fields from `people.json` (nested array/object paths, join helpers for lists).
- Add a changelog section in the demo that displays this file's contents.

## Notes

- Keep this file next to the demo so reviewers can update the demo changelog in one place.

- UI & UX refinements (headers / filter editors):
  - Reworked header layout so filter icon, truncated caption, and sort icon order is consistent and visually compact.
  - Added a robust truncation tooltip directive that sets a title only when header text is actually truncated.
  - Header filter editors now show a left-aligned search icon and a right-side clear/close icon; the close icon is only visible when the input contains text.
  - Filter editor styling: empty state shows a light-gray background; on focus the editor becomes white and icons hide so the caret is the primary focus.
  - Filter inputs emit debounced `update:filter` events and client-side filtering is applied when `serverSide` is false; when `serverSide` is true, filters only emit events and the host handles filtering.

  ## 0.2.0 - Header & scrolling refinements
  - Add horizontal scrolling support for wide grids: the main grid table is now wrapped in a scrollable container so grids with many columns show a horizontal scrollbar instead of overflowing the layout.
  - Tighten header layout and filter UX: filter icon, caption truncation, and sort icon order were refined to be visually compact and consistent.
  - Improved truncation tooltip: the header tooltip is set only when the header text is actually truncated (avoids redundant titles).
  - Filter editor polish: left-aligned search icon, right-side clear icon (visible only when input has text), empty-state background, and white background on focus; inputs emit debounced `update:filter` as before.
  - Tests run and passed after these UI changes.

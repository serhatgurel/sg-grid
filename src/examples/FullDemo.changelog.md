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

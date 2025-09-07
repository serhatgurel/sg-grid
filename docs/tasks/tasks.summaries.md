# Tasks — Simplified master checklist

All tasks consolidated into one simplified, ordered checklist. Sub-points capture important details where useful. Every section below includes explicit mobile-friendly features and testing notes.

- [ ] Minimal grid & mobile demo (early)
  - Declarative API and props-based configuration
  - Early mobile-first demo/playground included: responsive page that showcases narrow viewports and touch behaviors
  - Mobile-first behaviors: fluid columns, simplified header, tap/swipe/long-press support, large hit targets, condensed toolbar
  - Presets: stacked/card view, full-screen editors for mobile, swipe-to-reveal row actions
  - Quick test dataset and manual QA scenarios (small/medium/large), plus performance checks (adaptive virtualization, reduced rendering)

- [ ] Data operations
  - Sorting
    - Ascending / descending, multi-column, sort indicators
    - Mobile: simplified sorting UI, tap-to-cycle sort, large touch targets, avoid complex dropdowns
  - Filtering
    - Operators: equals, contains, starts/ends with, comparisons (>, >=, <, <=), range, set (in/not in), null/empty, boolean, regex, custom
    - Negation (NOT)
    - Modes: single-column, multi-column, compound (AND / OR)
  - Display applied filters: compact chips/tags showing field, operator and value(s); editable and removable; "Clear all" and per-filter remove controls; show active filter count
  - Mobile: slide-in filter panel, compact chips/tags for active filters (tap to edit/remove), server-side filtering option for heavy queries
  - Searching / global search panel
    - Mobile: sticky search bar or slide-down search, clear button, debounce for live search, appropriate input keyboard types

- [ ] Paging & virtualization
  - Pagination: page sizes, page navigation
  - Virtual scrolling / windowing
  - Mobile: infinite scroll or large-touch pagination controls, adaptive page sizes for small screens, smooth touch scrolling

- [ ] Selection & keyboard
  - Selection modes: single, multi, checkbox, radio, range (Shift+click)
  - Bulk actions: select page, select filtered, select all pages, invert selection
  - Keyboard navigation and accessibility (aria, focus management)
  - Mobile: long-press to select, visible checkbox mode, selection toolbar pinned to top/bottom, clear selection gesture
  - Context menu / right-click
    - Desktop: native or custom right-click menu for rows/columns with contextual actions (edit, delete, filter by, copy value, pin column)
    - Keyboard: support ContextMenu key or Shift+F10 to open the menu
    - Mobile: long-press opens a bottom-sheet or contextual toolbar with the same actions, and allow swipe reveal as alternative

- [ ] Editing & validation
  - Editing modes: inline, popup, form, batch
  - Row actions: add, edit, delete, save/cancel
  - Validation: required, type checks, custom, async
  - Mobile: full-screen editor mode, large inputs, mobile-optimized pickers (date/time, numeric), autosave/merge conflict UI, confirm dialogs sized for touch

- [ ] Columns & cell rendering
  - Column data types: text, number, date, boolean, enum, image, custom
  - Resizing
  - Reordering & pinning (drag/drop, freeze left/right/top)
  - Custom cell templates and renderers (images, rich HTML, lightbox)
  - Mobile: responsive column priorities, collapse low-priority columns into a details panel or stacked/card view, swipe to reveal row actions, image thumbnails optimized for bandwidth
  - Context menu: per-cell/per-column menu to expose column-specific actions (sort, filter by value, hide/resize), and mobile long-press alternative

- [ ] Grouping & aggregates
  - Grouping and expandable detail rows (nested grids, lazy-load, independent paging/sorting)
  - Aggregations and summary rows
  - Mobile: tap-to-expand groups, show concise summary badges, lazy-load group contents on demand to reduce DOM

- [ ] Formatting & conditional UI
  - Conditional formatting rules
  - Value/display mapping (lookup, foreign-key label mapping, formatters)
  - Mobile: compact badges, high-contrast patterns, truncation with "show more" and accessible tooltip alternatives

- [ ] Panels & controls
  - Positionable / collapsible panels
  - Filter controls: inline and panel modes
  - Configurable search panel
  - Column chooser
  - Display applied filters area / chips bar: sticky or collapsible summary of active filters, expand to show details and edit controls
  - Mobile: panels slide from bottom, full-screen modal filters, persistent bottom action bar, collapsible toolbars that auto-hide while scrolling
  - Context menu integration: allow opening filter/edit actions from a right-click or long-press context menu and expose quick actions in panels

- [ ] Column-level data sources & loading
  - Per-column lookup / async data sources for editors and filters
  - Per-column loading indicators
  - Mobile: lightweight payloads, debounce/throttle remote lookups, skeleton loaders and progressive enhancement

- [ ] Theming & style
  - Theme hooks and customization API (colors, spacing, fonts)
  - Built-in themes (light, dark, navy)
  - Style isolation
  - Mobile: adjustable type scale, increased line-height and spacing options for touch, high-contrast theme and reduced-motion option

- [ ] Import / Export / Print
  - CSV / Excel / JSON export
  - Import mappings and validation
  - Print-friendly reports
  - Mobile: provide server-side export endpoints and share-sheet integration, lightweight previews before download

- [ ] Performance & mobile
  - Performance tuning (virtualization, memoization, incremental rendering)
  - Responsive & touch support: breakpoints, auto-collapse, stacked/card mode
  - Mobile-specific behaviors: gestures, large touch targets, adaptive virtualization
  - Mobile: defer non-critical work, dynamic imports for heavy features, image optimization and network-aware behavior

- [ ] Accessibility & testing
  - Keyboard navigation, ARIA roles, screen-reader support
  - Applied filters visibility: ensure chips and summary are accessible (announce via ARIA, focusable edit/remove), test with screen readers
  - Unit, component, and E2E tests; performance benchmarks
  - Mobile testing: touch gesture automation, cross-device screenshots, screen-reader testing on iOS/Android, manual checklist for manual QA
  - Context menu accessibility: ensure menus are reachable via keyboard (ContextMenu key / Shift+F10), announced by screen-readers, focus-trapped while open; test long-press behavior on mobile with assistive tech

- [ ] Docs, examples & tutorials
  - Examples and demos (playgrounds, minimal/full demos)
  - Guides and tutorials
  - API reference and changelog
  - Examples should include an applied-filters demo: chips bar, editing/removing filters, clear-all, and mobile behavior
  - Mobile: dedicated mobile demo + walkthrough, device screenshots, mobile-specific API tips and limitations
  - Context menu demo: show right-click on desktop and long-press on mobile, list available actions and how to customize them

- [ ] Miscellaneous
  - Misc items, polish, and follow-ups
  - Mobile: small-screen polish items (font scaling, spacing, overflow handling), record device-specific bugs

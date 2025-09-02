## Feature: SG Grid

### Component Hierarchy

- `sg-grid`
  - `sg-grid-panel`
    - `button` / `link`
    - `sg-search-panel` (optional search all data)
  - `sg-filter-row` Each column defines its own filter. Allow custom filter or none.
  - `sg-filter-panel` shows the set filters. these are closable
  - `sg-summary-row` shows column summaries (e.g. count, sum, average, max, min)
  - `sg-column-chooser-panel`
  - `sg-search-panel` search all data
  - `sg-group-panel`

  - `sg-editing` support [none, pop-up, inline].
  - `sg-selection` support [none, single (radio), multi (checkbox)]
  - `sg-paging-panel` (contains paging props)
  - `sg-row` (contains `sg-action` children)
  - `sg-column` (contains `sg-action` children) supports
    - date, time and datetime - should be time-zone-aware
    - string
    - number
    - boolean - out can be true/false, yes/no, checkbox or switch
    - icon
    - image
    - link
    - custom? (e.g. a custom component or template)

### Navigation

### Mobile Support

- Responsive design for all grid components
- Touch-friendly interactions
- Adaptive layouts for different screen sizes

### Import / Export

- Support for importing data from various sources (e.g. CSV, Excel)
- Exporting grid data to different formats (e.g. PDF, CSV)
- Integration with third-party data sources and APIs

## Features

### SG Grid

- Customizable grid layout
- Support for various data types (e.g. text, number, date)
- Built-in sorting and filtering capabilities
- Row and column virtualization for performance

Props

- `data-source` (Array|Function) — default: `[]` — The grid data or a function that returns/promises data. Example: `data-source="people"` or `:data-source="fetchPeople"`.
- `key` (string) — default: `id` — Unique key field for rows. Example: `key="id"`.
- `readonly` (boolean) — default: `false` — When true, disables editing actions. Example: `readonly="true"`.
- `border` (boolean) — default: `true` — Show outer grid border. Example: `border="false"`.
- `font` (string) — default: `''` — Named font style to apply. Example: `font="gridFont"`.
- `virtualize` (boolean) — default: `true` — Enable row/column virtualization for large datasets. Example: `virtualize="true"`.
- `row-numbers` (boolean) — default: `false` — Show line numbers for rows. Example: `row-numbers="true"`.

### SG Column

- Support for various column types (e.g. text, number, date)
- Customizable column templates
- Column resizing and reordering

Props

- `data-field` (string) — default: `''` — The field path in the row data to show in this column. Example: `data-field="name"`.
- `header` (string) — default: `''` — Column header text. Example: `header="Person"`.
- `data-type` (string) — default: `string` — One of `string|number|date|boolean|icon|image|link|custom`. Example: `data-type="date"`.
- `width` (number|string) — default: `auto` — Column width in px or CSS size. Example: `width="120"` or `width="20%"`.
- `sortable` (boolean) — default: `false` — Allow sorting by this column. Example: `sortable="true"`.
- `filterable` (boolean) — default: `false` — Show filter UI for this column. Example: `filterable="true"`.
- `cell-template` (string|component) — default: `null` — Named template or component to render cells. Example: `cell-template="personCellTemplate"`.
- `alignment` (string) — default: `left` — `left|center|right`. Example: `alignment="right"`.

### SG Row

- Support for row selection (single/multi)
- Customizable row templates
- Row resizing and reordering

Props

- `item` (object) — default: `null` — The row data object (passed automatically when used inside the grid). Example: `:item="person"`.
- `index` (string|number) — default: `''` — Row identifier or index value. Example: `index="id"`.
- `readonly` (boolean) — default: `false` — When true disables row-level editing. Example: `readonly="true"`.
- `background-color` (string) — default: `''` — Row background CSS color or variable. Example: `background-color="rowBackgroundColor"`.
- `tooltip` (string) — default: `''` — Tooltip shown for the row. Example: `tooltip="rowTooltip"`.
- `row-numbers` (boolean) — default: `false` — Show row number for this row. Example: `row-numbers="true"`.

### SG Grid Panel

- Customizable grid panel layout
- Support for various panel types (e.g. filter, summary, group)
- Built-in panel resizing and reordering capabilities

Props

- `position` (string) — default: `top` — Where the panel is placed: `top|bottom|left|right`. Example: `position="top"`.
- `visible` (boolean) — default: `true` — Show or hide the panel. Example: `visible="false"`.
- `collapsible` (boolean) — default: `false` — Allow collapsing the panel. Example: `collapsible="true"`.

### SG Search Panel

- Support for global and local search
- Customizable search input and results templates
- Built-in search filtering and sorting capabilities

Props

- `placeholder` (string) — default: `Search...` — Placeholder text for the search input. Example: `placeholder="Search people..."`.
- `debounce` (number) — default: `300` — Debounce in ms before triggering search. Example: `:debounce="250"`.
- `scope` (string) — default: `global` — `global|local` — whether to search entire data-source or current page. Example: `scope="local"`.
- `visible` (boolean) — default: `true` — Show or hide the search panel. Example: `visible="true"`.

### SG Filter Row

- Support for global and local filtering
- Customizable filter input and results templates
- Built-in filter management capabilities

Props

- `filter-mode` (string) — default: `row` — `row|panel` determines whether filters render inline in the header row or in a separate panel. Example: `filter-mode="row"`.
- `debounce` (number) — default: `300` — Debounce ms for filter inputs. Example: `:debounce="200"`.
- `clearable` (boolean) — default: `true` — Show a clear button for filter inputs. Example: `clearable="true"`.

### SG Filter Panel

- Output for active filters
- Customizable filter display templates

Props

- `visible` (boolean) — default: `false` — Whether the filter panel is shown. Example: `visible="true"`.
- `closable` (boolean) — default: `true` — Allow individual active filters to be removed. Example: `closable="true"`.
- `position` (string) — default: `right` — Placement of the panel. Example: `position="right"`.

### SG Summary Row

- Support for displaying summary information (e.g. count, sum, average)
- Customizable summary templates
- Built-in summary calculation capabilities

Props

- `visible` (boolean) — default: `false` — Show or hide the summary row. Example: `:visible="true"`.
- `calculations` (Array) — default: `['count']` — Which aggregations to show per column, e.g. `['count','sum','avg','min','max']`. Example: `:calculations="['count','sum']"`.
- `position` (string) — default: `bottom` — `top|bottom` position for the summary. Example: `position="bottom"`.

### SG Column Chooser Panel

- Support for column visibility toggling
- Customizable column chooser templates
- Built-in column management capabilities

Props

- `visible` (boolean) — default: `false` — Show/hide the chooser. Example: `visible="true"`.
- `preserve-order` (boolean) — default: `true` — Keep original column order when toggling visibility. Example: `preserve-order="false"`.

### SG Group Panel

- Support for grouping data by one or more columns
- Customizable group templates
- Built-in group management capabilities

Props

- `enabled` (boolean) — default: `false` — Enable grouping capability. Example: `enabled="true"`.
- `show-dropzone` (boolean) — default: `true` — Show UI area to drop column headers for grouping. Example: `show-dropzone="true"`.
- `expand-all` (boolean) — default: `false` — Start with all groups expanded. Example: `expand-all="true"`.

### SG Editing

- Support for various editing modes (e.g. inline, popup)
- Customizable editing templates
- Built-in validation and error handling capabilities

Props

- `mode` (string) — default: `none` — `none|inline|popup`. Example: `mode="popup"`.
- `allow-updating` (boolean) — default: `false` — Allow editing existing rows. Example: `:allow-updating="true"`.
- `allow-adding` (boolean) — default: `false` — Allow adding new rows. Example: `:allow-adding="true"`.
- `allow-deleting` (boolean) — default: `false` — Allow deleting rows. Example: `:allow-deleting="true"`.
- `editor-templates` (object) — default: `{}` — Custom editor components per column. Example: `:editor-templates="{ name: NameEditor }"`.

### SG Selection

- Support for various selection modes (e.g. single, multi)
- Customizable selection templates
- Built-in selection management capabilities

Props

- `mode` (string) — default: `none` — `none|single|multi`. Example: `mode="single"`.
- `persist` (boolean) — default: `false` — Keep selections across paging. Example: `persist="true"`.
- `checkbox-position` (string) — default: `start` — `start|end` where multi-select checkboxes appear. Example: `checkbox-position="end"`.

### SG Paging Panel

- Support for various paging strategies (e.g. client-side, server-side)
- Customizable paging templates
- Built-in paging management capabilities

Props

- `page-size` (number) — default: `10` — Number of rows per page. Example: `page-size="25"`.
- `mode` (string) — default: `client` — `client|server`. Example: `mode="server"`.
- `show-goto-page` (boolean) — default: `false` — Show direct page input. Example: `show-goto-page="true"`.
- `show-jump-to-end` (boolean) — default: `false` — Show jump to last page button. Example: `show-jump-to-end="true"`.
- `visible` (boolean) — default: `true` — Show or hide paging UI. Example: `visible="true"`.

### Example

```html
<sg-grid
    border="false"
    data-source="data"
    key="id"
    readonly="true"
    font="gridFont"
  >
    <sg-grid-panel>
      <button @click="refreshGrid" :icon="refresh">Refresh</button>
      <button @click="exportExcel">Export To Excel</button>
      <button @click="exportPDF">Export To PDF</button>
      <button @click="exportCSV">Export To CSV</button>
      <button @click="importCSV">Import From CSV</button>
      <button @click="importExcel">Import From Excel</button>
      <button @click="showGroupPanel">Show Group Panel</button>
      <button @click="showSearchPanel">Show Search Panel</button>
      <button @click="showFilterPanel">Show Filter Panel</button>
      <button @click="showColumnChooser">Show Column Chooser</button>
    </sg-grid-panel>

    <sg-group-panel />
    <sg-search-panel />
    <sg-column-chooser-panel />
    <sg-editing mode="popup" :allow-updating="true" :allow-adding="true" :allow-deleting="true" />
    <sg-selection mode="single" />
    <sg-filter-row />
    <sg-summary-row :visible="true" />
    <sg-paging-panel
      pageSize="10"
      showGotoPage="true"
      showJumpToEnd="true"
      showJumpToStart="true"
      showNext="true"
      showPrevious="true"
      visible="true"
    />

    <sg-row
        background-color="rowBackgroundColor"
        border="false"
        color="rowColor"
        font="rowFont"
        index="id"
        item="item"
        readonly="false"
        row-numbers="true"
        tooltip="rowTooltip"
      />
      <sg-action @click="handleRowClick(item)" />
      <sg-action @doubleClick="handleRowClick(item)" />
    </sg-row>

    <sg-column
      alignment="right"
      background-color="personBackgroundColor"
      border="false"
      cell-template="personCellTemplate"
      color="personColor"
      css-class="person-cell"

      data-source="people"
      data-field="phones"
      data-id="phoneId"
      data-value="phoneName"
      data-type="string"

      disabled="false"
      filterable="true"
      font="personFont"
      format="format"
      header="person"
      icon="personIcon"
      key-field="value"
      loading="false"
      pin="false"
      readonly="false"
      precision="2"
      showEllipsis="true"
      size="medium"
      sortable="true"
      text-field="name"
      tooltip="personTooltip"
      visible="true"
      width="100"
      wrap-text="true"
      >
      <sg-action :type="button" @click="do_some_action" :loading="false" />
      <sg-action :type="link" @click="do_some_other_action" />
    </sg-column>
  </sg-grid>
```

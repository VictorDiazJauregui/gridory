# Style hooks

[English](style-hooks.md) · [Español](style-hooks.es.md)

Catalog of every class, state attribute and token the library ships. It is generated from the
sources by `npm run docs:hooks` and checked by `npm run audit:styles`, so it always matches the
stylesheets. How to use these hooks is explained in [Theming and styling](theming.md).

## Classes

**Styled** classes have default rules. **Hook only** classes are written on purpose without
styles so you can target them. **Utility** classes are meant to be passed through props.
The state selectors column lists the attributes the stylesheets combine with each class.

### Table

| Class | Kind | State selectors |
|---|---|---|
| `gdy-table` | styled | — |
| `gdy-table-actions-cell` | styled | — |
| `gdy-table-actions-icon` | hook only | — |
| `gdy-table-body` | hook only | — |
| `gdy-table-cell` | styled | — |
| `gdy-table-cell-content` | styled | — |
| `gdy-table-empty-row` | hook only | — |
| `gdy-table-fill` | styled | — |
| `gdy-table-grid` | styled | — |
| `gdy-table-group-cell` | styled | — |
| `gdy-table-group-chevron` | styled | — |
| `gdy-table-group-count` | styled | — |
| `gdy-table-group-label` | styled | — |
| `gdy-table-group-row` | hook only | — |
| `gdy-table-group-toggle` | styled | `[aria-expanded="false"]` |
| `gdy-table-head` | hook only | — |
| `gdy-table-head-arrow` | styled | — |
| `gdy-table-head-cell` | styled | — |
| `gdy-table-head-filter-icon` | styled | — |
| `gdy-table-head-inner` | styled | — |
| `gdy-table-head-label` | styled | — |
| `gdy-table-head-row` | styled | — |
| `gdy-table-head-sort-icon` | hook only | — |
| `gdy-table-head-trigger` | styled | — |
| `gdy-table-inline-select` | styled | — |
| `gdy-table-inline-select-wrap` | styled | — |
| `gdy-table-max-h-lg` | utility | — |
| `gdy-table-max-h-md` | utility | — |
| `gdy-table-max-h-sm` | utility | — |
| `gdy-table-menu-holder` | styled | — |
| `gdy-table-min-h-lg` | utility | — |
| `gdy-table-min-h-md` | utility | — |
| `gdy-table-min-h-sm` | utility | — |
| `gdy-table-page-size` | styled | — |
| `gdy-table-pagination` | styled | — |
| `gdy-table-pagination-icon` | hook only | — |
| `gdy-table-pagination-left` | styled | — |
| `gdy-table-pagination-right` | styled | — |
| `gdy-table-pagination-text` | styled | — |
| `gdy-table-row` | styled | `[data-clickable]` |
| `gdy-table-sticky` | styled | — |
| `gdy-table-wrap` | styled | — |

### Kanban

| Class | Kind | State selectors |
|---|---|---|
| `gdy-kanban` | styled | — |
| `gdy-kanban-board` | styled | — |
| `gdy-kanban-board-wrap` | styled | — |
| `gdy-kanban-card` | styled | `[data-dragging]` |
| `gdy-kanban-card-actions` | styled | — |
| `gdy-kanban-card-head` | styled | — |
| `gdy-kanban-card-main` | styled | — |
| `gdy-kanban-card-menu-icon` | hook only | — |
| `gdy-kanban-card-meta` | styled | — |
| `gdy-kanban-card-subtitle` | styled | — |
| `gdy-kanban-card-title` | styled | — |
| `gdy-kanban-card-value` | styled | — |
| `gdy-kanban-card-value-label` | hook only | — |
| `gdy-kanban-column` | styled | `[data-drop-target]` |
| `gdy-kanban-column-body` | styled | — |
| `gdy-kanban-column-count` | styled | — |
| `gdy-kanban-column-head` | styled | — |
| `gdy-kanban-column-title` | styled | — |
| `gdy-kanban-empty-col` | styled | — |
| `gdy-kanban-filter-arrow` | hook only | — |
| `gdy-kanban-filter-icon` | hook only | — |
| `gdy-kanban-filter-item` | styled | — |
| `gdy-kanban-filter-menu-holder` | styled | — |
| `gdy-kanban-filter-row` | styled | — |
| `gdy-kanban-filter-trigger` | styled | `[data-filtered]` |
| `gdy-kanban-filter-trigger-label` | styled | — |
| `gdy-kanban-min-h-lg` | utility | — |
| `gdy-kanban-min-h-md` | utility | — |
| `gdy-kanban-min-h-sm` | utility | — |
| `gdy-kanban-tag` | styled | — |

### AI assistant

| Class | Kind | State selectors |
|---|---|---|
| `gdy-ai-action-actions` | styled | — |
| `gdy-ai-action-cancel` | styled | — |
| `gdy-ai-action-card` | styled | — |
| `gdy-ai-action-confirm` | styled | — |
| `gdy-ai-action-empty` | styled | — |
| `gdy-ai-action-field` | styled | — |
| `gdy-ai-action-field-label` | styled | — |
| `gdy-ai-action-field-value` | styled | — |
| `gdy-ai-action-fields` | styled | — |
| `gdy-ai-action-header` | styled | — |
| `gdy-ai-action-kicker` | styled | — |
| `gdy-ai-action-required` | styled | — |
| `gdy-ai-action-title` | styled | — |
| `gdy-ai-avatar` | styled | — |
| `gdy-ai-avatar-icon` | styled | — |
| `gdy-ai-body` | styled | `[data-empty]` |
| `gdy-ai-bubble` | styled | `[data-role="assistant"]`, `[data-role="user"]` |
| `gdy-ai-button` | styled | — |
| `gdy-ai-button-icon` | styled | — |
| `gdy-ai-button-label` | styled | — |
| `gdy-ai-chip` | styled | — |
| `gdy-ai-chips` | styled | — |
| `gdy-ai-close` | hook only | — |
| `gdy-ai-close-icon` | styled | — |
| `gdy-ai-empty` | styled | — |
| `gdy-ai-empty-badge` | styled | — |
| `gdy-ai-empty-description` | styled | — |
| `gdy-ai-empty-icon` | styled | — |
| `gdy-ai-empty-text` | hook only | — |
| `gdy-ai-empty-title` | styled | — |
| `gdy-ai-end` | hook only | — |
| `gdy-ai-footer` | styled | — |
| `gdy-ai-header` | styled | — |
| `gdy-ai-header-badge` | styled | — |
| `gdy-ai-header-icon` | styled | — |
| `gdy-ai-heading` | styled | — |
| `gdy-ai-input-wrapper` | styled | — |
| `gdy-ai-markdown` | styled | — |
| `gdy-ai-md-bullet` | styled | — |
| `gdy-ai-md-gap` | styled | — |
| `gdy-ai-md-heading` | styled | — |
| `gdy-ai-md-item` | styled | — |
| `gdy-ai-md-item-text` | hook only | — |
| `gdy-ai-md-number` | styled | — |
| `gdy-ai-md-paragraph` | hook only | — |
| `gdy-ai-md-strong` | styled | — |
| `gdy-ai-md-text` | hook only | — |
| `gdy-ai-message` | styled | `[data-role="user"]` |
| `gdy-ai-overlay` | styled | — |
| `gdy-ai-reset` | hook only | — |
| `gdy-ai-reset-icon` | styled | — |
| `gdy-ai-send` | styled | — |
| `gdy-ai-send-icon` | styled | — |
| `gdy-ai-sidebar` | styled | `[data-state="open"]` |
| `gdy-ai-subtitle` | styled | — |
| `gdy-ai-text` | styled | — |
| `gdy-ai-textarea` | styled | — |
| `gdy-ai-thinking` | styled | — |
| `gdy-ai-thinking-content` | styled | — |
| `gdy-ai-thinking-icon` | styled | — |
| `gdy-ai-thinking-label` | styled | — |
| `gdy-ai-title` | styled | — |

### Auth forms

| Class | Kind | State selectors |
|---|---|---|
| `gdy-auth` | styled | — |
| `gdy-auth-addon` | styled | — |
| `gdy-auth-alert` | styled | — |
| `gdy-auth-checkbox` | styled | — |
| `gdy-auth-checkbox-input` | styled | — |
| `gdy-auth-checkbox-label` | styled | — |
| `gdy-auth-divider` | styled | — |
| `gdy-auth-error` | styled | — |
| `gdy-auth-field` | styled | — |
| `gdy-auth-fields` | styled | — |
| `gdy-auth-footer` | styled | — |
| `gdy-auth-forgot` | styled | — |
| `gdy-auth-form` | styled | — |
| `gdy-auth-google` | styled | — |
| `gdy-auth-google-logo` | styled | — |
| `gdy-auth-google-overlay` | styled | — |
| `gdy-auth-google-slot` | styled | `[data-disabled]` |
| `gdy-auth-header` | styled | — |
| `gdy-auth-input` | styled | `[aria-invalid="true"]` |
| `gdy-auth-label` | styled | — |
| `gdy-auth-link` | styled | — |
| `gdy-auth-name-row` | styled | — |
| `gdy-auth-password` | styled | — |
| `gdy-auth-password-icon` | styled | — |
| `gdy-auth-password-toggle` | styled | — |
| `gdy-auth-required` | styled | — |
| `gdy-auth-rule` | styled | `[data-status="met"]`, `[data-status="unmet"]` |
| `gdy-auth-rule-icon` | styled | — |
| `gdy-auth-rules` | styled | — |
| `gdy-auth-rules-list` | styled | — |
| `gdy-auth-rules-title` | styled | — |
| `gdy-auth-select` | styled | — |
| `gdy-auth-spinner` | styled | — |
| `gdy-auth-submit` | styled | — |
| `gdy-auth-subtitle` | styled | — |
| `gdy-auth-textarea` | styled | — |
| `gdy-auth-title` | styled | — |

### Segmented control

| Class | Kind | State selectors |
|---|---|---|
| `gdy-segmented` | styled | `[data-animated="true"]` |
| `gdy-segmented-icon` | styled | — |
| `gdy-segmented-indicator` | styled | — |
| `gdy-segmented-item` | styled | `[aria-checked="false"]`, `[aria-checked="true"]` |
| `gdy-segmented-label` | styled | — |

### Country select

| Class | Kind | State selectors |
|---|---|---|
| `gdy-country-select` | styled | `[data-multiple]` |
| `gdy-country-select-chevron` | styled | — |
| `gdy-country-select-chip` | styled | — |
| `gdy-country-select-chip-label` | styled | — |
| `gdy-country-select-chip-remove` | styled | — |
| `gdy-country-select-chips` | styled | — |
| `gdy-country-select-clear` | styled | — |
| `gdy-country-select-frame` | styled | — |
| `gdy-country-select-more` | styled | — |
| `gdy-country-select-panel` | styled | — |
| `gdy-country-select-status` | styled | — |
| `gdy-country-select-summary` | styled | — |
| `gdy-country-select-trigger` | styled | `[aria-expanded="true"]`, `[aria-invalid="true"]` |
| `gdy-country-select-value` | styled | `[data-placeholder]` |

### Primitives

| Class | Kind | State selectors |
|---|---|---|
| `gdy-button` | styled | `[aria-expanded="true"]`, `[data-size="default"]`, `[data-size="icon"]`, `[data-size="icon-lg"]`, `[data-size="icon-sm"]`, `[data-size="icon-xs"]`, `[data-size="lg"]`, `[data-size="sm"]`, `[data-size="xs"]`, `[data-variant="default"]`, `[data-variant="destructive"]`, `[data-variant="ghost"]`, `[data-variant="link"]`, `[data-variant="outline"]`, `[data-variant="secondary"]` |
| `gdy-calendar-button-next` | styled | `[aria-disabled="true"]` |
| `gdy-calendar-button-previous` | styled | `[aria-disabled="true"]` |
| `gdy-calendar-caption-label` | styled | — |
| `gdy-calendar-chevron` | styled | — |
| `gdy-calendar-day` | styled | `[data-disabled]`, `[data-hidden]`, `[data-outside]`, `[data-range-end]`, `[data-range-middle]`, `[data-range-start]`, `[data-selected]`, `[data-today]` |
| `gdy-calendar-day-button` | styled | `[data-range-end]`, `[data-range-middle]`, `[data-range-start]`, `[data-selected-single]` |
| `gdy-calendar-dropdown` | styled | — |
| `gdy-calendar-dropdown-root` | styled | — |
| `gdy-calendar-dropdowns` | styled | — |
| `gdy-calendar-footer` | hook only | — |
| `gdy-calendar-month` | styled | — |
| `gdy-calendar-month-caption` | styled | — |
| `gdy-calendar-month-grid` | styled | — |
| `gdy-calendar-months` | styled | — |
| `gdy-calendar-months-dropdown` | hook only | — |
| `gdy-calendar-nav` | styled | — |
| `gdy-calendar-popover` | styled | — |
| `gdy-calendar-root` | styled | — |
| `gdy-calendar-week` | styled | — |
| `gdy-calendar-week-number` | hook only | — |
| `gdy-calendar-week-number-header` | hook only | — |
| `gdy-calendar-weekday` | styled | — |
| `gdy-calendar-weekdays` | styled | — |
| `gdy-calendar-weeks` | hook only | — |
| `gdy-calendar-years-dropdown` | hook only | — |
| `gdy-menu-content` | styled | `[data-side="bottom"]`, `[data-side="left"]`, `[data-side="right"]`, `[data-side="top"]`, `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-menu-item` | styled | `[data-disabled]`, `[data-variant="destructive"]` |
| `gdy-menu-item-label` | hook only | — |
| `gdy-menu-label` | styled | — |
| `gdy-menu-separator` | styled | — |
| `gdy-popover-content` | styled | `[data-side="bottom"]`, `[data-side="left"]`, `[data-side="right"]`, `[data-side="top"]`, `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-select-content` | styled | `[data-side="bottom"]`, `[data-side="left"]`, `[data-side="right"]`, `[data-side="top"]`, `[data-state="open"]` |
| `gdy-select-icon` | styled | — |
| `gdy-select-item` | styled | `[data-disabled]`, `[data-highlighted]`, `[data-state="checked"]` |
| `gdy-select-item-check` | styled | — |
| `gdy-select-item-indicator` | styled | — |
| `gdy-select-item-text` | hook only | — |
| `gdy-select-scroll-button` | styled | — |
| `gdy-select-scroll-icon` | styled | — |
| `gdy-select-trigger` | styled | `[aria-invalid="true"]`, `[data-placeholder]`, `[data-state="open"]` |
| `gdy-select-value` | hook only | — |
| `gdy-select-viewport` | styled | — |
| `gdy-toggle-group` | styled | — |
| `gdy-toggle-item` | styled | `[data-state="on"]` |
| `gdy-toggle-item-label` | hook only | — |

### Shared layer and toolbar

| Class | Kind | State selectors |
|---|---|---|
| `gdy-btn` | styled | — |
| `gdy-btn-ai` | styled | — |
| `gdy-btn-ai-icon` | hook only | — |
| `gdy-btn-ghost` | styled | — |
| `gdy-btn-primary` | styled | — |
| `gdy-btn-xs` | styled | — |
| `gdy-card` | styled | — |
| `gdy-country-flag` | styled | — |
| `gdy-date-input` | styled | — |
| `gdy-date-input-with-icon` | styled | — |
| `gdy-date-picker-icon` | hook only | — |
| `gdy-date-picker-input` | styled | — |
| `gdy-date-picker-trigger` | styled | — |
| `gdy-date-range-inputs` | styled | — |
| `gdy-empty` | styled | — |
| `gdy-empty-sm` | styled | — |
| `gdy-field` | styled | `[data-label-position="start"]` |
| `gdy-field-control` | styled | — |
| `gdy-field-error` | styled | — |
| `gdy-field-label` | styled | — |
| `gdy-field-required` | styled | — |
| `gdy-floating-panel` | styled | — |
| `gdy-icon-btn` | styled | — |
| `gdy-inline-links` | styled | — |
| `gdy-input` | styled | — |
| `gdy-input-sm` | styled | — |
| `gdy-link-btn` | styled | `[aria-pressed="true"]` |
| `gdy-link-btn-nowrap` | styled | — |
| `gdy-listbox` | styled | — |
| `gdy-listbox-check` | styled | — |
| `gdy-listbox-empty` | styled | — |
| `gdy-listbox-label` | styled | — |
| `gdy-listbox-leading` | styled | — |
| `gdy-listbox-option` | styled | `[aria-disabled="true"]`, `[aria-selected="true"]`, `[data-active]` |
| `gdy-listbox-options` | styled | — |
| `gdy-listbox-search` | styled | — |
| `gdy-listbox-trailing` | styled | — |
| `gdy-option-check` | styled | `[data-checked]` |
| `gdy-option-check-icon` | hook only | — |
| `gdy-option-item` | styled | `[data-selected]` |
| `gdy-option-label` | styled | — |
| `gdy-option-list` | styled | — |
| `gdy-panel` | styled | — |
| `gdy-panel-actions` | styled | — |
| `gdy-panel-date` | styled | — |
| `gdy-panel-section` | styled | — |
| `gdy-panel-section-stack` | styled | — |
| `gdy-panel-title` | styled | — |
| `gdy-scope` | styled | — |
| `gdy-scroll` | styled | — |
| `gdy-search` | styled | — |
| `gdy-search-icon` | styled | — |
| `gdy-search-sm` | styled | — |
| `gdy-search-sm-icon` | styled | — |
| `gdy-thin-scroll` | styled | — |
| `gdy-toolbar` | styled | — |
| `gdy-toolbar-clear` | hook only | — |
| `gdy-toolbar-clear-icon` | hook only | — |
| `gdy-toolbar-clear-label` | hook only | — |
| `gdy-toolbar-create` | hook only | — |
| `gdy-toolbar-create-icon` | hook only | — |
| `gdy-toolbar-left` | styled | — |
| `gdy-toolbar-right` | styled | — |
| `gdy-view-switch` | styled | — |
| `gdy-view-switch-btn` | styled | `[aria-pressed="true"]` |
| `gdy-view-switch-icon` | hook only | — |

## State attributes

Boolean attributes are present or absent; the others take the listed values. Attributes set by
Radix or react-day-picker follow those libraries.

| Attribute | Values | Set by | Used with |
|---|---|---|---|
| `aria-checked` | `"false"`, `"true"` | Gridory | `gdy-segmented-item` |
| `aria-disabled` | `"true"` | Radix or react-day-picker | `gdy-calendar-button-next`, `gdy-calendar-button-previous`, `gdy-listbox-option` |
| `aria-expanded` | `"false"`, `"true"` | Gridory | `gdy-button`, `gdy-country-select-trigger`, `gdy-table-group-toggle` |
| `aria-invalid` | `"true"` | Gridory | `gdy-auth-input`, `gdy-country-select-trigger`, `gdy-select-trigger` |
| `aria-pressed` | `"true"` | Gridory | `gdy-link-btn`, `gdy-view-switch-btn` |
| `aria-selected` | `"true"` | Gridory | `gdy-listbox-option` |
| `data-action-type` | `"create-card"`, `"create-row"`, `"custom"`, `"move-card"`, `"update-row"` | Gridory | no default rule |
| `data-active` | present / absent | Gridory | `gdy-listbox-option` |
| `data-animated` | `"true"` | Gridory | `gdy-segmented` |
| `data-checked` | present / absent | Gridory | `gdy-option-check` |
| `data-clickable` | present / absent | Gridory | `gdy-table-row` |
| `data-disabled` | present / absent | Gridory, Radix or react-day-picker | `gdy-auth-google-slot`, `gdy-calendar-day`, `gdy-menu-item`, `gdy-select-item` |
| `data-dragging` | present / absent | Gridory | `gdy-kanban-card` |
| `data-drop-target` | present / absent | Gridory | `gdy-kanban-column` |
| `data-empty` | present / absent | Gridory | `gdy-ai-body` |
| `data-filtered` | present / absent | Gridory | `gdy-kanban-filter-trigger` |
| `data-form` | `"login"`, `"signup"` | Gridory | no default rule |
| `data-hidden` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-highlighted` | present / absent | Radix or react-day-picker | `gdy-select-item` |
| `data-label-position` | `"start"` | Gridory | `gdy-field` |
| `data-list` | `"ordered"`, `"unordered"` | Gridory | no default rule |
| `data-multiple` | present / absent | Gridory | `gdy-country-select` |
| `data-outside` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-placeholder` | present / absent | Gridory, Radix or react-day-picker | `gdy-country-select-value`, `gdy-select-trigger` |
| `data-range-end` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-middle` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-start` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-role` | `"assistant"`, `"user"` | Gridory | `gdy-ai-bubble`, `gdy-ai-message` |
| `data-selected` | present / absent | Gridory, Radix or react-day-picker | `gdy-calendar-day`, `gdy-option-item` |
| `data-selected-single` | present / absent | Gridory | `gdy-calendar-day-button` |
| `data-side` | `"bottom"`, `"left"`, `"right"`, `"top"` | Radix or react-day-picker | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` |
| `data-size` | `"default"`, `"icon"`, `"icon-lg"`, `"icon-sm"`, `"icon-xs"`, `"lg"`, `"sm"`, `"xs"` | Gridory | `gdy-button` |
| `data-state` | `"checked"`, `"closed"`, `"on"`, `"open"` | Gridory, Radix or react-day-picker | `gdy-ai-sidebar`, `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content`, `gdy-select-item`, `gdy-select-trigger`, `gdy-toggle-item` |
| `data-status` | `"met"`, `"pending"`, `"unmet"` | Gridory | `gdy-auth-rule` |
| `data-streaming` | present / absent | Gridory | no default rule |
| `data-thinking` | present / absent | Gridory | no default rule |
| `data-today` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-variant` | `"default"`, `"destructive"`, `"ghost"`, `"link"`, `"outline"`, `"secondary"` | Gridory | `gdy-button`, `gdy-menu-item` |

## Base tokens

Declared by the library with zero specificity. Each one reads the shadcn/ui variable in the
bridge column first, when your app defines it.

| Token | Bridge | Light | Dark |
|---|---|---|---|
| `--gdy-background` | `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--gdy-foreground` | `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--gdy-card` | `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--gdy-card-foreground` | `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--gdy-popover` | `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--gdy-popover-foreground` | `--popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--gdy-primary` | `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| `--gdy-primary-foreground` | `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--gdy-secondary` | `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--gdy-secondary-foreground` | `--secondary-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--gdy-muted` | `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--gdy-muted-foreground` | `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--gdy-accent` | `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--gdy-accent-foreground` | `--accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--gdy-destructive` | `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `--gdy-destructive-foreground` | `--destructive-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--gdy-success` | `--success` | `oklch(0.527 0.154 150.069)` | `oklch(0.792 0.209 151.711)` |
| `--gdy-border` | `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--gdy-input` | `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` |
| `--gdy-ring` | `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |
| `--gdy-radius` | `--radius` | `0.625rem` | `0.625rem` |
| `--gdy-link` | — | `oklch(0.546 0.245 262.881)` | `oklch(0.707 0.165 254.624)` |
| `--gdy-overlay` | — | `rgb(0 0 0 / 0.3)` | `rgb(0 0 0 / 0.6)` |
| `--gdy-shadow-sm` | — | `0 1px 2px rgb(0 0 0 / 0.12)` | `0 1px 2px rgb(0 0 0 / 0.5)` |
| `--gdy-shadow-md` | — | `0 8px 24px rgb(0 0 0 / 0.12)` | `0 8px 24px rgb(0 0 0 / 0.6)` |
| `--gdy-shadow-lg` | — | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `0 25px 50px -12px rgb(0 0 0 / 0.6)` |
| `--gdy-font-mono` | — | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |
| `--gdy-google-blue` | — | `#4285f4` | `#4285f4` |
| `--gdy-google-green` | — | `#34a853` | `#34a853` |
| `--gdy-google-yellow` | — | `#fbbc05` | `#fbbc05` |
| `--gdy-google-red` | — | `#ea4335` | `#ea4335` |

## Component tokens

Never declared by the library: each one is read with the fallback shown, so declaring it on
any ancestor overrides that part only. `--gdy-select-*` also mirror the `selectTheme` prop.

| Token | Fallback | Read by |
|---|---|---|
| `--gdy-ai-accent` | `var(--gdy-primary)` | ai |
| `--gdy-ai-accent-fg` | `var(--gdy-primary-foreground)` | ai |
| `--gdy-ai-assistant-bubble-bg` | `color-mix(in oklab, var(--gdy-muted) 60%, transparent)` | ai |
| `--gdy-ai-assistant-bubble-fg` | `var(--gdy-foreground)` | ai |
| `--gdy-ai-bg` | `var(--gdy-background)` | ai |
| `--gdy-ai-user-bubble-bg` | `var(--gdy-ai-accent, var(--gdy-primary))` | ai |
| `--gdy-ai-user-bubble-fg` | `var(--gdy-ai-accent-fg, var(--gdy-primary-foreground))` | ai |
| `--gdy-auth-bg` | `var(--gdy-card)` | auth |
| `--gdy-auth-border` | `var(--gdy-border)` | auth |
| `--gdy-auth-button-height` | `40px` | auth |
| `--gdy-auth-button-radius` | `var(--gdy-radius)` | auth |
| `--gdy-auth-checkbox` | `var(--gdy-primary)` | auth |
| `--gdy-auth-divider` | `var(--gdy-border)` | auth |
| `--gdy-auth-divider-gap` | `12px` | auth |
| `--gdy-auth-error` | `var(--gdy-destructive)` | auth |
| `--gdy-auth-fg` | `var(--gdy-card-foreground)` | auth |
| `--gdy-auth-field-gap` | `14px` | auth |
| `--gdy-auth-gap` | `16px` | auth |
| `--gdy-auth-google-bg` | `var(--gdy-background)` | auth |
| `--gdy-auth-google-border` | `var(--gdy-border)` | auth |
| `--gdy-auth-google-fg` | `var(--gdy-foreground)` | auth |
| `--gdy-auth-google-hover-bg` | `var(--gdy-muted)` | auth |
| `--gdy-auth-google-hover-border` | `var(--gdy-ring)` | auth |
| `--gdy-auth-google-hover-fg` | `var(--gdy-foreground)` | auth |
| `--gdy-auth-header-gap` | `4px` | auth |
| `--gdy-auth-input-bg` | `var(--gdy-background)` | auth |
| `--gdy-auth-input-border` | `var(--gdy-input)` | auth |
| `--gdy-auth-input-fg` | `var(--gdy-foreground)` | auth |
| `--gdy-auth-input-focus-border` | `var(--gdy-ring)` | auth |
| `--gdy-auth-input-height` | `40px` | auth |
| `--gdy-auth-input-radius` | `var(--gdy-radius)` | auth |
| `--gdy-auth-label` | `inherit` | auth |
| `--gdy-auth-label-gap` | `6px` | auth |
| `--gdy-auth-link` | `var(--gdy-link)` | auth |
| `--gdy-auth-muted` | `var(--gdy-muted-foreground)` | auth |
| `--gdy-auth-padding` | `24px` | auth |
| `--gdy-auth-radius` | `calc(var(--gdy-radius) + 2px)` | auth |
| `--gdy-auth-required` | `var(--gdy-destructive)` | auth |
| `--gdy-auth-rule-met` | `var(--gdy-success)` | auth |
| `--gdy-auth-rule-pending` | `var(--gdy-muted-foreground)` | auth |
| `--gdy-auth-rule-unmet` | `var(--gdy-destructive)` | auth |
| `--gdy-auth-shadow` | `var(--gdy-shadow-sm)` | auth |
| `--gdy-auth-submit-bg` | `var(--gdy-primary)` | auth |
| `--gdy-auth-submit-fg` | `var(--gdy-primary-foreground)` | auth |
| `--gdy-auth-submit-focus` | `var(--gdy-ring)` | auth |
| `--gdy-auth-submit-hover-bg` | `color-mix(in oklab, var(--gdy-auth-submit-bg, var(--gdy-primary)) 85%, transparent)` | auth |
| `--gdy-auth-title` | `inherit` | auth |
| `--gdy-auth-width` | `448px` | auth |
| `--gdy-btn-bg` | `var(--gdy-muted)` | shared |
| `--gdy-btn-fg` | `var(--gdy-foreground)` | shared |
| `--gdy-btn-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 8%, var(--gdy-muted))` | shared |
| `--gdy-btn-primary-bg` | `var(--gdy-primary)` | shared |
| `--gdy-btn-primary-fg` | `var(--gdy-primary-foreground)` | shared |
| `--gdy-calendar-range-bg` | `var(--gdy-muted)` | ui |
| `--gdy-calendar-selected-bg` | `var(--gdy-primary)` | ui |
| `--gdy-calendar-selected-fg` | `var(--gdy-primary-foreground)` | ui |
| `--gdy-country-flag-outline` | `var(--gdy-border)` | shared |
| `--gdy-country-flag-radius` | `2px` | shared |
| `--gdy-country-flag-width` | `20px` | shared |
| `--gdy-country-select-bg` | `var(--gdy-background)` | country-select |
| `--gdy-country-select-border` | `var(--gdy-input)` | country-select |
| `--gdy-country-select-check-color` | `var(--gdy-listbox-check-color, var(--gdy-primary))` | country-select |
| `--gdy-country-select-chip-bg` | `var(--gdy-muted)` | country-select |
| `--gdy-country-select-chip-color` | `var(--gdy-foreground)` | country-select |
| `--gdy-country-select-chip-max-width` | `8rem` | country-select |
| `--gdy-country-select-color` | `var(--gdy-foreground)` | country-select |
| `--gdy-country-select-error-color` | `var(--gdy-destructive)` | country-select |
| `--gdy-country-select-focus-ring` | `var(--gdy-ring)` | country-select |
| `--gdy-country-select-height` | `var(--gdy-field-control-height, 40px)` | country-select |
| `--gdy-country-select-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 4%, var(--gdy-country-select-bg, var(--gdy-background)))` | country-select |
| `--gdy-country-select-option-hover-bg` | `var(--gdy-listbox-option-hover-bg, var(--gdy-option-hover-bg, var(--gdy-accent)))` | country-select |
| `--gdy-country-select-option-hover-color` | `var(--gdy-listbox-option-hover-text, var(--gdy-accent-foreground))` | country-select |
| `--gdy-country-select-option-selected-bg` | `var(--gdy-listbox-option-selected-bg, transparent)` | country-select |
| `--gdy-country-select-panel-min-width` | `240px` | country-select |
| `--gdy-country-select-placeholder-color` | `var(--gdy-muted-foreground)` | country-select |
| `--gdy-country-select-radius` | `var(--gdy-radius)` | country-select |
| `--gdy-country-select-width` | `240px` | country-select |
| `--gdy-field-control-height` | `40px` | country-select, shared |
| `--gdy-field-error-color` | `var(--gdy-destructive)` | shared |
| `--gdy-field-label-color` | `var(--gdy-foreground)` | shared |
| `--gdy-field-label-gap` | `6px` | shared |
| `--gdy-field-label-width` | `auto` | shared |
| `--gdy-field-required-color` | `var(--gdy-destructive)` | shared |
| `--gdy-floating-panel-max-height` | `20rem` | shared |
| `--gdy-floating-panel-min-width` | `12rem` | shared |
| `--gdy-input-bg` | `var(--gdy-muted)` | shared |
| `--gdy-input-border` | `var(--gdy-input)` | kanban, shared |
| `--gdy-kanban-card-bg` | `var(--gdy-card)` | kanban |
| `--gdy-kanban-card-border` | `var(--gdy-border)` | kanban |
| `--gdy-kanban-column-bg` | `var(--gdy-muted)` | kanban |
| `--gdy-kanban-column-border` | `var(--gdy-border)` | kanban |
| `--gdy-kanban-drop-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))` | kanban |
| `--gdy-kanban-drop-outline` | `var(--gdy-muted-foreground)` | kanban |
| `--gdy-listbox-check-color` | `var(--gdy-primary)` | country-select, shared |
| `--gdy-listbox-max-height` | `16rem` | shared |
| `--gdy-listbox-option-hover-bg` | `var(--gdy-option-hover-bg, var(--gdy-accent))` | country-select, shared |
| `--gdy-listbox-option-hover-text` | `var(--gdy-accent-foreground)` | country-select, shared |
| `--gdy-listbox-option-selected-bg` | `transparent` | country-select, shared |
| `--gdy-listbox-option-text` | `inherit` | shared |
| `--gdy-menu-bg` | `var(--gdy-popover)` | ui |
| `--gdy-menu-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-menu-item-hover-bg` | `var(--gdy-accent)` | ui |
| `--gdy-option-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))`, `var(--gdy-accent)` | country-select, shared |
| `--gdy-panel-bg` | `var(--gdy-popover)` | shared |
| `--gdy-panel-border` | `var(--gdy-border)` | shared |
| `--gdy-panel-shadow` | `var(--gdy-shadow-md)` | shared |
| `--gdy-popover-bg` | `var(--gdy-popover)` | ui |
| `--gdy-popover-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-scrollbar-thumb` | `var(--gdy-input)` | segmented-control, shared, ui |
| `--gdy-segmented-bg` | `var(--gdy-muted)` | segmented-control |
| `--gdy-segmented-border` | `var(--gdy-border)` | segmented-control |
| `--gdy-segmented-duration` | `220ms` | motion |
| `--gdy-segmented-focus-ring` | `var(--gdy-ring)` | segmented-control |
| `--gdy-segmented-font-size` | `0.8125rem` | segmented-control |
| `--gdy-segmented-gap` | `4px` | segmented-control |
| `--gdy-segmented-icon-gap` | `6px` | segmented-control |
| `--gdy-segmented-icon-size` | `1.077em` | segmented-control |
| `--gdy-segmented-indicator-bg` | `var(--gdy-background)` | segmented-control |
| `--gdy-segmented-indicator-shadow` | `var(--gdy-shadow-sm)` | segmented-control |
| `--gdy-segmented-item-active-color` | `var(--gdy-foreground)` | segmented-control |
| `--gdy-segmented-item-color` | `var(--gdy-muted-foreground)` | segmented-control |
| `--gdy-segmented-item-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, transparent)` | segmented-control |
| `--gdy-segmented-item-hover-color` | `var(--gdy-foreground)` | segmented-control |
| `--gdy-segmented-item-padding` | `4px 12px` | segmented-control |
| `--gdy-segmented-item-radius` | `7px` | segmented-control |
| `--gdy-segmented-padding` | `4px` | segmented-control |
| `--gdy-segmented-radius` | `9px` | segmented-control |
| `--gdy-select-bg` | `var(--gdy-background)` | ui |
| `--gdy-select-border` | `var(--gdy-border)` | ui |
| `--gdy-select-content-bg` | `var(--gdy-popover)` | ui |
| `--gdy-select-content-text` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-select-item-active-bg` | `transparent` | ui |
| `--gdy-select-item-hover-bg` | `var(--gdy-accent)` | ui |
| `--gdy-select-item-hover-text` | `var(--gdy-accent-foreground)` | ui |
| `--gdy-select-item-text` | `inherit` | ui |
| `--gdy-select-radius` | `calc(var(--gdy-radius) - 2px)` | ui |
| `--gdy-select-text` | `var(--gdy-foreground)` | ui |
| `--gdy-select-trigger-hover-bg` | `var(--gdy-muted)` | ui |
| `--gdy-table-border` | `var(--gdy-border)` | table |
| `--gdy-table-group-bg` | `var(--gdy-accent)` | table |
| `--gdy-table-head-bg` | `var(--gdy-muted)` | table |
| `--gdy-table-head-fg` | `var(--gdy-muted-foreground)` | table |
| `--gdy-table-row-hover-bg` | `var(--gdy-muted)` | table |
| `--gdy-toggle-active-bg` | `var(--gdy-background)` | ui |
| `--gdy-toggle-bg` | `color-mix(in oklab, var(--gdy-muted) 50%, transparent)` | ui |
| `--gdy-toolbar-border` | `var(--gdy-border)` | kanban, shared |


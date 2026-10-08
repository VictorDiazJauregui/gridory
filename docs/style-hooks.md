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
| `gdy-auth-phone` | styled | — |
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

### Phone input

| Class | Kind | State selectors |
|---|---|---|
| `gdy-phone-input` | styled | `[data-invalid]` |
| `gdy-phone-input-chevron` | styled | — |
| `gdy-phone-input-dial-code` | styled | `[data-placeholder]` |
| `gdy-phone-input-frame` | styled | — |
| `gdy-phone-input-number` | styled | — |
| `gdy-phone-input-panel` | styled | — |
| `gdy-phone-input-prefix` | styled | `[aria-expanded="true"]` |

### Sidebar

| Class | Kind | State selectors |
|---|---|---|
| `gdy-sidebar` | styled | `[data-animated="true"]`, `[data-hover-expand="false"]`, `[data-hover-expand="true"]`, `[data-pinned="false"]`, `[data-pinned="true"]`, `[data-state="collapsed"]`, `[data-state="expanded"]` |
| `gdy-sidebar-content` | styled | — |
| `gdy-sidebar-drawer` | styled | `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-sidebar-drawer-close` | styled | — |
| `gdy-sidebar-footer` | styled | — |
| `gdy-sidebar-header` | styled | — |
| `gdy-sidebar-item` | styled | `[aria-current="page"]` |
| `gdy-sidebar-item-icon` | styled | — |
| `gdy-sidebar-item-label` | styled | — |
| `gdy-sidebar-layout` | styled | `[data-mobile="true"]` |
| `gdy-sidebar-logo` | styled | `[data-compact="true"]` |
| `gdy-sidebar-logo-compact` | styled | — |
| `gdy-sidebar-logo-full` | styled | — |
| `gdy-sidebar-menu-button` | styled | — |
| `gdy-sidebar-mobile-bar` | styled | — |
| `gdy-sidebar-mobile-end` | styled | — |
| `gdy-sidebar-mobile-logo` | styled | — |
| `gdy-sidebar-overlay` | styled | `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-sidebar-panel` | styled | — |
| `gdy-sidebar-pin` | styled | — |
| `gdy-sidebar-separator` | styled | — |
| `gdy-sidebar-tooltip` | styled | — |

### Markdown editor

| Class | Kind | State selectors |
|---|---|---|
| `gdy-md-alert` | styled | `[data-variant="error"]`, `[data-variant="important"]`, `[data-variant="success"]`, `[data-variant="warning"]` |
| `gdy-md-alert-option` | hook only | — |
| `gdy-md-alert-option-error` | styled | — |
| `gdy-md-alert-option-important` | styled | — |
| `gdy-md-alert-option-info` | styled | — |
| `gdy-md-alert-option-success` | styled | — |
| `gdy-md-alert-option-warning` | styled | — |
| `gdy-md-alert-title` | styled | — |
| `gdy-md-body` | styled | — |
| `gdy-md-code-language` | styled | — |
| `gdy-md-confirm-dialog` | styled | — |
| `gdy-md-diagram` | styled | `[data-diagram-state="error"]`, `[data-diagram-state="loading"]`, `[data-diagram-state="ready"]` |
| `gdy-md-diagram-canvas` | styled | — |
| `gdy-md-diagram-dialog` | styled | — |
| `gdy-md-diagram-dialog-canvas` | styled | — |
| `gdy-md-diagram-dialog-close` | styled | — |
| `gdy-md-diagram-dialog-frame` | styled | — |
| `gdy-md-diagram-editor` | styled | — |
| `gdy-md-diagram-editor-preview` | styled | — |
| `gdy-md-diagram-error` | styled | — |
| `gdy-md-diagram-error-message` | styled | — |
| `gdy-md-diagram-error-title` | styled | — |
| `gdy-md-diagram-expand` | styled | — |
| `gdy-md-diagram-source` | styled | — |
| `gdy-md-diagram-status` | styled | — |
| `gdy-md-dialog` | styled | — |
| `gdy-md-dialog-actions` | styled | — |
| `gdy-md-dialog-body` | styled | — |
| `gdy-md-dialog-choice` | styled | — |
| `gdy-md-dialog-close` | styled | — |
| `gdy-md-dialog-description` | styled | — |
| `gdy-md-dialog-fields` | styled | — |
| `gdy-md-dialog-header` | styled | — |
| `gdy-md-dialog-hint` | styled | — |
| `gdy-md-dialog-option` | styled | — |
| `gdy-md-dialog-overlay` | styled | — |
| `gdy-md-dialog-textarea` | styled | — |
| `gdy-md-dialog-title` | styled | — |
| `gdy-md-editor` | styled | `[data-fullscreen]` |
| `gdy-md-entity-character` | styled | — |
| `gdy-md-entity-code` | styled | — |
| `gdy-md-entity-grid` | styled | — |
| `gdy-md-footnote-backref` | styled | — |
| `gdy-md-footnote-ref` | styled | — |
| `gdy-md-footnotes` | styled | — |
| `gdy-md-guide-description` | styled | — |
| `gdy-md-guide-dialog` | styled | — |
| `gdy-md-guide-example` | styled | — |
| `gdy-md-guide-panel` | styled | — |
| `gdy-md-guide-rendered` | styled | — |
| `gdy-md-guide-section` | styled | — |
| `gdy-md-guide-shortcut` | styled | — |
| `gdy-md-guide-source` | styled | — |
| `gdy-md-guide-title` | styled | — |
| `gdy-md-guide-tool` | styled | — |
| `gdy-md-guide-tools` | styled | — |
| `gdy-md-header` | styled | — |
| `gdy-md-heading-option` | styled | — |
| `gdy-md-heading-option-1` | styled | — |
| `gdy-md-heading-option-2` | styled | — |
| `gdy-md-heading-option-3` | styled | — |
| `gdy-md-heading-option-4` | styled | — |
| `gdy-md-heading-option-5` | styled | — |
| `gdy-md-heading-option-6` | styled | — |
| `gdy-md-image-file` | styled | — |
| `gdy-md-image-file-input` | styled | — |
| `gdy-md-image-file-name` | styled | — |
| `gdy-md-image-preview` | styled | — |
| `gdy-md-image-tab` | styled | `[data-state="active"]` |
| `gdy-md-image-tab-list` | styled | — |
| `gdy-md-image-tabs` | styled | — |
| `gdy-md-math` | styled | `[data-math-state="error"]`, `[data-math-state="loading"]` |
| `gdy-md-math-block` | styled | — |
| `gdy-md-math-error` | styled | — |
| `gdy-md-math-source` | styled | — |
| `gdy-md-menu-shortcut` | styled | — |
| `gdy-md-menu-submenu-icon` | styled | — |
| `gdy-md-outline` | styled | — |
| `gdy-md-outline-empty` | styled | — |
| `gdy-md-outline-item` | styled | — |
| `gdy-md-outline-link` | styled | `[aria-current="location"]` |
| `gdy-md-outline-list` | styled | — |
| `gdy-md-outline-title` | styled | — |
| `gdy-md-overflow-menu` | styled | — |
| `gdy-md-panels` | styled | `[data-view="split"]` |
| `gdy-md-picker` | styled | — |
| `gdy-md-picker-cell` | styled | — |
| `gdy-md-picker-dialog` | styled | — |
| `gdy-md-picker-grid` | styled | — |
| `gdy-md-picker-panel` | styled | — |
| `gdy-md-picker-search` | styled | — |
| `gdy-md-picker-status` | styled | — |
| `gdy-md-picker-tab` | styled | `[data-state="active"]` |
| `gdy-md-picker-tab-icon` | styled | — |
| `gdy-md-picker-tab-list` | styled | — |
| `gdy-md-picker-tabs` | styled | — |
| `gdy-md-preview` | styled | — |
| `gdy-md-preview-panel` | styled | — |
| `gdy-md-source` | styled | — |
| `gdy-md-source-code` | styled | — |
| `gdy-md-source-emphasis` | styled | — |
| `gdy-md-source-heading` | styled | — |
| `gdy-md-source-link` | styled | — |
| `gdy-md-source-mark` | styled | — |
| `gdy-md-source-panel` | styled | — |
| `gdy-md-source-quote` | styled | — |
| `gdy-md-source-strikethrough` | styled | — |
| `gdy-md-source-strong` | styled | — |
| `gdy-md-table-preview` | styled | `[data-alignment="center"]`, `[data-alignment="right"]` |
| `gdy-md-table-preview-cell` | styled | `[data-header]` |
| `gdy-md-table-preview-grid` | styled | — |
| `gdy-md-table-preview-line` | styled | — |
| `gdy-md-table-scroll` | styled | — |
| `gdy-md-table-size` | styled | — |
| `gdy-md-task-checkbox` | styled | — |
| `gdy-md-task-item` | styled | — |
| `gdy-md-tool` | styled | `[aria-pressed="true"]`, `[data-menu]`, `[data-state="open"]` |
| `gdy-md-tool-chevron` | styled | — |
| `gdy-md-tool-icon` | styled | — |
| `gdy-md-toolbar` | styled | — |
| `gdy-md-toolbar-group` | styled | — |
| `gdy-md-toolbar-measure` | styled | — |
| `gdy-md-toolbar-more` | styled | — |
| `gdy-md-toolbar-separator` | styled | — |
| `gdy-md-tooltip` | styled | — |
| `gdy-md-tooltip-shortcut` | styled | — |
| `gdy-md-view-icon` | styled | — |
| `gdy-md-view-option` | styled | `[aria-pressed="true"]` |
| `gdy-md-view-switch` | styled | — |
| `gdy-md-viewer` | hook only | — |

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
| `aria-current` | `"location"`, `"page"` | Gridory | `gdy-md-outline-link`, `gdy-sidebar-item` |
| `aria-disabled` | `"true"` | Radix or react-day-picker | `gdy-calendar-button-next`, `gdy-calendar-button-previous`, `gdy-listbox-option` |
| `aria-expanded` | `"false"`, `"true"` | Gridory | `gdy-button`, `gdy-country-select-trigger`, `gdy-phone-input-prefix`, `gdy-table-group-toggle` |
| `aria-invalid` | `"true"` | Gridory | `gdy-auth-input`, `gdy-country-select-trigger`, `gdy-select-trigger` |
| `aria-pressed` | `"true"` | Gridory | `gdy-link-btn`, `gdy-md-tool`, `gdy-md-view-option`, `gdy-view-switch-btn` |
| `aria-selected` | `"true"` | Gridory | `gdy-listbox-option` |
| `data-action-type` | `"create-card"`, `"create-row"`, `"custom"`, `"move-card"`, `"update-row"` | Gridory | no default rule |
| `data-active` | present / absent | Gridory | `gdy-listbox-option` |
| `data-alignment` | `"center"`, `"right"` | Gridory | `gdy-md-table-preview` |
| `data-animated` | `"true"` | Gridory | `gdy-segmented`, `gdy-sidebar` |
| `data-checked` | present / absent | Gridory | `gdy-option-check` |
| `data-clickable` | present / absent | Gridory | `gdy-table-row` |
| `data-compact` | `"true"` | Gridory | `gdy-sidebar-logo` |
| `data-diagram-state` | `"error"`, `"loading"`, `"ready"` | Gridory | `gdy-md-diagram` |
| `data-disabled` | present / absent | Gridory, Radix or react-day-picker | `gdy-auth-google-slot`, `gdy-calendar-day`, `gdy-menu-item`, `gdy-select-item` |
| `data-dragging` | present / absent | Gridory | `gdy-kanban-card` |
| `data-drop-target` | present / absent | Gridory | `gdy-kanban-column` |
| `data-empty` | present / absent | Gridory | `gdy-ai-body` |
| `data-filtered` | present / absent | Gridory | `gdy-kanban-filter-trigger` |
| `data-form` | `"login"`, `"signup"` | Gridory | no default rule |
| `data-fullscreen` | present / absent | Gridory | `gdy-md-editor` |
| `data-header` | present / absent | Gridory | `gdy-md-table-preview-cell` |
| `data-hidden` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-highlighted` | present / absent | Radix or react-day-picker | `gdy-select-item` |
| `data-hover-expand` | `"false"`, `"true"` | Gridory | `gdy-sidebar` |
| `data-invalid` | present / absent | Gridory | `gdy-phone-input` |
| `data-label-position` | `"start"` | Gridory | `gdy-field` |
| `data-language` | `"mermaid"` | Gridory | no default rule |
| `data-list` | `"ordered"`, `"unordered"` | Gridory | no default rule |
| `data-math` | `"${tokens[index].markup === DISPLAY_MARKER ? "`, `"display"` | Gridory | no default rule |
| `data-math-state` | `"error"`, `"loading"` | Gridory | `gdy-md-math` |
| `data-measure-group` | present / absent | Gridory | no default rule |
| `data-measure-overflow` | present / absent | Gridory | no default rule |
| `data-menu` | present / absent | Gridory | `gdy-md-tool` |
| `data-mobile` | `"true"` | Gridory | `gdy-sidebar-layout` |
| `data-multiple` | present / absent | Gridory | `gdy-country-select` |
| `data-outside` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-pinned` | `"false"`, `"true"` | Gridory | `gdy-sidebar` |
| `data-placeholder` | present / absent | Gridory, Radix or react-day-picker | `gdy-country-select-value`, `gdy-phone-input-dial-code`, `gdy-select-trigger` |
| `data-range-end` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-middle` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-start` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-role` | `"assistant"`, `"user"` | Gridory | `gdy-ai-bubble`, `gdy-ai-message` |
| `data-selected` | present / absent | Gridory, Radix or react-day-picker | `gdy-calendar-day`, `gdy-option-item` |
| `data-selected-single` | present / absent | Gridory | `gdy-calendar-day-button` |
| `data-side` | `"bottom"`, `"left"`, `"right"`, `"top"` | Radix or react-day-picker | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` |
| `data-size` | `"default"`, `"icon"`, `"icon-lg"`, `"icon-sm"`, `"icon-xs"`, `"lg"`, `"sm"`, `"xs"` | Gridory | `gdy-button` |
| `data-state` | `"active"`, `"checked"`, `"closed"`, `"collapsed"`, `"expanded"`, `"on"`, `"open"` | Gridory, Radix or react-day-picker | `gdy-ai-sidebar`, `gdy-md-image-tab`, `gdy-md-picker-tab`, `gdy-md-tool`, `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content`, `gdy-select-item`, `gdy-select-trigger`, `gdy-sidebar`, `gdy-sidebar-drawer`, `gdy-sidebar-overlay`, `gdy-toggle-item` |
| `data-status` | `"met"`, `"pending"`, `"unmet"` | Gridory | `gdy-auth-rule` |
| `data-streaming` | present / absent | Gridory | no default rule |
| `data-thinking` | present / absent | Gridory | no default rule |
| `data-today` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-toolbar-placement` | present / absent | Gridory | no default rule |
| `data-variant` | `"default"`, `"destructive"`, `"error"`, `"ghost"`, `"important"`, `"link"`, `"outline"`, `"secondary"`, `"success"`, `"warning"` | Gridory | `gdy-button`, `gdy-md-alert`, `gdy-menu-item` |
| `data-view` | `"split"` | Gridory | `gdy-md-panels` |

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
| `--gdy-warning` | `--warning` | `oklch(0.666 0.179 58.318)` | `oklch(0.828 0.189 84.429)` |
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
| `--gdy-field-control-height` | `40px` | country-select, phone-input, shared |
| `--gdy-field-error-color` | `var(--gdy-destructive)` | shared |
| `--gdy-field-label-color` | `var(--gdy-foreground)` | shared |
| `--gdy-field-label-gap` | `6px` | markdown-editor, shared |
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
| `--gdy-listbox-check-color` | `var(--gdy-primary)` | country-select, phone-input, shared |
| `--gdy-listbox-max-height` | `16rem` | shared |
| `--gdy-listbox-option-hover-bg` | `var(--gdy-option-hover-bg, var(--gdy-accent))` | country-select, phone-input, shared |
| `--gdy-listbox-option-hover-text` | `var(--gdy-accent-foreground)` | country-select, phone-input, shared |
| `--gdy-listbox-option-selected-bg` | `transparent` | country-select, phone-input, shared |
| `--gdy-listbox-option-text` | `inherit` | shared |
| `--gdy-md-alert-error` | `var(--gdy-destructive)` | markdown-editor |
| `--gdy-md-alert-error-text` | `color-mix(in oklab, var(--gdy-md-alert-error, var(--gdy-destructive)) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-alert-important` | `color-mix(in oklch, var(--gdy-link) 70%, var(--gdy-destructive))` | markdown-editor |
| `--gdy-md-alert-important-text` | `color-mix(in oklab, var(--gdy-md-alert-important, color-mix(in oklch, var(--gdy-link) 70%, var(--gdy-destructive))) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-alert-info` | `var(--gdy-link)` | markdown-editor |
| `--gdy-md-alert-info-text` | `color-mix(in oklab, var(--gdy-md-alert-info, var(--gdy-link)) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-alert-success` | `var(--gdy-success)` | markdown-editor |
| `--gdy-md-alert-success-text` | `color-mix(in oklab, var(--gdy-md-alert-success, var(--gdy-success)) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-alert-tint` | `8%` | markdown-editor |
| `--gdy-md-alert-warning` | `var(--gdy-warning)` | markdown-editor |
| `--gdy-md-alert-warning-text` | `color-mix(in oklab, var(--gdy-md-alert-warning, var(--gdy-warning)) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-block-gap` | `0.875rem` | markdown-editor |
| `--gdy-md-border` | `var(--gdy-border)` | markdown-editor |
| `--gdy-md-code-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-code-comment` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-code-deletion` | `color-mix(in oklab, var(--gdy-destructive) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-code-font-family` | `var(--gdy-font-mono)` | markdown-editor |
| `--gdy-md-code-font-size` | `0.8125rem` | markdown-editor |
| `--gdy-md-code-foreground` | `inherit` | markdown-editor |
| `--gdy-md-code-keyword` | `var(--gdy-link)` | markdown-editor |
| `--gdy-md-code-number` | `color-mix(in oklab, var(--gdy-warning) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-code-radius` | `calc(var(--gdy-radius) - 2px)` | markdown-editor |
| `--gdy-md-code-string` | `color-mix(in oklab, var(--gdy-success) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-code-title` | `color-mix(in oklab, var(--gdy-destructive) 62%, var(--gdy-md-preview-foreground, var(--gdy-foreground)))` | markdown-editor |
| `--gdy-md-code-type` | `var(--gdy-primary)` | markdown-editor |
| `--gdy-md-diagram-background` | `var(--gdy-background)` | markdown-editor |
| `--gdy-md-diagram-dialog-width` | `90rem` | markdown-editor |
| `--gdy-md-diagram-editor-height` | `16rem` | markdown-editor |
| `--gdy-md-diagram-editor-width` | `60rem` | markdown-editor |
| `--gdy-md-diagram-error-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-diagram-frame` | `var(--gdy-md-border, var(--gdy-border))` | markdown-editor |
| `--gdy-md-diagram-min-height` | `8rem` | markdown-editor |
| `--gdy-md-dialog-accent` | `var(--gdy-primary)` | markdown-editor |
| `--gdy-md-dialog-background` | `var(--gdy-popover)` | markdown-editor |
| `--gdy-md-dialog-overlay` | `var(--gdy-overlay)` | markdown-editor |
| `--gdy-md-dialog-radius` | `var(--gdy-radius)` | markdown-editor |
| `--gdy-md-dialog-width` | `32rem` | markdown-editor |
| `--gdy-md-dialog-z` | `55` | markdown-editor |
| `--gdy-md-divider` | `var(--gdy-md-border, var(--gdy-border))` | markdown-editor |
| `--gdy-md-divider-width` | `1px` | markdown-editor |
| `--gdy-md-editor-background` | `var(--gdy-background)` | markdown-editor |
| `--gdy-md-editor-height` | `32rem` | markdown-editor |
| `--gdy-md-editor-radius` | `var(--gdy-radius)` | markdown-editor |
| `--gdy-md-entity-columns` | `4` | markdown-editor |
| `--gdy-md-fullscreen-z` | `45` | markdown-editor |
| `--gdy-md-guide-source-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-guide-tool-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-guide-width` | `56rem` | markdown-editor |
| `--gdy-md-header-background` | `var(--gdy-card)` | markdown-editor |
| `--gdy-md-heading-color` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-heading-font-family` | `inherit` | markdown-editor |
| `--gdy-md-heading-font-weight` | `600` | markdown-editor |
| `--gdy-md-heading-gap` | `1.5rem` | markdown-editor |
| `--gdy-md-heading-scroll-margin` | `1rem` | markdown-editor |
| `--gdy-md-image-preview-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-image-radius` | `calc(var(--gdy-radius) - 2px)` | markdown-editor |
| `--gdy-md-inline-code-background` | `var(--gdy-md-code-background, var(--gdy-muted))` | markdown-editor |
| `--gdy-md-inline-code-foreground` | `inherit` | markdown-editor |
| `--gdy-md-link` | `var(--gdy-link)` | markdown-editor |
| `--gdy-md-muted` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-outline-active` | `var(--gdy-primary)` | markdown-editor |
| `--gdy-md-outline-active-foreground` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-outline-background` | `var(--gdy-md-editor-background, var(--gdy-background))` | markdown-editor |
| `--gdy-md-outline-foreground` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-outline-hover` | `var(--gdy-accent)` | markdown-editor |
| `--gdy-md-outline-indent` | `0.75rem` | markdown-editor |
| `--gdy-md-outline-width` | `14rem` | markdown-editor |
| `--gdy-md-picker-cell-hover` | `var(--gdy-accent)` | markdown-editor |
| `--gdy-md-picker-cell-size` | `2.25rem` | markdown-editor |
| `--gdy-md-picker-columns` | `8` | markdown-editor |
| `--gdy-md-picker-emoji-size` | `1.375rem` | markdown-editor |
| `--gdy-md-picker-height` | `20rem` | markdown-editor |
| `--gdy-md-picker-width` | `26rem` | markdown-editor |
| `--gdy-md-preview-background` | `transparent` | markdown-editor |
| `--gdy-md-preview-font-family` | `inherit` | markdown-editor |
| `--gdy-md-preview-font-size` | `0.9375rem` | markdown-editor |
| `--gdy-md-preview-foreground` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-preview-line-height` | `1.7` | markdown-editor |
| `--gdy-md-preview-padding` | `0.75rem 1.25rem` | markdown-editor |
| `--gdy-md-preview-panel-background` | `transparent` | markdown-editor |
| `--gdy-md-quote-border` | `var(--gdy-border)` | markdown-editor |
| `--gdy-md-quote-border-width` | `4px` | markdown-editor |
| `--gdy-md-quote-foreground` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-scrollbar-size` | `8px` | markdown-editor |
| `--gdy-md-scrollbar-thumb` | `var(--gdy-scrollbar-thumb, var(--gdy-input))` | markdown-editor |
| `--gdy-md-scrollbar-width` | `thin` | markdown-editor |
| `--gdy-md-source-code` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-source-code-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-source-heading` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-source-link` | `var(--gdy-link)` | markdown-editor |
| `--gdy-md-source-mark` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-source-min-height` | `12rem` | markdown-editor |
| `--gdy-md-source-quote` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-table-border` | `var(--gdy-md-border, var(--gdy-border))` | markdown-editor |
| `--gdy-md-table-cell-padding` | `0.5rem 0.75rem` | markdown-editor |
| `--gdy-md-table-header-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-table-preview-cell` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-md-table-preview-header` | `var(--gdy-accent)` | markdown-editor |
| `--gdy-md-table-preview-line` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-table-stripe` | `transparent` | markdown-editor |
| `--gdy-md-task-checkbox` | `var(--gdy-primary)` | markdown-editor |
| `--gdy-md-tool-active-background` | `var(--gdy-accent)` | markdown-editor |
| `--gdy-md-tool-active-foreground` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-tool-foreground` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-tool-hover-background` | `var(--gdy-accent)` | markdown-editor |
| `--gdy-md-tool-hover-foreground` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-tool-icon-size` | `1rem` | markdown-editor |
| `--gdy-md-tool-size` | `2rem` | markdown-editor |
| `--gdy-md-toolbar-separator` | `var(--gdy-border)` | markdown-editor |
| `--gdy-md-tooltip-background` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-tooltip-foreground` | `var(--gdy-background)` | markdown-editor |
| `--gdy-md-view-option-active-background` | `var(--gdy-background)` | markdown-editor |
| `--gdy-md-view-option-active-foreground` | `var(--gdy-foreground)` | markdown-editor |
| `--gdy-md-view-option-foreground` | `var(--gdy-muted-foreground)` | markdown-editor |
| `--gdy-md-view-switch-background` | `var(--gdy-muted)` | markdown-editor |
| `--gdy-menu-bg` | `var(--gdy-popover)` | ui |
| `--gdy-menu-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-menu-item-hover-bg` | `var(--gdy-accent)` | ui |
| `--gdy-option-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))`, `var(--gdy-accent)` | country-select, phone-input, shared |
| `--gdy-panel-bg` | `var(--gdy-popover)` | shared |
| `--gdy-panel-border` | `var(--gdy-border)` | shared |
| `--gdy-panel-shadow` | `var(--gdy-shadow-md)` | shared |
| `--gdy-phone-input-bg` | `var(--gdy-background)` | phone-input |
| `--gdy-phone-input-border` | `var(--gdy-input)` | phone-input |
| `--gdy-phone-input-check-color` | `var(--gdy-listbox-check-color, var(--gdy-primary))` | phone-input |
| `--gdy-phone-input-color` | `var(--gdy-foreground)` | phone-input |
| `--gdy-phone-input-error-color` | `var(--gdy-destructive)` | phone-input |
| `--gdy-phone-input-focus-ring` | `var(--gdy-ring)` | phone-input |
| `--gdy-phone-input-gap` | `8px` | phone-input |
| `--gdy-phone-input-height` | `var(--gdy-field-control-height, 40px)` | phone-input |
| `--gdy-phone-input-option-hover-bg` | `var(--gdy-listbox-option-hover-bg, var(--gdy-option-hover-bg, var(--gdy-accent)))` | phone-input |
| `--gdy-phone-input-option-hover-color` | `var(--gdy-listbox-option-hover-text, var(--gdy-accent-foreground))` | phone-input |
| `--gdy-phone-input-option-selected-bg` | `var(--gdy-listbox-option-selected-bg, transparent)` | phone-input |
| `--gdy-phone-input-panel-min-width` | `280px` | phone-input |
| `--gdy-phone-input-placeholder-color` | `var(--gdy-muted-foreground)` | phone-input |
| `--gdy-phone-input-prefix-focus-color` | `var(--gdy-ring)` | phone-input |
| `--gdy-phone-input-radius` | `var(--gdy-radius)` | phone-input |
| `--gdy-phone-input-width` | `280px` | phone-input |
| `--gdy-popover-bg` | `var(--gdy-popover)` | ui |
| `--gdy-popover-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-scrollbar-thumb` | `var(--gdy-input)` | markdown-editor, segmented-control, shared, sidebar, ui |
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
| `--gdy-sidebar-bg` | `var(--gdy-card)` | sidebar |
| `--gdy-sidebar-border` | `var(--gdy-border)` | sidebar |
| `--gdy-sidebar-drawer-width` | `min(280px, 85vw)` | sidebar |
| `--gdy-sidebar-drawer-z` | `50` | sidebar |
| `--gdy-sidebar-duration` | `200ms` | motion |
| `--gdy-sidebar-fg` | `var(--gdy-card-foreground)` | sidebar |
| `--gdy-sidebar-focus-ring` | `var(--gdy-ring)` | sidebar |
| `--gdy-sidebar-font-size` | `0.875rem` | sidebar |
| `--gdy-sidebar-header-height` | `64px` | sidebar |
| `--gdy-sidebar-height` | `100dvh` | sidebar |
| `--gdy-sidebar-icon-size` | `20px` | sidebar |
| `--gdy-sidebar-item-active-bg` | `var(--gdy-primary)` | sidebar |
| `--gdy-sidebar-item-active-fg` | `var(--gdy-primary-foreground)` | sidebar |
| `--gdy-sidebar-item-color` | `inherit` | sidebar |
| `--gdy-sidebar-item-gap` | `12px` | sidebar |
| `--gdy-sidebar-item-height` | `40px` | sidebar |
| `--gdy-sidebar-item-hover-bg` | `var(--gdy-muted)` | sidebar |
| `--gdy-sidebar-item-radius` | `calc(var(--gdy-radius) - 2px)` | sidebar |
| `--gdy-sidebar-item-spacing` | `4px` | sidebar |
| `--gdy-sidebar-logo-mark-size` | `32px` | sidebar |
| `--gdy-sidebar-mobile-bar-height` | `56px` | sidebar |
| `--gdy-sidebar-overlay-bg` | `var(--gdy-overlay)` | sidebar |
| `--gdy-sidebar-overlay-shadow` | `var(--gdy-shadow-lg)` | sidebar |
| `--gdy-sidebar-padding` | `12px` | sidebar |
| `--gdy-sidebar-pin-color` | `var(--gdy-muted-foreground)` | sidebar |
| `--gdy-sidebar-rail-width` | `80px` | sidebar |
| `--gdy-sidebar-scrollbar-thumb` | `var(--gdy-scrollbar-thumb, var(--gdy-input))` | sidebar |
| `--gdy-sidebar-separator-color` | `var(--gdy-border)` | sidebar |
| `--gdy-sidebar-separator-margin` | `8px` | sidebar |
| `--gdy-sidebar-tooltip-bg` | `var(--gdy-foreground)` | sidebar |
| `--gdy-sidebar-tooltip-fg` | `var(--gdy-background)` | sidebar |
| `--gdy-sidebar-tooltip-z` | `60` | sidebar |
| `--gdy-sidebar-width` | `280px` | sidebar |
| `--gdy-sidebar-z` | `40` | sidebar |
| `--gdy-table-border` | `var(--gdy-border)` | table |
| `--gdy-table-group-bg` | `var(--gdy-accent)` | table |
| `--gdy-table-head-bg` | `var(--gdy-muted)` | table |
| `--gdy-table-head-fg` | `var(--gdy-muted-foreground)` | table |
| `--gdy-table-row-hover-bg` | `var(--gdy-muted)` | table |
| `--gdy-toggle-active-bg` | `var(--gdy-background)` | ui |
| `--gdy-toggle-bg` | `color-mix(in oklab, var(--gdy-muted) 50%, transparent)` | ui |
| `--gdy-toolbar-border` | `var(--gdy-border)` | kanban, shared |


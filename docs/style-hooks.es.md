# Ganchos de estilo

[English](style-hooks.md) · [Español](style-hooks.es.md)

Catálogo de todas las clases, atributos de estado y tokens que trae la librería. Se genera desde
el código con `npm run docs:hooks` y `npm run audit:styles` comprueba que esté al día, así que
siempre coincide con las hojas de estilo. Cómo usarlos está en [Temas y estilos](theming.es.md).

## Clases

Las clases **con estilos** tienen reglas por defecto. Las de **solo gancho** se escriben a
propósito sin estilos para que puedas apuntarles. Las **utilidades** se pasan por props. La
columna de selectores de estado lista los atributos con los que las hojas combinan cada clase.

### Tabla

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-table` | con estilos | — |
| `gdy-table-actions-cell` | con estilos | — |
| `gdy-table-actions-icon` | solo gancho | — |
| `gdy-table-body` | solo gancho | — |
| `gdy-table-cell` | con estilos | — |
| `gdy-table-cell-content` | con estilos | — |
| `gdy-table-empty-row` | solo gancho | — |
| `gdy-table-fill` | con estilos | — |
| `gdy-table-grid` | con estilos | — |
| `gdy-table-group-cell` | con estilos | — |
| `gdy-table-group-chevron` | con estilos | — |
| `gdy-table-group-count` | con estilos | — |
| `gdy-table-group-label` | con estilos | — |
| `gdy-table-group-row` | solo gancho | — |
| `gdy-table-group-toggle` | con estilos | `[aria-expanded="false"]` |
| `gdy-table-head` | solo gancho | — |
| `gdy-table-head-arrow` | con estilos | — |
| `gdy-table-head-cell` | con estilos | — |
| `gdy-table-head-filter-icon` | con estilos | — |
| `gdy-table-head-inner` | con estilos | — |
| `gdy-table-head-label` | con estilos | — |
| `gdy-table-head-row` | con estilos | — |
| `gdy-table-head-sort-icon` | solo gancho | — |
| `gdy-table-head-trigger` | con estilos | — |
| `gdy-table-inline-select` | con estilos | — |
| `gdy-table-inline-select-wrap` | con estilos | — |
| `gdy-table-max-h-lg` | utilidad | — |
| `gdy-table-max-h-md` | utilidad | — |
| `gdy-table-max-h-sm` | utilidad | — |
| `gdy-table-menu-holder` | con estilos | — |
| `gdy-table-min-h-lg` | utilidad | — |
| `gdy-table-min-h-md` | utilidad | — |
| `gdy-table-min-h-sm` | utilidad | — |
| `gdy-table-page-size` | con estilos | — |
| `gdy-table-pagination` | con estilos | — |
| `gdy-table-pagination-icon` | solo gancho | — |
| `gdy-table-pagination-left` | con estilos | — |
| `gdy-table-pagination-right` | con estilos | — |
| `gdy-table-pagination-text` | con estilos | — |
| `gdy-table-row` | con estilos | `[data-clickable]` |
| `gdy-table-sticky` | con estilos | — |
| `gdy-table-wrap` | con estilos | — |

### Kanban

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-kanban` | con estilos | — |
| `gdy-kanban-board` | con estilos | — |
| `gdy-kanban-board-wrap` | con estilos | — |
| `gdy-kanban-card` | con estilos | `[data-dragging]` |
| `gdy-kanban-card-actions` | con estilos | — |
| `gdy-kanban-card-head` | con estilos | — |
| `gdy-kanban-card-main` | con estilos | — |
| `gdy-kanban-card-menu-icon` | solo gancho | — |
| `gdy-kanban-card-meta` | con estilos | — |
| `gdy-kanban-card-subtitle` | con estilos | — |
| `gdy-kanban-card-title` | con estilos | — |
| `gdy-kanban-card-value` | con estilos | — |
| `gdy-kanban-card-value-label` | solo gancho | — |
| `gdy-kanban-column` | con estilos | `[data-drop-target]` |
| `gdy-kanban-column-body` | con estilos | — |
| `gdy-kanban-column-count` | con estilos | — |
| `gdy-kanban-column-head` | con estilos | — |
| `gdy-kanban-column-title` | con estilos | — |
| `gdy-kanban-empty-col` | con estilos | — |
| `gdy-kanban-filter-arrow` | solo gancho | — |
| `gdy-kanban-filter-icon` | solo gancho | — |
| `gdy-kanban-filter-item` | con estilos | — |
| `gdy-kanban-filter-menu-holder` | con estilos | — |
| `gdy-kanban-filter-row` | con estilos | — |
| `gdy-kanban-filter-trigger` | con estilos | `[data-filtered]` |
| `gdy-kanban-filter-trigger-label` | con estilos | — |
| `gdy-kanban-min-h-lg` | utilidad | — |
| `gdy-kanban-min-h-md` | utilidad | — |
| `gdy-kanban-min-h-sm` | utilidad | — |
| `gdy-kanban-tag` | con estilos | — |

### Asistente de IA

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-ai-action-actions` | con estilos | — |
| `gdy-ai-action-cancel` | con estilos | — |
| `gdy-ai-action-card` | con estilos | — |
| `gdy-ai-action-confirm` | con estilos | — |
| `gdy-ai-action-empty` | con estilos | — |
| `gdy-ai-action-field` | con estilos | — |
| `gdy-ai-action-field-label` | con estilos | — |
| `gdy-ai-action-field-value` | con estilos | — |
| `gdy-ai-action-fields` | con estilos | — |
| `gdy-ai-action-header` | con estilos | — |
| `gdy-ai-action-kicker` | con estilos | — |
| `gdy-ai-action-required` | con estilos | — |
| `gdy-ai-action-title` | con estilos | — |
| `gdy-ai-avatar` | con estilos | — |
| `gdy-ai-avatar-icon` | con estilos | — |
| `gdy-ai-body` | con estilos | `[data-empty]` |
| `gdy-ai-bubble` | con estilos | `[data-role="assistant"]`, `[data-role="user"]` |
| `gdy-ai-button` | con estilos | — |
| `gdy-ai-button-icon` | con estilos | — |
| `gdy-ai-button-label` | con estilos | — |
| `gdy-ai-chip` | con estilos | — |
| `gdy-ai-chips` | con estilos | — |
| `gdy-ai-close` | solo gancho | — |
| `gdy-ai-close-icon` | con estilos | — |
| `gdy-ai-empty` | con estilos | — |
| `gdy-ai-empty-badge` | con estilos | — |
| `gdy-ai-empty-description` | con estilos | — |
| `gdy-ai-empty-icon` | con estilos | — |
| `gdy-ai-empty-text` | solo gancho | — |
| `gdy-ai-empty-title` | con estilos | — |
| `gdy-ai-end` | solo gancho | — |
| `gdy-ai-footer` | con estilos | — |
| `gdy-ai-header` | con estilos | — |
| `gdy-ai-header-badge` | con estilos | — |
| `gdy-ai-header-icon` | con estilos | — |
| `gdy-ai-heading` | con estilos | — |
| `gdy-ai-input-wrapper` | con estilos | — |
| `gdy-ai-markdown` | con estilos | — |
| `gdy-ai-md-bullet` | con estilos | — |
| `gdy-ai-md-gap` | con estilos | — |
| `gdy-ai-md-heading` | con estilos | — |
| `gdy-ai-md-item` | con estilos | — |
| `gdy-ai-md-item-text` | solo gancho | — |
| `gdy-ai-md-number` | con estilos | — |
| `gdy-ai-md-paragraph` | solo gancho | — |
| `gdy-ai-md-strong` | con estilos | — |
| `gdy-ai-md-text` | solo gancho | — |
| `gdy-ai-message` | con estilos | `[data-role="user"]` |
| `gdy-ai-overlay` | con estilos | — |
| `gdy-ai-reset` | solo gancho | — |
| `gdy-ai-reset-icon` | con estilos | — |
| `gdy-ai-send` | con estilos | — |
| `gdy-ai-send-icon` | con estilos | — |
| `gdy-ai-sidebar` | con estilos | `[data-state="open"]` |
| `gdy-ai-subtitle` | con estilos | — |
| `gdy-ai-text` | con estilos | — |
| `gdy-ai-textarea` | con estilos | — |
| `gdy-ai-thinking` | con estilos | — |
| `gdy-ai-thinking-content` | con estilos | — |
| `gdy-ai-thinking-icon` | con estilos | — |
| `gdy-ai-thinking-label` | con estilos | — |
| `gdy-ai-title` | con estilos | — |

### Formularios de autenticación

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-auth` | con estilos | — |
| `gdy-auth-addon` | con estilos | — |
| `gdy-auth-alert` | con estilos | — |
| `gdy-auth-checkbox` | con estilos | — |
| `gdy-auth-checkbox-input` | con estilos | — |
| `gdy-auth-checkbox-label` | con estilos | — |
| `gdy-auth-divider` | con estilos | — |
| `gdy-auth-error` | con estilos | — |
| `gdy-auth-field` | con estilos | — |
| `gdy-auth-fields` | con estilos | — |
| `gdy-auth-footer` | con estilos | — |
| `gdy-auth-forgot` | con estilos | — |
| `gdy-auth-form` | con estilos | — |
| `gdy-auth-google` | con estilos | — |
| `gdy-auth-google-logo` | con estilos | — |
| `gdy-auth-google-overlay` | con estilos | — |
| `gdy-auth-google-slot` | con estilos | `[data-disabled]` |
| `gdy-auth-header` | con estilos | — |
| `gdy-auth-input` | con estilos | `[aria-invalid="true"]` |
| `gdy-auth-label` | con estilos | — |
| `gdy-auth-link` | con estilos | — |
| `gdy-auth-name-row` | con estilos | — |
| `gdy-auth-password` | con estilos | — |
| `gdy-auth-password-icon` | con estilos | — |
| `gdy-auth-password-toggle` | con estilos | — |
| `gdy-auth-phone` | con estilos | — |
| `gdy-auth-required` | con estilos | — |
| `gdy-auth-rule` | con estilos | `[data-status="met"]`, `[data-status="unmet"]` |
| `gdy-auth-rule-icon` | con estilos | — |
| `gdy-auth-rules` | con estilos | — |
| `gdy-auth-rules-list` | con estilos | — |
| `gdy-auth-rules-title` | con estilos | — |
| `gdy-auth-select` | con estilos | — |
| `gdy-auth-spinner` | con estilos | — |
| `gdy-auth-submit` | con estilos | — |
| `gdy-auth-subtitle` | con estilos | — |
| `gdy-auth-textarea` | con estilos | — |
| `gdy-auth-title` | con estilos | — |

### Control segmentado

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-segmented` | con estilos | `[data-animated="true"]` |
| `gdy-segmented-icon` | con estilos | — |
| `gdy-segmented-indicator` | con estilos | — |
| `gdy-segmented-item` | con estilos | `[aria-checked="false"]`, `[aria-checked="true"]` |
| `gdy-segmented-label` | con estilos | — |

### Selector de país

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-country-select` | con estilos | `[data-multiple]` |
| `gdy-country-select-chevron` | con estilos | — |
| `gdy-country-select-chip` | con estilos | — |
| `gdy-country-select-chip-label` | con estilos | — |
| `gdy-country-select-chip-remove` | con estilos | — |
| `gdy-country-select-chips` | con estilos | — |
| `gdy-country-select-clear` | con estilos | — |
| `gdy-country-select-frame` | con estilos | — |
| `gdy-country-select-more` | con estilos | — |
| `gdy-country-select-panel` | con estilos | — |
| `gdy-country-select-status` | con estilos | — |
| `gdy-country-select-summary` | con estilos | — |
| `gdy-country-select-trigger` | con estilos | `[aria-expanded="true"]`, `[aria-invalid="true"]` |
| `gdy-country-select-value` | con estilos | `[data-placeholder]` |

### Teléfono con prefijo

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-phone-input` | con estilos | `[data-invalid]` |
| `gdy-phone-input-chevron` | con estilos | — |
| `gdy-phone-input-dial-code` | con estilos | `[data-placeholder]` |
| `gdy-phone-input-frame` | con estilos | — |
| `gdy-phone-input-number` | con estilos | — |
| `gdy-phone-input-panel` | con estilos | — |
| `gdy-phone-input-prefix` | con estilos | `[aria-expanded="true"]` |

### Menú lateral

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-sidebar` | con estilos | `[data-animated="true"]`, `[data-hover-expand="false"]`, `[data-hover-expand="true"]`, `[data-pinned="false"]`, `[data-pinned="true"]`, `[data-state="collapsed"]`, `[data-state="expanded"]` |
| `gdy-sidebar-content` | con estilos | — |
| `gdy-sidebar-drawer` | con estilos | `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-sidebar-drawer-close` | con estilos | — |
| `gdy-sidebar-footer` | con estilos | — |
| `gdy-sidebar-header` | con estilos | — |
| `gdy-sidebar-item` | con estilos | `[aria-current="page"]` |
| `gdy-sidebar-item-icon` | con estilos | — |
| `gdy-sidebar-item-label` | con estilos | — |
| `gdy-sidebar-layout` | con estilos | `[data-mobile="true"]` |
| `gdy-sidebar-logo` | con estilos | `[data-compact="true"]` |
| `gdy-sidebar-logo-compact` | con estilos | — |
| `gdy-sidebar-logo-full` | con estilos | — |
| `gdy-sidebar-menu-button` | con estilos | — |
| `gdy-sidebar-mobile-bar` | con estilos | — |
| `gdy-sidebar-mobile-end` | con estilos | — |
| `gdy-sidebar-mobile-logo` | con estilos | — |
| `gdy-sidebar-overlay` | con estilos | `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-sidebar-panel` | con estilos | — |
| `gdy-sidebar-pin` | con estilos | — |
| `gdy-sidebar-separator` | con estilos | — |
| `gdy-sidebar-tooltip` | con estilos | — |

### Editor Markdown

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-md-alert` | con estilos | `[data-variant="error"]`, `[data-variant="important"]`, `[data-variant="success"]`, `[data-variant="warning"]` |
| `gdy-md-alert-option` | solo gancho | — |
| `gdy-md-alert-option-error` | con estilos | — |
| `gdy-md-alert-option-important` | con estilos | — |
| `gdy-md-alert-option-info` | con estilos | — |
| `gdy-md-alert-option-success` | con estilos | — |
| `gdy-md-alert-option-warning` | con estilos | — |
| `gdy-md-alert-title` | con estilos | — |
| `gdy-md-body` | con estilos | — |
| `gdy-md-code-language` | con estilos | — |
| `gdy-md-confirm-dialog` | con estilos | — |
| `gdy-md-diagram` | con estilos | `[data-diagram-state="error"]`, `[data-diagram-state="loading"]`, `[data-diagram-state="ready"]` |
| `gdy-md-diagram-canvas` | con estilos | — |
| `gdy-md-diagram-dialog` | con estilos | — |
| `gdy-md-diagram-dialog-canvas` | con estilos | — |
| `gdy-md-diagram-dialog-close` | con estilos | — |
| `gdy-md-diagram-dialog-frame` | con estilos | — |
| `gdy-md-diagram-editor` | con estilos | — |
| `gdy-md-diagram-editor-preview` | con estilos | — |
| `gdy-md-diagram-error` | con estilos | — |
| `gdy-md-diagram-error-message` | con estilos | — |
| `gdy-md-diagram-error-title` | con estilos | — |
| `gdy-md-diagram-expand` | con estilos | — |
| `gdy-md-diagram-source` | con estilos | — |
| `gdy-md-diagram-status` | con estilos | — |
| `gdy-md-dialog` | con estilos | — |
| `gdy-md-dialog-actions` | con estilos | — |
| `gdy-md-dialog-body` | con estilos | — |
| `gdy-md-dialog-choice` | con estilos | — |
| `gdy-md-dialog-close` | con estilos | — |
| `gdy-md-dialog-description` | con estilos | — |
| `gdy-md-dialog-fields` | con estilos | — |
| `gdy-md-dialog-header` | con estilos | — |
| `gdy-md-dialog-hint` | con estilos | — |
| `gdy-md-dialog-option` | con estilos | — |
| `gdy-md-dialog-overlay` | con estilos | — |
| `gdy-md-dialog-textarea` | con estilos | — |
| `gdy-md-dialog-title` | con estilos | — |
| `gdy-md-editor` | con estilos | `[data-fullscreen]` |
| `gdy-md-entity-character` | con estilos | — |
| `gdy-md-entity-code` | con estilos | — |
| `gdy-md-entity-grid` | con estilos | — |
| `gdy-md-footnote-backref` | con estilos | — |
| `gdy-md-footnote-ref` | con estilos | — |
| `gdy-md-footnotes` | con estilos | — |
| `gdy-md-guide-description` | con estilos | — |
| `gdy-md-guide-dialog` | con estilos | — |
| `gdy-md-guide-example` | con estilos | — |
| `gdy-md-guide-panel` | con estilos | — |
| `gdy-md-guide-rendered` | con estilos | — |
| `gdy-md-guide-section` | con estilos | — |
| `gdy-md-guide-shortcut` | con estilos | — |
| `gdy-md-guide-source` | con estilos | — |
| `gdy-md-guide-title` | con estilos | — |
| `gdy-md-guide-tool` | con estilos | — |
| `gdy-md-guide-tools` | con estilos | — |
| `gdy-md-header` | con estilos | — |
| `gdy-md-heading-option` | con estilos | — |
| `gdy-md-heading-option-1` | con estilos | — |
| `gdy-md-heading-option-2` | con estilos | — |
| `gdy-md-heading-option-3` | con estilos | — |
| `gdy-md-heading-option-4` | con estilos | — |
| `gdy-md-heading-option-5` | con estilos | — |
| `gdy-md-heading-option-6` | con estilos | — |
| `gdy-md-image-file` | con estilos | — |
| `gdy-md-image-file-input` | con estilos | — |
| `gdy-md-image-file-name` | con estilos | — |
| `gdy-md-image-preview` | con estilos | — |
| `gdy-md-image-tab` | con estilos | `[data-state="active"]` |
| `gdy-md-image-tab-list` | con estilos | — |
| `gdy-md-image-tabs` | con estilos | — |
| `gdy-md-math` | con estilos | `[data-math-state="error"]`, `[data-math-state="loading"]` |
| `gdy-md-math-block` | con estilos | — |
| `gdy-md-math-error` | con estilos | — |
| `gdy-md-math-source` | con estilos | — |
| `gdy-md-menu-shortcut` | con estilos | — |
| `gdy-md-menu-submenu-icon` | con estilos | — |
| `gdy-md-outline` | con estilos | — |
| `gdy-md-outline-empty` | con estilos | — |
| `gdy-md-outline-item` | con estilos | — |
| `gdy-md-outline-link` | con estilos | `[aria-current="location"]` |
| `gdy-md-outline-list` | con estilos | — |
| `gdy-md-outline-title` | con estilos | — |
| `gdy-md-overflow-menu` | con estilos | — |
| `gdy-md-panels` | con estilos | `[data-view="split"]` |
| `gdy-md-picker` | con estilos | — |
| `gdy-md-picker-cell` | con estilos | — |
| `gdy-md-picker-dialog` | con estilos | — |
| `gdy-md-picker-grid` | con estilos | — |
| `gdy-md-picker-panel` | con estilos | — |
| `gdy-md-picker-search` | con estilos | — |
| `gdy-md-picker-status` | con estilos | — |
| `gdy-md-picker-tab` | con estilos | `[data-state="active"]` |
| `gdy-md-picker-tab-icon` | con estilos | — |
| `gdy-md-picker-tab-list` | con estilos | — |
| `gdy-md-picker-tabs` | con estilos | — |
| `gdy-md-preview` | con estilos | — |
| `gdy-md-preview-panel` | con estilos | — |
| `gdy-md-source` | con estilos | — |
| `gdy-md-source-code` | con estilos | — |
| `gdy-md-source-emphasis` | con estilos | — |
| `gdy-md-source-heading` | con estilos | — |
| `gdy-md-source-link` | con estilos | — |
| `gdy-md-source-mark` | con estilos | — |
| `gdy-md-source-panel` | con estilos | — |
| `gdy-md-source-quote` | con estilos | — |
| `gdy-md-source-strikethrough` | con estilos | — |
| `gdy-md-source-strong` | con estilos | — |
| `gdy-md-table-preview` | con estilos | `[data-alignment="center"]`, `[data-alignment="right"]` |
| `gdy-md-table-preview-cell` | con estilos | `[data-header]` |
| `gdy-md-table-preview-grid` | con estilos | — |
| `gdy-md-table-preview-line` | con estilos | — |
| `gdy-md-table-scroll` | con estilos | — |
| `gdy-md-table-size` | con estilos | — |
| `gdy-md-task-checkbox` | con estilos | — |
| `gdy-md-task-item` | con estilos | — |
| `gdy-md-tool` | con estilos | `[aria-pressed="true"]`, `[data-menu]`, `[data-state="open"]` |
| `gdy-md-tool-chevron` | con estilos | — |
| `gdy-md-tool-icon` | con estilos | — |
| `gdy-md-toolbar` | con estilos | — |
| `gdy-md-toolbar-group` | con estilos | — |
| `gdy-md-toolbar-measure` | con estilos | — |
| `gdy-md-toolbar-more` | con estilos | — |
| `gdy-md-toolbar-separator` | con estilos | — |
| `gdy-md-tooltip` | con estilos | — |
| `gdy-md-tooltip-shortcut` | con estilos | — |
| `gdy-md-view-icon` | con estilos | — |
| `gdy-md-view-option` | con estilos | `[aria-pressed="true"]` |
| `gdy-md-view-switch` | con estilos | — |
| `gdy-md-viewer` | solo gancho | — |

### Primitivos

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-button` | con estilos | `[aria-expanded="true"]`, `[data-size="default"]`, `[data-size="icon"]`, `[data-size="icon-lg"]`, `[data-size="icon-sm"]`, `[data-size="icon-xs"]`, `[data-size="lg"]`, `[data-size="sm"]`, `[data-size="xs"]`, `[data-variant="default"]`, `[data-variant="destructive"]`, `[data-variant="ghost"]`, `[data-variant="link"]`, `[data-variant="outline"]`, `[data-variant="secondary"]` |
| `gdy-calendar-button-next` | con estilos | `[aria-disabled="true"]` |
| `gdy-calendar-button-previous` | con estilos | `[aria-disabled="true"]` |
| `gdy-calendar-caption-label` | con estilos | — |
| `gdy-calendar-chevron` | con estilos | — |
| `gdy-calendar-day` | con estilos | `[data-disabled]`, `[data-hidden]`, `[data-outside]`, `[data-range-end]`, `[data-range-middle]`, `[data-range-start]`, `[data-selected]`, `[data-today]` |
| `gdy-calendar-day-button` | con estilos | `[data-range-end]`, `[data-range-middle]`, `[data-range-start]`, `[data-selected-single]` |
| `gdy-calendar-dropdown` | con estilos | — |
| `gdy-calendar-dropdown-root` | con estilos | — |
| `gdy-calendar-dropdowns` | con estilos | — |
| `gdy-calendar-footer` | solo gancho | — |
| `gdy-calendar-month` | con estilos | — |
| `gdy-calendar-month-caption` | con estilos | — |
| `gdy-calendar-month-grid` | con estilos | — |
| `gdy-calendar-months` | con estilos | — |
| `gdy-calendar-months-dropdown` | solo gancho | — |
| `gdy-calendar-nav` | con estilos | — |
| `gdy-calendar-popover` | con estilos | — |
| `gdy-calendar-root` | con estilos | — |
| `gdy-calendar-week` | con estilos | — |
| `gdy-calendar-week-number` | solo gancho | — |
| `gdy-calendar-week-number-header` | solo gancho | — |
| `gdy-calendar-weekday` | con estilos | — |
| `gdy-calendar-weekdays` | con estilos | — |
| `gdy-calendar-weeks` | solo gancho | — |
| `gdy-calendar-years-dropdown` | solo gancho | — |
| `gdy-menu-content` | con estilos | `[data-side="bottom"]`, `[data-side="left"]`, `[data-side="right"]`, `[data-side="top"]`, `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-menu-item` | con estilos | `[data-disabled]`, `[data-variant="destructive"]` |
| `gdy-menu-item-label` | solo gancho | — |
| `gdy-menu-label` | con estilos | — |
| `gdy-menu-separator` | con estilos | — |
| `gdy-popover-content` | con estilos | `[data-side="bottom"]`, `[data-side="left"]`, `[data-side="right"]`, `[data-side="top"]`, `[data-state="closed"]`, `[data-state="open"]` |
| `gdy-select-content` | con estilos | `[data-side="bottom"]`, `[data-side="left"]`, `[data-side="right"]`, `[data-side="top"]`, `[data-state="open"]` |
| `gdy-select-icon` | con estilos | — |
| `gdy-select-item` | con estilos | `[data-disabled]`, `[data-highlighted]`, `[data-state="checked"]` |
| `gdy-select-item-check` | con estilos | — |
| `gdy-select-item-indicator` | con estilos | — |
| `gdy-select-item-text` | solo gancho | — |
| `gdy-select-scroll-button` | con estilos | — |
| `gdy-select-scroll-icon` | con estilos | — |
| `gdy-select-trigger` | con estilos | `[aria-invalid="true"]`, `[data-placeholder]`, `[data-state="open"]` |
| `gdy-select-value` | solo gancho | — |
| `gdy-select-viewport` | con estilos | — |
| `gdy-toggle-group` | con estilos | — |
| `gdy-toggle-item` | con estilos | `[data-state="on"]` |
| `gdy-toggle-item-label` | solo gancho | — |

### Capa compartida y toolbar

| Clase | Tipo | Selectores de estado |
|---|---|---|
| `gdy-btn` | con estilos | — |
| `gdy-btn-ai` | con estilos | — |
| `gdy-btn-ai-icon` | solo gancho | — |
| `gdy-btn-ghost` | con estilos | — |
| `gdy-btn-primary` | con estilos | — |
| `gdy-btn-xs` | con estilos | — |
| `gdy-card` | con estilos | — |
| `gdy-country-flag` | con estilos | — |
| `gdy-date-input` | con estilos | — |
| `gdy-date-input-with-icon` | con estilos | — |
| `gdy-date-picker-icon` | solo gancho | — |
| `gdy-date-picker-input` | con estilos | — |
| `gdy-date-picker-trigger` | con estilos | — |
| `gdy-date-range-inputs` | con estilos | — |
| `gdy-empty` | con estilos | — |
| `gdy-empty-sm` | con estilos | — |
| `gdy-field` | con estilos | `[data-label-position="start"]` |
| `gdy-field-control` | con estilos | — |
| `gdy-field-error` | con estilos | — |
| `gdy-field-label` | con estilos | — |
| `gdy-field-required` | con estilos | — |
| `gdy-floating-panel` | con estilos | — |
| `gdy-icon-btn` | con estilos | — |
| `gdy-inline-links` | con estilos | — |
| `gdy-input` | con estilos | — |
| `gdy-input-sm` | con estilos | — |
| `gdy-link-btn` | con estilos | `[aria-pressed="true"]` |
| `gdy-link-btn-nowrap` | con estilos | — |
| `gdy-listbox` | con estilos | — |
| `gdy-listbox-check` | con estilos | — |
| `gdy-listbox-empty` | con estilos | — |
| `gdy-listbox-label` | con estilos | — |
| `gdy-listbox-leading` | con estilos | — |
| `gdy-listbox-option` | con estilos | `[aria-disabled="true"]`, `[aria-selected="true"]`, `[data-active]` |
| `gdy-listbox-options` | con estilos | — |
| `gdy-listbox-search` | con estilos | — |
| `gdy-listbox-trailing` | con estilos | — |
| `gdy-option-check` | con estilos | `[data-checked]` |
| `gdy-option-check-icon` | solo gancho | — |
| `gdy-option-item` | con estilos | `[data-selected]` |
| `gdy-option-label` | con estilos | — |
| `gdy-option-list` | con estilos | — |
| `gdy-panel` | con estilos | — |
| `gdy-panel-actions` | con estilos | — |
| `gdy-panel-date` | con estilos | — |
| `gdy-panel-section` | con estilos | — |
| `gdy-panel-section-stack` | con estilos | — |
| `gdy-panel-title` | con estilos | — |
| `gdy-scope` | con estilos | — |
| `gdy-scroll` | con estilos | — |
| `gdy-search` | con estilos | — |
| `gdy-search-icon` | con estilos | — |
| `gdy-search-sm` | con estilos | — |
| `gdy-search-sm-icon` | con estilos | — |
| `gdy-thin-scroll` | con estilos | — |
| `gdy-toolbar` | con estilos | — |
| `gdy-toolbar-clear` | solo gancho | — |
| `gdy-toolbar-clear-icon` | solo gancho | — |
| `gdy-toolbar-clear-label` | solo gancho | — |
| `gdy-toolbar-create` | solo gancho | — |
| `gdy-toolbar-create-icon` | solo gancho | — |
| `gdy-toolbar-left` | con estilos | — |
| `gdy-toolbar-right` | con estilos | — |
| `gdy-view-switch` | con estilos | — |
| `gdy-view-switch-btn` | con estilos | `[aria-pressed="true"]` |
| `gdy-view-switch-icon` | solo gancho | — |

## Atributos de estado

Los atributos booleanos están presentes o ausentes; el resto toma los valores listados. Los que
ponen Radix o react-day-picker siguen a esas librerías.

| Atributo | Valores | Lo pone | Se usa con |
|---|---|---|---|
| `aria-checked` | `"false"`, `"true"` | Gridory | `gdy-segmented-item` |
| `aria-current` | `"location"`, `"page"` | Gridory | `gdy-md-outline-link`, `gdy-sidebar-item` |
| `aria-disabled` | `"true"` | Radix o react-day-picker | `gdy-calendar-button-next`, `gdy-calendar-button-previous`, `gdy-listbox-option` |
| `aria-expanded` | `"false"`, `"true"` | Gridory | `gdy-button`, `gdy-country-select-trigger`, `gdy-phone-input-prefix`, `gdy-table-group-toggle` |
| `aria-invalid` | `"true"` | Gridory | `gdy-auth-input`, `gdy-country-select-trigger`, `gdy-select-trigger` |
| `aria-pressed` | `"true"` | Gridory | `gdy-link-btn`, `gdy-md-tool`, `gdy-md-view-option`, `gdy-view-switch-btn` |
| `aria-selected` | `"true"` | Gridory | `gdy-listbox-option` |
| `data-action-type` | `"create-card"`, `"create-row"`, `"custom"`, `"move-card"`, `"update-row"` | Gridory | sin regla por defecto |
| `data-active` | presente / ausente | Gridory | `gdy-listbox-option` |
| `data-alignment` | `"center"`, `"right"` | Gridory | `gdy-md-table-preview` |
| `data-animated` | `"true"` | Gridory | `gdy-segmented`, `gdy-sidebar` |
| `data-checked` | presente / ausente | Gridory | `gdy-option-check` |
| `data-clickable` | presente / ausente | Gridory | `gdy-table-row` |
| `data-compact` | `"true"` | Gridory | `gdy-sidebar-logo` |
| `data-diagram-state` | `"error"`, `"loading"`, `"ready"` | Gridory | `gdy-md-diagram` |
| `data-disabled` | presente / ausente | Gridory, Radix o react-day-picker | `gdy-auth-google-slot`, `gdy-calendar-day`, `gdy-menu-item`, `gdy-select-item` |
| `data-dragging` | presente / ausente | Gridory | `gdy-kanban-card` |
| `data-drop-target` | presente / ausente | Gridory | `gdy-kanban-column` |
| `data-empty` | presente / ausente | Gridory | `gdy-ai-body` |
| `data-filtered` | presente / ausente | Gridory | `gdy-kanban-filter-trigger` |
| `data-form` | `"login"`, `"signup"` | Gridory | sin regla por defecto |
| `data-fullscreen` | presente / ausente | Gridory | `gdy-md-editor` |
| `data-header` | presente / ausente | Gridory | `gdy-md-table-preview-cell` |
| `data-hidden` | presente / ausente | Radix o react-day-picker | `gdy-calendar-day` |
| `data-highlighted` | presente / ausente | Radix o react-day-picker | `gdy-select-item` |
| `data-hover-expand` | `"false"`, `"true"` | Gridory | `gdy-sidebar` |
| `data-invalid` | presente / ausente | Gridory | `gdy-phone-input` |
| `data-label-position` | `"start"` | Gridory | `gdy-field` |
| `data-language` | `"mermaid"` | Gridory | sin regla por defecto |
| `data-list` | `"ordered"`, `"unordered"` | Gridory | sin regla por defecto |
| `data-math` | `"${tokens[index].markup === DISPLAY_MARKER ? "`, `"display"` | Gridory | sin regla por defecto |
| `data-math-state` | `"error"`, `"loading"` | Gridory | `gdy-md-math` |
| `data-measure-group` | presente / ausente | Gridory | sin regla por defecto |
| `data-measure-overflow` | presente / ausente | Gridory | sin regla por defecto |
| `data-menu` | presente / ausente | Gridory | `gdy-md-tool` |
| `data-mobile` | `"true"` | Gridory | `gdy-sidebar-layout` |
| `data-multiple` | presente / ausente | Gridory | `gdy-country-select` |
| `data-outside` | presente / ausente | Radix o react-day-picker | `gdy-calendar-day` |
| `data-pinned` | `"false"`, `"true"` | Gridory | `gdy-sidebar` |
| `data-placeholder` | presente / ausente | Gridory, Radix o react-day-picker | `gdy-country-select-value`, `gdy-phone-input-dial-code`, `gdy-select-trigger` |
| `data-range-end` | presente / ausente | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-middle` | presente / ausente | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-start` | presente / ausente | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-role` | `"assistant"`, `"user"` | Gridory | `gdy-ai-bubble`, `gdy-ai-message` |
| `data-selected` | presente / ausente | Gridory, Radix o react-day-picker | `gdy-calendar-day`, `gdy-option-item` |
| `data-selected-single` | presente / ausente | Gridory | `gdy-calendar-day-button` |
| `data-side` | `"bottom"`, `"left"`, `"right"`, `"top"` | Radix o react-day-picker | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` |
| `data-size` | `"default"`, `"icon"`, `"icon-lg"`, `"icon-sm"`, `"icon-xs"`, `"lg"`, `"sm"`, `"xs"` | Gridory | `gdy-button` |
| `data-state` | `"active"`, `"checked"`, `"closed"`, `"collapsed"`, `"expanded"`, `"on"`, `"open"` | Gridory, Radix o react-day-picker | `gdy-ai-sidebar`, `gdy-md-image-tab`, `gdy-md-picker-tab`, `gdy-md-tool`, `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content`, `gdy-select-item`, `gdy-select-trigger`, `gdy-sidebar`, `gdy-sidebar-drawer`, `gdy-sidebar-overlay`, `gdy-toggle-item` |
| `data-status` | `"met"`, `"pending"`, `"unmet"` | Gridory | `gdy-auth-rule` |
| `data-streaming` | presente / ausente | Gridory | sin regla por defecto |
| `data-thinking` | presente / ausente | Gridory | sin regla por defecto |
| `data-today` | presente / ausente | Radix o react-day-picker | `gdy-calendar-day` |
| `data-toolbar-placement` | presente / ausente | Gridory | sin regla por defecto |
| `data-variant` | `"default"`, `"destructive"`, `"error"`, `"ghost"`, `"important"`, `"link"`, `"outline"`, `"secondary"`, `"success"`, `"warning"` | Gridory | `gdy-button`, `gdy-md-alert`, `gdy-menu-item` |
| `data-view` | `"split"` | Gridory | `gdy-md-panels` |

## Tokens base

Los declara la librería con especificidad cero. Cada uno lee primero la variable de shadcn/ui
de la columna puente, si tu app la define.

| Token | Puente | Claro | Oscuro |
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

## Tokens de componente

La librería nunca los declara: cada uno se lee con el fallback indicado, así que declararlo en
cualquier ancestro cambia solo esa parte. Los `--gdy-select-*` también reflejan la prop `selectTheme`.

| Token | Fallback | Lo lee |
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


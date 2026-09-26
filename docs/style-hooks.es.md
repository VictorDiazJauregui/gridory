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
| `aria-disabled` | `"true"` | Radix o react-day-picker | `gdy-calendar-button-next`, `gdy-calendar-button-previous`, `gdy-listbox-option` |
| `aria-expanded` | `"false"`, `"true"` | Gridory | `gdy-button`, `gdy-table-group-toggle` |
| `aria-invalid` | `"true"` | Gridory | `gdy-auth-input`, `gdy-select-trigger` |
| `aria-pressed` | `"true"` | Gridory | `gdy-link-btn`, `gdy-view-switch-btn` |
| `aria-selected` | `"true"` | Gridory | `gdy-listbox-option` |
| `data-action-type` | `"create-card"`, `"create-row"`, `"custom"`, `"move-card"`, `"update-row"` | Gridory | sin regla por defecto |
| `data-active` | presente / ausente | Gridory | `gdy-listbox-option` |
| `data-checked` | presente / ausente | Gridory | `gdy-option-check` |
| `data-clickable` | presente / ausente | Gridory | `gdy-table-row` |
| `data-disabled` | presente / ausente | Gridory, Radix o react-day-picker | `gdy-auth-google-slot`, `gdy-calendar-day`, `gdy-menu-item`, `gdy-select-item` |
| `data-dragging` | presente / ausente | Gridory | `gdy-kanban-card` |
| `data-drop-target` | presente / ausente | Gridory | `gdy-kanban-column` |
| `data-empty` | presente / ausente | Gridory | `gdy-ai-body` |
| `data-filtered` | presente / ausente | Gridory | `gdy-kanban-filter-trigger` |
| `data-form` | `"login"`, `"signup"` | Gridory | sin regla por defecto |
| `data-hidden` | presente / ausente | Radix o react-day-picker | `gdy-calendar-day` |
| `data-highlighted` | presente / ausente | Radix o react-day-picker | `gdy-select-item` |
| `data-label-position` | `"start"` | Gridory | `gdy-field` |
| `data-list` | `"ordered"`, `"unordered"` | Gridory | sin regla por defecto |
| `data-outside` | presente / ausente | Radix o react-day-picker | `gdy-calendar-day` |
| `data-placeholder` | presente / ausente | Radix o react-day-picker | `gdy-select-trigger` |
| `data-range-end` | presente / ausente | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-middle` | presente / ausente | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-start` | presente / ausente | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-role` | `"assistant"`, `"user"` | Gridory | `gdy-ai-bubble`, `gdy-ai-message` |
| `data-selected` | presente / ausente | Gridory, Radix o react-day-picker | `gdy-calendar-day`, `gdy-option-item` |
| `data-selected-single` | presente / ausente | Gridory | `gdy-calendar-day-button` |
| `data-side` | `"bottom"`, `"left"`, `"right"`, `"top"` | Radix o react-day-picker | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` |
| `data-size` | `"default"`, `"icon"`, `"icon-lg"`, `"icon-sm"`, `"icon-xs"`, `"lg"`, `"sm"`, `"xs"` | Gridory | `gdy-button` |
| `data-state` | `"checked"`, `"closed"`, `"on"`, `"open"` | Gridory, Radix o react-day-picker | `gdy-ai-sidebar`, `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content`, `gdy-select-item`, `gdy-select-trigger`, `gdy-toggle-item` |
| `data-status` | `"met"`, `"pending"`, `"unmet"` | Gridory | `gdy-auth-rule` |
| `data-streaming` | presente / ausente | Gridory | sin regla por defecto |
| `data-thinking` | presente / ausente | Gridory | sin regla por defecto |
| `data-today` | presente / ausente | Radix o react-day-picker | `gdy-calendar-day` |
| `data-variant` | `"default"`, `"destructive"`, `"ghost"`, `"link"`, `"outline"`, `"secondary"` | Gridory | `gdy-button`, `gdy-menu-item` |

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
| `--gdy-field-control-height` | `40px` | shared |
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
| `--gdy-listbox-check-color` | `var(--gdy-primary)` | shared |
| `--gdy-listbox-max-height` | `16rem` | shared |
| `--gdy-listbox-option-hover-bg` | `var(--gdy-option-hover-bg, var(--gdy-accent))` | shared |
| `--gdy-listbox-option-hover-text` | `var(--gdy-accent-foreground)` | shared |
| `--gdy-listbox-option-selected-bg` | `transparent` | shared |
| `--gdy-listbox-option-text` | `inherit` | shared |
| `--gdy-menu-bg` | `var(--gdy-popover)` | ui |
| `--gdy-menu-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-menu-item-hover-bg` | `var(--gdy-accent)` | ui |
| `--gdy-option-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))`, `var(--gdy-accent)` | shared |
| `--gdy-panel-bg` | `var(--gdy-popover)` | shared |
| `--gdy-panel-border` | `var(--gdy-border)` | shared |
| `--gdy-panel-shadow` | `var(--gdy-shadow-md)` | shared |
| `--gdy-popover-bg` | `var(--gdy-popover)` | ui |
| `--gdy-popover-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-scrollbar-thumb` | `var(--gdy-input)` | shared, ui |
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


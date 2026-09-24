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
| `gdy-select-trigger` | styled | `[data-placeholder]`, `[data-state="open"]` |
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
| `gdy-date-input` | styled | — |
| `gdy-date-input-with-icon` | styled | — |
| `gdy-date-picker-icon` | hook only | — |
| `gdy-date-picker-input` | styled | — |
| `gdy-date-picker-trigger` | styled | — |
| `gdy-date-range-inputs` | styled | — |
| `gdy-empty` | styled | — |
| `gdy-empty-sm` | styled | — |
| `gdy-icon-btn` | styled | — |
| `gdy-inline-links` | styled | — |
| `gdy-input` | styled | — |
| `gdy-input-sm` | styled | — |
| `gdy-link-btn` | styled | `[aria-pressed="true"]` |
| `gdy-link-btn-nowrap` | styled | — |
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
| `aria-disabled` | `"true"` | Radix or react-day-picker | `gdy-calendar-button-next`, `gdy-calendar-button-previous` |
| `aria-expanded` | `"false"`, `"true"` | Gridory | `gdy-button`, `gdy-table-group-toggle` |
| `aria-pressed` | `"true"` | Gridory | `gdy-link-btn`, `gdy-view-switch-btn` |
| `data-action-type` | `"create-card"`, `"create-row"`, `"custom"`, `"move-card"`, `"update-row"` | Gridory | no default rule |
| `data-checked` | present / absent | Gridory | `gdy-option-check` |
| `data-clickable` | present / absent | Gridory | `gdy-table-row` |
| `data-disabled` | present / absent | Radix or react-day-picker | `gdy-calendar-day`, `gdy-menu-item`, `gdy-select-item` |
| `data-dragging` | present / absent | Gridory | `gdy-kanban-card` |
| `data-drop-target` | present / absent | Gridory | `gdy-kanban-column` |
| `data-empty` | present / absent | Gridory | `gdy-ai-body` |
| `data-filtered` | present / absent | Gridory | `gdy-kanban-filter-trigger` |
| `data-hidden` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-highlighted` | present / absent | Radix or react-day-picker | `gdy-select-item` |
| `data-list` | `"ordered"`, `"unordered"` | Gridory | no default rule |
| `data-outside` | present / absent | Radix or react-day-picker | `gdy-calendar-day` |
| `data-placeholder` | present / absent | Radix or react-day-picker | `gdy-select-trigger` |
| `data-range-end` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-middle` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-range-start` | present / absent | Gridory | `gdy-calendar-day`, `gdy-calendar-day-button` |
| `data-role` | `"assistant"`, `"user"` | Gridory | `gdy-ai-bubble`, `gdy-ai-message` |
| `data-selected` | present / absent | Gridory, Radix or react-day-picker | `gdy-calendar-day`, `gdy-option-item` |
| `data-selected-single` | present / absent | Gridory | `gdy-calendar-day-button` |
| `data-side` | `"bottom"`, `"left"`, `"right"`, `"top"` | Radix or react-day-picker | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` |
| `data-size` | `"default"`, `"icon"`, `"icon-lg"`, `"icon-sm"`, `"icon-xs"`, `"lg"`, `"sm"`, `"xs"` | Gridory | `gdy-button` |
| `data-state` | `"checked"`, `"closed"`, `"on"`, `"open"` | Gridory, Radix or react-day-picker | `gdy-ai-sidebar`, `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content`, `gdy-select-item`, `gdy-select-trigger`, `gdy-toggle-item` |
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
| `--gdy-btn-bg` | `var(--gdy-muted)` | shared |
| `--gdy-btn-fg` | `var(--gdy-foreground)` | shared |
| `--gdy-btn-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 8%, var(--gdy-muted))` | shared |
| `--gdy-btn-primary-bg` | `var(--gdy-primary)` | shared |
| `--gdy-btn-primary-fg` | `var(--gdy-primary-foreground)` | shared |
| `--gdy-calendar-range-bg` | `var(--gdy-muted)` | ui |
| `--gdy-calendar-selected-bg` | `var(--gdy-primary)` | ui |
| `--gdy-calendar-selected-fg` | `var(--gdy-primary-foreground)` | ui |
| `--gdy-input-bg` | `var(--gdy-muted)` | shared |
| `--gdy-input-border` | `var(--gdy-input)` | kanban, shared |
| `--gdy-kanban-card-bg` | `var(--gdy-card)` | kanban |
| `--gdy-kanban-card-border` | `var(--gdy-border)` | kanban |
| `--gdy-kanban-column-bg` | `var(--gdy-muted)` | kanban |
| `--gdy-kanban-column-border` | `var(--gdy-border)` | kanban |
| `--gdy-kanban-drop-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))` | kanban |
| `--gdy-kanban-drop-outline` | `var(--gdy-muted-foreground)` | kanban |
| `--gdy-menu-bg` | `var(--gdy-popover)` | ui |
| `--gdy-menu-fg` | `var(--gdy-popover-foreground)` | ui |
| `--gdy-menu-item-hover-bg` | `var(--gdy-accent)` | ui |
| `--gdy-option-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))` | shared |
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


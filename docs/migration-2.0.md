# Migrating to 2.0

2.0.0 only breaks what this guide lists. Everything else (markup, classes, styles and events) is the same
as in 1.5.0. Each section says who is affected, what to change, and how to check that nothing was missed.

## Tailwind preset

**Who is affected:** apps that use the default export of `gridory/tailwind-preset` and write its unprefixed
utilities in their own markup (`bg-primary`, `text-muted-foreground`, `rounded-lg`…). Apps that do not use
Tailwind, that use `createGridoryPreset()`, or that do not use a preset (shadcn projects) need no change.

The default export is now `createGridoryPreset()`: the same colors and radii, under the `gdy` prefix.

```js
// tailwind.config.js — the config itself does not change
import gridoryPreset from "gridory/tailwind-preset";

export default { presets: [gridoryPreset] };
```

```tsx
// 1.x
<span className="rounded-md bg-muted/40 text-muted-foreground hover:bg-muted">Pending</span>
// 2.0
<span className="rounded-gdy-md bg-gdy-muted/40 text-gdy-muted-foreground hover:bg-gdy-muted">Pending</span>
```

**Tailwind does not warn** about a class it no longer generates: it just stops painting it. Replace every
utility of the old preset, keeping variants (`hover:`, `dark:`) and opacity modifiers (`/40`):

| 1.x | 2.0 |
|---|---|
| `<utility>-<color>`, for `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive` (and their `-foreground`), `border`, `input` and `ring` | `<utility>-gdy-<color>`: `bg-gdy-card`, `text-gdy-primary-foreground`, `border-gdy-border`, `outline-gdy-ring` |
| `rounded-lg`, `rounded-md`, `rounded-sm` (and `rounded-t-lg`…) | `rounded-gdy-lg`, `rounded-gdy-md`, `rounded-gdy-sm` (and `rounded-t-gdy-lg`…) |

`rounded-lg`, `rounded-md` and `rounded-sm` still exist without the preset, with Tailwind's own sizes, so
leaving them changes the corners by a few pixels instead of breaking. Replace them too to keep the library's
radius (`--gdy-radius`).

To find what is left, search your sources (add the folders your Tailwind `content` scans):

```bash
grep -rnE "(bg|text|border|ring|outline|fill|stroke|divide|from|via|to)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring)\b|rounded(-[a-z]{1,2})?-(lg|md|sm)\b" src
```

**shadcn projects:** if your config already defines `primary`, `muted` and the rest, those utilities are
yours, not the preset's; remove the preset, as the [theming guide](theming.md#tailwind-preset) recommends,
and nothing changes.

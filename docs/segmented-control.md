# Segmented control

[English](segmented-control.md) · [Español](segmented-control.es.md)

`SegmentedControl` switches between a few mutually exclusive views, such as "Month · Week · Day". It
works as a radio group: one tab stop, the arrow keys move and choose, and an indicator slides to the
chosen option. It keeps no business state: it emits the change and your app decides what to show.

## Contents

- [Import](#import)
- [Quick example](#quick-example)
- [Options and value](#options-and-value)
- [Icons](#icons)
- [Events](#events)
- [Keyboard and accessibility](#keyboard-and-accessibility)
- [Styling](#styling)
- [Motion](#motion)
- [Narrow containers](#narrow-containers)
- [Reference](#reference)

## Import

```ts
import { SegmentedControl } from "gridory/segmented-control";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

## Quick example

```tsx
import { Briefcase, Layers, User } from "lucide-react";
import { SegmentedControl, type SegmentedOption } from "gridory/segmented-control";

const COMPANY_VIEW_OPTIONS: SegmentedOption[] = [
  { value: "companies", label: "My companies", icon: <Briefcase /> },
  { value: "team", label: "Team", icon: <User /> },
  { value: "services", label: "Services", icon: <Layers /> },
];

export const CompanyViewSwitch = () => (
  <SegmentedControl
    options={COMPANY_VIEW_OPTIONS}
    defaultValue="companies"
    onValueChange={showCompanyView}
    aria-label="Company view"
  />
);
```

The icons come from `lucide-react`, but any icon works (see [Icons](#icons)). In the library
repository, `npm run dev` serves every example on this page at `/mocks/controls`, next to an event
log.

## Options and value

Each option has a `value`, which is what `onValueChange` reports, and a `label`, which is the
visible text and the name screen readers announce.

- **Controlled.** Pass `value` and update it in `onValueChange`. The control shows the value you
  pass: until you update it, the chosen option does not change.
- **Uncontrolled.** Pass `defaultValue`. The control keeps the chosen option itself and still
  reports every change through `onValueChange`.

```tsx
import { useState } from "react";
import { SegmentedControl, type SegmentedOption } from "gridory/segmented-control";

const CALENDAR_VIEW_OPTIONS: SegmentedOption[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
  { value: "assigned", label: "Assigned" },
];

export const CalendarViewSwitch = () => {
  const [view, setView] = useState("month");
  return (
    <SegmentedControl
      options={CALENDAR_VIEW_OPTIONS}
      value={view}
      onValueChange={setView}
      aria-label="Calendar view"
    />
  );
};
```

When the value matches no option, no option is checked and there is no indicator. The tab stop
falls on the first option, so the group can still be reached with the keyboard.

## Icons

`icon` takes any `ReactNode`: a `lucide-react` icon as in the examples, another library's
component or your own SVG. The icon is decorative: it gets `aria-hidden`, and the option is named
by its `label`, which is required even when there is an icon.

`iconPosition` places the icon of every option before the label (`"start"`, the default) or after
it (`"end"`):

```tsx
<SegmentedControl
  options={COMPANY_VIEW_OPTIONS}
  defaultValue="companies"
  iconPosition="end"
  aria-label="Company view"
/>
```

The icon is sized in `em` (`--gdy-segmented-icon-size`, 1.077em: 14px next to 13px text), so it
follows the text when you change `--gdy-segmented-font-size`. `--gdy-segmented-icon-gap` sets the
space between the icon and the label.

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onValueChange` | `(value: string) => void` | The chosen option changes, by click or with the keyboard. |

Picking the option that is already chosen does not fire it. The arrow keys, Home and End choose as
they move, as in a native radio group, so `onValueChange` fires on every step: going from "Month"
to "Day" with → twice reports `"week"` and then `"day"`.

The control never changes your data: it reports the new value and your app decides what to show.

## Keyboard and accessibility

The keyboard follows the [WAI-ARIA radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/):

| Key | Action |
|---|---|
| Tab / Shift+Tab | Enters the group once, on the chosen option (on the first one when none is chosen). The next press leaves the group. |
| ← or ↑ | Moves to the previous option and chooses it. From the first one, goes to the last. |
| → or ↓ | Moves to the next option and chooses it. From the last one, goes to the first. |
| Home | Moves to the first option and chooses it. |
| End | Moves to the last option and chooses it. |

- The root has `role="radiogroup"` and needs a name: pass `aria-label` or `aria-labelledby`. The
  types require exactly one of them, so leaving the name out, or passing both, does not compile.
- Each option is a `<button role="radio">` with `aria-checked`, named by its label. The icon has
  `aria-hidden`.
- The focus ring is drawn inside the option (`box-shadow: inset`, in
  `--gdy-segmented-focus-ring`). There is no outer ring and the box does not grow, so nothing moves
  and the track never clips it. A transparent `outline` stays in place for high contrast mode
  (`forced-colors`), which paints it visible.

To name the group with a visible heading, point `aria-labelledby` at it:

```tsx
<h3 id="calendar-view-title">Calendar view</h3>
<SegmentedControl
  options={CALENDAR_VIEW_OPTIONS}
  defaultValue="month"
  aria-labelledby="calendar-view-title"
/>
```

## Styling

Tokens and light/dark themes are covered in [theming.md](theming.md), and every hook, state
selector and token is listed in [style-hooks.md](style-hooks.md#segmented-control). The control
follows the theme set on `<html>` (`.dark` or `data-theme="dark"`).

`className` goes on the root and `classNames` adds your class to each part, next to its hook:

| Part | Hook | `classNames` slot |
|---|---|---|
| Track (the root, `role="radiogroup"`) | `gdy-segmented` | `root` |
| Sliding indicator | `gdy-segmented-indicator` | `indicator` |
| Each option (`<button role="radio">`) | `gdy-segmented-item` | `item` |
| Icon of an option | `gdy-segmented-icon` | `icon` |
| Label of an option | `gdy-segmented-label` | `label` |

| Element | State attribute | Values |
|---|---|---|
| `gdy-segmented` | `data-animated` | `"true"`, `"false"` (follows `animated`) |
| `gdy-segmented-item` | `aria-checked` | `"true"` on the chosen option, `"false"` on the others |

A state weighs two classes (0-2-0), so it beats a single class passed through `classNames`. To
style the chosen option, write its state selector:

```css
.gdy-segmented-item[aria-checked="true"] {
  font-weight: 600;
}
```

The library does not define the component tokens: each one is read with a fallback, so set only the
ones you need, on any ancestor: `:root` for the whole app, `.dark` for the dark theme, or a wrapper
for a single screen.

| Token | Fallback | Used by |
|---|---|---|
| `--gdy-segmented-bg` | `--gdy-muted` | Track background. |
| `--gdy-segmented-border` | `--gdy-border` | Track border. |
| `--gdy-segmented-radius` | `9px` | Track corners. |
| `--gdy-segmented-padding` | `4px` | Space between the track and the options. |
| `--gdy-segmented-gap` | `4px` | Space between options. |
| `--gdy-segmented-font-size` | `0.8125rem` (13px) | Text. |
| `--gdy-segmented-item-padding` | `4px 12px` | Padding of each option. |
| `--gdy-segmented-item-radius` | `7px` | Corners of the options and the indicator. |
| `--gdy-segmented-item-color` | `--gdy-muted-foreground` | Option text at rest. |
| `--gdy-segmented-item-hover-bg` | `--gdy-foreground` at 6% | Subtle option background on hover. |
| `--gdy-segmented-item-hover-color` | `--gdy-foreground` | Option text on hover. |
| `--gdy-segmented-item-active-color` | `--gdy-foreground` | Text of the chosen option. |
| `--gdy-segmented-indicator-bg` | `--gdy-background` | Indicator background. |
| `--gdy-segmented-indicator-shadow` | `--gdy-shadow-sm` | Indicator shadow. |
| `--gdy-segmented-icon-size` | `1.077em` (14px next to 13px text) | Icon, in `em` so it follows the text. |
| `--gdy-segmented-icon-gap` | `6px` | Space between icon and label. |
| `--gdy-segmented-focus-ring` | `--gdy-ring` | Inset focus ring. |
| `--gdy-segmented-duration` | `220ms` | Duration of the indicator slide. |

The component writes `--gdy-segmented-indicator-x`, `-y`, `-width` and `-height` inline to place
the indicator. They are not tokens: do not set them.

Tokens alone are enough for a different look. This pill version sets them on a wrapper, and since
its colors point at base tokens, it follows the light and dark themes with nothing else to declare:

```css
.pill-segmented {
  --gdy-segmented-radius: 9999px;
  --gdy-segmented-item-radius: 9999px;
  --gdy-segmented-indicator-bg: var(--gdy-primary);
  --gdy-segmented-item-active-color: var(--gdy-primary-foreground);
  --gdy-segmented-font-size: 0.9375rem;
}
```

```tsx
<div className="pill-segmented">
  <SegmentedControl
    options={COMPANY_VIEW_OPTIONS}
    defaultValue="companies"
    aria-label="Company view"
  />
</div>
```

## Motion

The indicator slides to the chosen option in 220ms. Only what changes after the first render is
animated: on load the indicator is already in place, instead of sliding in from the left. It also
follows its option when the font size or the width changes.

There are two ways to switch the slide off, and in both the change is instant:

- **`animated={false}`**, for one control. The root gets `data-animated="false"`.
- **`prefers-reduced-motion: reduce`**, set by the user in the operating system. It needs no prop:
  the slide lives in the library motion sheet with the other animations, behind
  `prefers-reduced-motion: no-preference` (see [theming.md](theming.md#motion)).

```tsx
<SegmentedControl
  options={CALENDAR_VIEW_OPTIONS}
  defaultValue="month"
  animated={false}
  aria-label="Calendar view"
/>
```

`--gdy-segmented-duration` changes the duration, for the whole app or for one wrapper:

```css
:root {
  --gdy-segmented-duration: 150ms;
}
```

## Narrow containers

The track is never wider than its container (`max-width: 100%`). When the options do not fit, the
track gets its own horizontal scroll, with a thin scrollbar: the labels do not wrap and the page
does not scroll sideways. Choosing an option with the keyboard scrolls it into view.

## Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `SegmentedOption[]` | required | The options, in display order. |
| `value` | `string` | — | Chosen value, controlled. |
| `defaultValue` | `string` | — | Initial value, uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | The chosen option changed, by click or keyboard. |
| `iconPosition` | `SegmentedIconPosition` | `"start"` | Side of the label the icons sit on. |
| `animated` | `boolean` | `true` | Slides the indicator. `prefers-reduced-motion: reduce` switches it off too. |
| `aria-label` | `string` | required, or `aria-labelledby` | Accessible name of the group. |
| `aria-labelledby` | `string` | required, or `aria-label` | Id of the element that names the group. |
| `className` | `string` | — | Your class on the root. |
| `classNames` | `SegmentedControlClassNames` | — | Your class on each part. |

### Types

- `SegmentedControlProps`: the props above. `aria-label` and `aria-labelledby` are exclusive.
- `SegmentedOption`: `{ value: string; label: string; icon?: ReactNode }`.
- `SegmentedIconPosition`: `"start" | "end"`.
- `SegmentedControlClassNames`: `{ root?; indicator?; item?; icon?; label? }`, each a `string`.

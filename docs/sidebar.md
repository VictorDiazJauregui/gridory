# Sidebar

[English](sidebar.md) · [Español](sidebar.es.md)

`Sidebar` is an application sidebar with a fixed header and footer and a middle area that scrolls on
its own. It keeps no business state: it emits events and your app decides what to do with them.

## Contents

- [Import](#import)
- [Quick example](#quick-example)
- [Layout and parts](#layout-and-parts)
- [Hover and pinned modes](#hover-and-pinned-modes)
- [Mobile](#mobile)
- [Custom blocks](#custom-blocks)
- [Keyboard and accessibility](#keyboard-and-accessibility)
- [Styling](#styling)
- [Texts](#texts)
- [Reference](#reference)

## Import

```ts
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLayout,
  SidebarLogo,
  SidebarPinButton,
  SidebarSeparator,
} from "gridory/sidebar";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

## Quick example

```tsx
const [pinned, setPinned] = useState(false);

<SidebarLayout pinned={pinned} onPinnedChange={setPinned}>
  <Sidebar aria-label="Main" mobileBarLogo={<Logo />}>
    <SidebarHeader>
      <SidebarLogo full={<Logo />} compact={<LogoMark />} />
      <SidebarPinButton />
    </SidebarHeader>
    <SidebarContent>
      <SidebarItem icon={<Table2 />} label="Table" active onSelect={() => navigate("/table")} />
      <SidebarSeparator />
      <SidebarItem icon={<Bot />} label="Assistant" onSelect={() => navigate("/assistant")} />
    </SidebarContent>
    <SidebarFooter>
      <ThemeToggle />
    </SidebarFooter>
  </Sidebar>
  <main>{page}</main>
</SidebarLayout>
```

## Layout and parts

`SidebarLayout` holds the state and lays out the sidebar next to your page (above it on mobile). Put
the `Sidebar` first and the page after it; the page gets `min-width: 0`, so a wide table never pushes
the layout sideways.

| Part | What it does |
|---|---|
| `SidebarLayout` | State provider and the `sidebar │ page` row. It is not a style scope: your page keeps its own styles. |
| `Sidebar` | The icon rail on desktop, a top bar and a drawer on mobile. Needs `aria-label` or `aria-labelledby`, carried by its navigation. |
| `SidebarHeader` / `SidebarFooter` | Fixed zones. They accept any block. |
| `SidebarContent` | The `<nav>` in the middle, the only zone that scrolls, with a thin scrollbar. |
| `SidebarLogo` | `full` while expanded and in the drawer, `compact` in the collapsed rail. |
| `SidebarItem` | Icon and label. A button by default; with `asChild`, your router link. `active` sets `aria-current="page"`. |
| `SidebarSeparator` | A line between items (`role="separator"`). |
| `SidebarPinButton` | Pins and unpins. Place it in the header or in the footer. |
| `useSidebar()` | The state for your own blocks (see [Custom blocks](#custom-blocks)). |

The sidebar is as tall as the screen (`--gdy-sidebar-height`, `100dvh` by default) and sticks to the
top: the page scrolls, the sidebar does not, and only `SidebarContent` scrolls inside it. Set
`--gdy-sidebar-height` to place it inside a container of another height.

Items with a router link:

```tsx
<SidebarItem icon={<FileText />} label="Documents" active={pathname === "/documents"} asChild>
  <Link to="/documents" />
</SidebarItem>
```

## Hover and pinned modes

| State | Space it takes | How to get there |
|---|---|---|
| Collapsed (initial) | The rail, 80px | Default; when the pointer or the focus leaves; Escape |
| Expanded by hover | Still 80px: the panel grows **over** the page | The pointer rests on the rail (`hoverOpenDelay`, 150 ms) or the keyboard focus enters |
| Pinned | 280px: it **pushes** the page | `SidebarPinButton` or `setPinned(true)` |

Leaving the rail collapses it after `hoverCloseDelay` (300 ms), so crossing it on the way to the page
never makes it flicker. A click inside does not keep it open: only keyboard focus does.

The pinned state is controlled (`pinned` and `onPinnedChange`) or uncontrolled (`defaultPinned`). The
library never stores it: persist it yourself if you want it to survive a reload.

With `expandOnHover={false}` there is no hover expansion: the collapsed rail shows a tooltip on each
icon, and the same button expands and collapses it by hand (the `expand` and `collapse` texts, with
`aria-expanded`). In the collapsed header the button takes the logo's place.

## Mobile

Below `mobileBreakpoint` (768px of viewport width by default) the rail becomes a 56px top bar,
sticky in the flow, with the menu button, `mobileBarLogo` and `mobileBarEnd`. The button opens the
same header, content and footer in a drawer from the start edge, `min(280px, 85vw)` wide. It closes
with its close button, Escape, the overlay or choosing an item, and gives the focus back to the menu
button. There is no pin button or tooltip on mobile.

## Custom blocks

Theme switches, account menus or log-out buttons are not part of the sidebar: pass them as blocks in
any zone. `useSidebar()` tells them how the sidebar is:

| Field | Meaning |
|---|---|
| `collapsed` | The desktop rail shows only icons. Always `false` on mobile. |
| `pinned`, `setPinned` | The pinned state and its setter (emits `onPinnedChange`). |
| `isMobile` | Rendering the top bar and drawer. |
| `expandOnHover` | Whether hover expansion is on. |
| `retainExpanded()` | Keeps the sidebar expanded until the function it returns is called. |

A `SidebarItem` already hides its label when collapsed, so it is the easiest custom block:

```tsx
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <SidebarItem icon={isDark ? <Sun /> : <Moon />} label={isDark ? "Light theme" : "Dark theme"} onSelect={toggleTheme} />
  );
};
```

A block whose menu opens in a portal holds the sidebar open while the menu is open; otherwise the
pointer leaving for the portal would collapse it under the menu:

```tsx
const { retainExpanded } = useSidebar();
const release = useRef<(() => void) | null>(null);

<DropdownMenu
  onOpenChange={(open) => {
    release.current?.();
    release.current = open ? retainExpanded() : null;
  }}
/>
```

Every part throws `MissingSidebarLayoutError` when it renders outside `SidebarLayout`.

## Keyboard and accessibility

- The navigation is a `<nav>` named by the `Sidebar`'s `aria-label`; the active item has
  `aria-current="page"`.
- Labels stay in the DOM while collapsed: every icon keeps its accessible name.
- Tab into the collapsed sidebar expands it; Escape collapses it and leaves the focus where it was;
  tabbing out collapses it.
- The pin button has `aria-pressed` and the `pin` / `unpin` text as its name; without hover
  expansion, `aria-expanded` and the `expand` / `collapse` text.
- On mobile the menu button has `aria-expanded` and `aria-controls`; the drawer is a modal dialog with
  a hidden title, traps the focus and locks the page scroll.
- Focus rings are drawn inside the items and buttons, so the scrolling zone never clips them.

## Styling

Every value is a token read with a fallback, so an override on any ancestor applies:

| Token | Default |
|---|---|
| `--gdy-sidebar-width` / `--gdy-sidebar-rail-width` | `280px` / `80px` |
| `--gdy-sidebar-height` | `100dvh` |
| `--gdy-sidebar-padding` | `12px` |
| `--gdy-sidebar-bg` / `--gdy-sidebar-fg` / `--gdy-sidebar-border` | `--gdy-card` / `--gdy-card-foreground` / `--gdy-border` |
| `--gdy-sidebar-item-hover-bg` | `--gdy-muted` |
| `--gdy-sidebar-item-active-bg` / `--gdy-sidebar-item-active-fg` | `--gdy-primary` / `--gdy-primary-foreground` |
| `--gdy-sidebar-item-height` / `--gdy-sidebar-icon-size` | `40px` / `20px` |
| `--gdy-sidebar-separator-color` / `--gdy-sidebar-separator-margin` | `--gdy-border` / `8px` |
| `--gdy-sidebar-scrollbar-thumb` | `--gdy-scrollbar-thumb`, then `--gdy-input` |
| `--gdy-sidebar-logo-mark-size` | `32px` |
| `--gdy-sidebar-overlay-shadow` | `--gdy-shadow-lg` |
| `--gdy-sidebar-duration` | `200ms` |
| `--gdy-sidebar-z` / `--gdy-sidebar-drawer-z` | `40` / `50` |
| `--gdy-sidebar-mobile-bar-height` | `56px` |
| `--gdy-sidebar-drawer-width` | `min(280px, 85vw)` |

The item's start padding places the icon's centre on the rail's centre, and the logo starts where a
mark of `--gdy-sidebar-logo-mark-size` is centred: if your full logo opens with the same mark as the
compact one, nothing moves when the sidebar expands.

`SidebarLayout` and every zone take `className`; `Sidebar` takes a `classNames` object with the
slots `root`, `panel`, `mobileBar` and `drawer`. The states are attributes: `data-state`,
`data-pinned`, `data-hover-expand` and `data-animated` on `gdy-sidebar`, `data-mobile` on
`gdy-sidebar-layout`. `animated={false}` or `prefers-reduced-motion` switch the width animation off.
The full list of classes is in [style-hooks.md](style-hooks.md).

## Texts

| Key | Default |
|---|---|
| `pin` / `unpin` | "Fijar menú" / "Soltar menú" |
| `expand` / `collapse` | "Expandir menú" / "Colapsar menú" |
| `openMenu` / `closeMenu` | "Abrir menú" / "Cerrar menú" |
| `menuTitle` | "Menú de navegación" |

Pass any of them in `texts` on `SidebarLayout`; `DEFAULT_SIDEBAR_TEXTS` holds the defaults.

## Reference

`SidebarLayout` props:

| Prop | Type | Default |
|---|---|---|
| `children` | `ReactNode` | — |
| `pinned` / `defaultPinned` | `boolean` | uncontrolled, `false` |
| `onPinnedChange` | `(pinned: boolean) => void` | — |
| `expandOnHover` | `boolean` | `true` |
| `hoverOpenDelay` / `hoverCloseDelay` | `number` (ms) | `150` / `300` |
| `mobileBreakpoint` | `number` (px) | `768` |
| `animated` | `boolean` | `true` |
| `texts` | `Partial<SidebarTexts>` | Spanish defaults |
| `className` | `string` | — |

`Sidebar` props: `children`, `aria-label` or `aria-labelledby`, `mobileBarLogo`, `mobileBarEnd`,
`className` and `classNames`. `SidebarItem` props: `icon`, `label`, `active`, `onSelect`, `asChild`,
plus the button attributes. `SidebarLogo` props: `full`, `compact` and `className`.

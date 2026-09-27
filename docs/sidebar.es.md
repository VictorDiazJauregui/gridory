# Menú lateral

[English](sidebar.md) · [Español](sidebar.es.md)

`Sidebar` es el menú lateral de una aplicación, con cabecera y pie fijos y una zona central que
scrollea por su cuenta. No guarda estado de negocio: emite eventos y tu app decide qué hacer con ellos.

## Contenido

- [Importación](#importación)
- [Ejemplo rápido](#ejemplo-rápido)
- [Armazón y piezas](#armazón-y-piezas)
- [Modos por hover y fijado](#modos-por-hover-y-fijado)
- [Celular](#celular)
- [Bloques propios](#bloques-propios)
- [Teclado y accesibilidad](#teclado-y-accesibilidad)
- [Estilos](#estilos)
- [Textos](#textos)
- [Referencia](#referencia)

## Importación

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

Importa `gridory/styles.css` una vez en tu app, antes de cualquier sobrescritura (ver
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
const [pinned, setPinned] = useState(false);

<SidebarLayout pinned={pinned} onPinnedChange={setPinned}>
  <Sidebar aria-label="Principal" mobileBarLogo={<Logo />}>
    <SidebarHeader>
      <SidebarLogo full={<Logo />} compact={<LogoMark />} />
      <SidebarPinButton />
    </SidebarHeader>
    <SidebarContent>
      <SidebarItem icon={<Table2 />} label="Tabla" active onSelect={() => navigate("/tabla")} />
      <SidebarSeparator />
      <SidebarItem icon={<Bot />} label="Asistente" onSelect={() => navigate("/asistente")} />
    </SidebarContent>
    <SidebarFooter>
      <ThemeToggle />
    </SidebarFooter>
  </Sidebar>
  <main>{page}</main>
</SidebarLayout>
```

## Armazón y piezas

`SidebarLayout` guarda el estado y ubica el menú al lado de tu página (encima en celular). Pon primero
el `Sidebar` y después la página; la página recibe `min-width: 0`, así una tabla ancha nunca empuja el
armazón hacia los costados.

| Pieza | Qué hace |
|---|---|
| `SidebarLayout` | Proveedor del estado y la fila `menú │ página`. No es un ámbito de estilos: tu página conserva los suyos. |
| `Sidebar` | El raíl de iconos en escritorio; una barra superior y un cajón en celular. Necesita `aria-label` o `aria-labelledby`, que lleva su navegación. |
| `SidebarHeader` / `SidebarFooter` | Zonas fijas. Aceptan cualquier bloque. |
| `SidebarContent` | El `<nav>` del centro, la única zona que scrollea, con scrollbar fina. |
| `SidebarLogo` | `full` desplegado y en el cajón, `compact` en el raíl colapsado. |
| `SidebarItem` | Icono y rótulo. Un botón por defecto; con `asChild`, el enlace de tu router. `active` pone `aria-current="page"`. |
| `SidebarSeparator` | Una línea entre ítems (`role="separator"`). |
| `SidebarPinButton` | Fija y suelta. Ubícalo en la cabecera o en el pie. |
| `useSidebar()` | El estado para tus propios bloques (ver [Bloques propios](#bloques-propios)). |

El menú mide lo mismo que la pantalla (`--gdy-sidebar-height`, `100dvh` por defecto) y queda pegado
arriba: la página scrollea, el menú no, y dentro de él solo scrollea `SidebarContent`. Cambia
`--gdy-sidebar-height` para ubicarlo dentro de un contenedor de otro alto.

Ítems con un enlace del router:

```tsx
<SidebarItem icon={<FileText />} label="Documentos" active={pathname === "/documentos"} asChild>
  <Link to="/documentos" />
</SidebarItem>
```

## Modos por hover y fijado

| Estado | Espacio que ocupa | Cómo se llega |
|---|---|---|
| Colapsado (inicial) | El raíl, 80px | Por defecto; al salir el puntero o el foco; Escape |
| Desplegado por hover | Sigue en 80px: el panel crece **por encima** de la página | El puntero se detiene en el raíl (`hoverOpenDelay`, 150 ms) o entra el foco del teclado |
| Fijado | 280px: **empuja** la página | `SidebarPinButton` o `setPinned(true)` |

Al salir del raíl se colapsa tras `hoverCloseDelay` (300 ms), así cruzarlo camino a la página nunca lo
hace parpadear. Un clic adentro no lo mantiene abierto: solo el foco del teclado.

El fijado es controlado (`pinned` y `onPinnedChange`) o no controlado (`defaultPinned`). La librería
nunca lo guarda: persístelo tú si quieres que sobreviva a una recarga.

Con `expandOnHover={false}` no hay despliegue por hover: el raíl colapsado muestra un tooltip en cada
icono y el mismo botón lo expande y colapsa a mano ("Expandir menú" / "Colapsar menú", con
`aria-expanded`). En la cabecera colapsada el botón ocupa el lugar del logo.

## Celular

Por debajo de `mobileBreakpoint` (768px de ancho de ventana por defecto) el raíl se vuelve una barra
superior de 56px, pegada arriba dentro del flujo, con el botón de menú, `mobileBarLogo` y
`mobileBarEnd`. El botón abre la misma cabecera, centro y pie en un cajón desde el borde inicial, de
`min(280px, 85vw)`. Se cierra con su botón de cerrar, Escape, el velo o al elegir un ítem, y devuelve
el foco al botón de menú. En celular no hay botón de fijar ni tooltips.

## Bloques propios

El cambio de tema, un menú de cuenta o cerrar sesión no son parte del menú: pásalos como bloques en
cualquier zona. `useSidebar()` les cuenta cómo está el menú:

| Campo | Significado |
|---|---|
| `collapsed` | El raíl de escritorio muestra solo iconos. Siempre `false` en celular. |
| `pinned`, `setPinned` | El estado de fijado y su setter (emite `onPinnedChange`). |
| `isMobile` | Se muestran la barra superior y el cajón. |
| `expandOnHover` | Si el despliegue por hover está activo. |
| `retainExpanded()` | Mantiene el menú desplegado hasta que se llama a la función que devuelve. |

Un `SidebarItem` ya oculta su rótulo al colapsarse, así que es el bloque propio más simple:

```tsx
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <SidebarItem icon={isDark ? <Sun /> : <Moon />} label={isDark ? "Tema claro" : "Tema oscuro"} onSelect={toggleTheme} />
  );
};
```

Un bloque cuyo menú se abre en un portal retiene el menú lateral mientras está abierto; si no, el
puntero que sale hacia el portal lo colapsaría debajo del menú:

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

Toda pieza lanza `MissingSidebarLayoutError` si se renderiza fuera de `SidebarLayout`.

## Teclado y accesibilidad

- La navegación es un `<nav>` con el nombre del `aria-label` del `Sidebar`; el ítem activo tiene
  `aria-current="page"`.
- Los rótulos siguen en el DOM al colapsarse: cada icono conserva su nombre accesible.
- Entrar con Tab al menú colapsado lo despliega; Escape lo colapsa y deja el foco donde estaba; salir
  con Tab lo colapsa.
- El botón de fijar tiene `aria-pressed` y "Fijar menú" / "Soltar menú" como nombre; sin despliegue
  por hover, `aria-expanded` y "Expandir menú" / "Colapsar menú".
- En celular el botón de menú tiene `aria-expanded` y `aria-controls`; el cajón es un diálogo modal con
  título oculto, atrapa el foco y bloquea el scroll de la página.
- Los anillos de foco se dibujan dentro de ítems y botones, así la zona que scrollea nunca los recorta.

## Estilos

Cada valor es un token leído con fallback, así que una sobrescritura en cualquier ancestro se aplica:

| Token | Por defecto |
|---|---|
| `--gdy-sidebar-width` / `--gdy-sidebar-rail-width` | `280px` / `80px` |
| `--gdy-sidebar-height` | `100dvh` |
| `--gdy-sidebar-padding` | `12px` |
| `--gdy-sidebar-bg` / `--gdy-sidebar-fg` / `--gdy-sidebar-border` | `--gdy-card` / `--gdy-card-foreground` / `--gdy-border` |
| `--gdy-sidebar-item-hover-bg` | `--gdy-muted` |
| `--gdy-sidebar-item-active-bg` / `--gdy-sidebar-item-active-fg` | `--gdy-primary` / `--gdy-primary-foreground` |
| `--gdy-sidebar-item-height` / `--gdy-sidebar-icon-size` | `40px` / `20px` |
| `--gdy-sidebar-separator-color` / `--gdy-sidebar-separator-margin` | `--gdy-border` / `8px` |
| `--gdy-sidebar-scrollbar-thumb` | `--gdy-scrollbar-thumb`, y luego `--gdy-input` |
| `--gdy-sidebar-logo-mark-size` | `32px` |
| `--gdy-sidebar-overlay-shadow` | `--gdy-shadow-lg` |
| `--gdy-sidebar-duration` | `200ms` |
| `--gdy-sidebar-z` / `--gdy-sidebar-drawer-z` | `40` / `50` |
| `--gdy-sidebar-mobile-bar-height` | `56px` |
| `--gdy-sidebar-drawer-width` | `min(280px, 85vw)` |

El padding inicial del ítem pone el centro del icono en el centro del raíl, y el logo empieza donde
queda centrada una marca de `--gdy-sidebar-logo-mark-size`: si tu logo completo empieza con la misma
marca que el compacto, nada se mueve al desplegarse.

`SidebarLayout` y cada zona aceptan `className`; `Sidebar` acepta un objeto `classNames` con los slots
`root`, `panel`, `mobileBar` y `drawer`. Los estados son atributos: `data-state`, `data-pinned`,
`data-hover-expand` y `data-animated` en `gdy-sidebar`, `data-mobile` en `gdy-sidebar-layout`.
`animated={false}` o `prefers-reduced-motion` apagan la animación del ancho. La lista completa de
clases está en [style-hooks.es.md](style-hooks.es.md).

## Textos

| Clave | Por defecto |
|---|---|
| `pin` / `unpin` | "Fijar menú" / "Soltar menú" |
| `expand` / `collapse` | "Expandir menú" / "Colapsar menú" |
| `openMenu` / `closeMenu` | "Abrir menú" / "Cerrar menú" |
| `menuTitle` | "Menú de navegación" |

Pasa cualquiera en `texts` de `SidebarLayout`; `DEFAULT_SIDEBAR_TEXTS` tiene los valores por defecto.

## Referencia

Props de `SidebarLayout`:

| Prop | Tipo | Por defecto |
|---|---|---|
| `children` | `ReactNode` | — |
| `pinned` / `defaultPinned` | `boolean` | no controlado, `false` |
| `onPinnedChange` | `(pinned: boolean) => void` | — |
| `expandOnHover` | `boolean` | `true` |
| `hoverOpenDelay` / `hoverCloseDelay` | `number` (ms) | `150` / `300` |
| `mobileBreakpoint` | `number` (px) | `768` |
| `animated` | `boolean` | `true` |
| `texts` | `Partial<SidebarTexts>` | textos en español |
| `className` | `string` | — |

Props de `Sidebar`: `children`, `aria-label` o `aria-labelledby`, `mobileBarLogo`, `mobileBarEnd`,
`className` y `classNames`. Props de `SidebarItem`: `icon`, `label`, `active`, `onSelect`, `asChild`,
más los atributos del botón. Props de `SidebarLogo`: `full`, `compact` y `className`.

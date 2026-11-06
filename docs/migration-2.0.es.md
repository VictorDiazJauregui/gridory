# Migrar a la 2.0

La 2.0.0 solo rompe lo que lista esta guía. Todo lo demás (marcado, clases, estilos y eventos) es igual que
en la 1.5.0. Cada sección dice a quién afecta, qué cambiar y cómo comprobar que no quedó nada.

## Preset de Tailwind

**A quién afecta:** a las apps que usan el export por defecto de `gridory/tailwind-preset` y escriben sus
utilidades sin prefijo en su propio markup (`bg-primary`, `text-muted-foreground`, `rounded-lg`…). Las apps
que no usan Tailwind, que usan `createGridoryPreset()` o que no usan preset (proyectos shadcn) no cambian nada.

El export por defecto ahora es `createGridoryPreset()`: los mismos colores y radios, bajo el prefijo `gdy`.

```js
// tailwind.config.js: la configuración no cambia
import gridoryPreset from "gridory/tailwind-preset";

export default { presets: [gridoryPreset] };
```

```tsx
// 1.x
<span className="rounded-md bg-muted/40 text-muted-foreground hover:bg-muted">Pendiente</span>
// 2.0
<span className="rounded-gdy-md bg-gdy-muted/40 text-gdy-muted-foreground hover:bg-gdy-muted">Pendiente</span>
```

**Tailwind no avisa** de una clase que ya no genera: simplemente deja de pintarla. Reemplaza cada utilidad
del preset anterior y conserva las variantes (`hover:`, `dark:`) y los modificadores de opacidad (`/40`):

| 1.x | 2.0 |
|---|---|
| `<utilidad>-<color>`, para `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive` (y sus `-foreground`), `border`, `input` y `ring` | `<utilidad>-gdy-<color>`: `bg-gdy-card`, `text-gdy-primary-foreground`, `border-gdy-border`, `outline-gdy-ring` |
| `rounded-lg`, `rounded-md`, `rounded-sm` (y `rounded-t-lg`…) | `rounded-gdy-lg`, `rounded-gdy-md`, `rounded-gdy-sm` (y `rounded-t-gdy-lg`…) |

`rounded-lg`, `rounded-md` y `rounded-sm` siguen existiendo sin el preset, con los tamaños propios de
Tailwind: si los dejas, las esquinas cambian unos píxeles en lugar de romperse. Reemplázalos también para
conservar el radio de la librería (`--gdy-radius`).

Para encontrar lo que falta, busca en tu código (agrega las carpetas que lee el `content` de Tailwind):

```bash
grep -rnE "(bg|text|border|ring|outline|fill|stroke|divide|from|via|to)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring)\b|rounded(-[a-z]{1,2})?-(lg|md|sm)\b" src
```

**Proyectos shadcn:** si tu configuración ya define `primary`, `muted` y el resto, esas utilidades son
tuyas, no del preset; quita el preset, como recomienda la [guía de temas](theming.es.md#preset-de-tailwind),
y no cambia nada.

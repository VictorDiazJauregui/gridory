# Cómo contribuir a Gridory

[English](CONTRIBUTING.md) · [Español](CONTRIBUTING.es.md)

Los reportes de bugs, las ideas y los pull requests son bienvenidos. Puedes escribir los issues y los
pull requests en español o en inglés.

## Issues

Antes de abrir uno, busca entre los issues abiertos por si alguien ya reportó lo mismo.

- **Bug.** Usa la plantilla de bug. Incluye el commit o la versión de Gridory, tu versión de React, el
  navegador, qué esperabas y qué pasó. Una reproducción mínima (un repo pequeño o un StackBlitz) ahorra
  muchas idas y vueltas.
- **Feature o cambio.** Usa la plantilla de feature request y describe el problema antes que la
  solución. Si es algo más grande que un fix chico, abre el issue antes de escribir código para que
  acordemos el enfoque.
- **Pregunta.** Abre un issue normal.

No reportes problemas de seguridad en un issue público. Usa "Report a vulnerability" en la pestaña
Security del repositorio, que abre un reporte privado.

## Entorno local

Necesitas Node 22 (ver `.nvmrc`) y npm.

```bash
git clone https://github.com/VictorDiazJauregui/gridory.git
cd gridory
npm ci
npm run dev
```

La demo corre en `http://localhost:5173` con una página por módulo (`/mocks/table`, `/mocks/kanban`,
`/mocks/ai`, `/mocks/auth`, `/mocks/controls`, `/mocks/sidebar`). Agrega `?theme=dark` para revisar el tema oscuro. Para probar el asistente con un
proveedor real, copia `.env.example` a `.env.local`, completa `VITE_AI_API_KEY` y reinicia `npm run dev`. Los
valores de ejemplo apuntan a Gemini a través de un proxy de Vite que evita CORS. Sin key la demo se
muestra, pero no hace llamadas. La demo usa Tailwind solo para sí misma; nada de eso se publica.

`package.json` fuerza `minimatch` a `^11.0.4` con `overrides`: eslint 9 y typescript-eslint todavía traen
versiones anteriores con un aviso conocido de denegación de servicio (GHSA-g3hv-75wg-m249). El override rige solo
en este repositorio, nunca en las apps que instalan Gridory. Se quita cuando los dos dependan de `minimatch` 11 por
su cuenta y `npm audit` siga limpio sin él.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de Vite con la demo. |
| `npm run build` | Chequeo de tipos, bundle ESM en `dist/` y declaraciones de tipos en `dist/types/`. |
| `npm run lint` | ESLint sobre el código y `scripts/`, con las reglas de estilo de código de abajo. |
| `npm run typecheck` | `tsc -b` sin generar archivos. |
| `npm test` / `npm run test:watch` | Vitest sobre `src/test/`; la variante watch vuelve a correr con cada cambio. |
| `npm run audit:styles` | Después de `npm run build`: contrasta las hojas de estilo con las clases y atributos de estado que emiten los componentes, comprueba que `base.css` y las hojas de módulo rearmen `gridory.css` y verifica que `docs/style-hooks.md` esté al día. |
| `npm run docs:hooks` | Regenera `docs/style-hooks.md` y `docs/style-hooks.es.md` a partir del código. |

## Estructura del código

Cada módulo vive en `src/components/<módulo>/`. La raíz tiene la superficie pública y los contratos
(`index.tsx` o `index.ts`, `types.ts`, `constants.ts` y `styles.css`). El resto se divide en carpetas
por área, nunca por tipo de archivo, con 3 a 12 archivos cada una y sin barrels dentro.

| Carpeta | Áreas |
|---|---|
| `table/` | `model/`, `header/`, `body/`, `pagination/` |
| `kanban/` | `model/`, `toolbar/`, `board/`, `card/` |
| `ai/` | `chat/`, `completion/`, `sidebar/`, `transcript/`, `actions/` |
| `auth/` | `config/`, `model/`, `fields/`, `password/`, `validation/`, `layout/`, `actions/` |
| `segmented-control/` | `model/`, `parts/` |
| `country-select/` | `model/`, `parts/`, `validation/` |
| `phone-input/` | `model/`, `parts/` |
| `sidebar/` | `model/`, `parts/`, `desktop/`, `mobile/` |
| `shared/` | Contratos comunes en la raíz; `controls/`, `rows/`, `toolbar/`, `filter-menu/`, `date-filter-menu/`, `date-pickers/`, `menu/` |
| `ui/` | Primitivas sobre Radix y react-day-picker: `select/`, `toggle-group/`, `calendar/` |
| `mocks/` | Datos y configuración de la demo |

La demo está en `src/demo/`, los tests en `src/test/` y las guías en `docs/`. La demo, los mocks y los
tests quedan fuera del paquete y de la auditoría de estilos.

## Antes de abrir un pull request

Corre los mismos chequeos que la CI:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:styles
```

Si tocaste una hoja de estilos o agregaste una clase, corre `npm run docs:hooks` y commitea los
`docs/style-hooks.md` y `docs/style-hooks.es.md` regenerados. La auditoría de estilos falla si quedan
desactualizados.

## Estilo de código

ESLint aplica casi todas estas reglas, así que `npm run lint` te avisa cuando algo no cumple.

- Las funciones son arrow functions con `const`, de 20 líneas como máximo (markup incluido) y hasta 3
  parámetros. Si necesitas más, agrúpalos en un objeto.
- Early returns en lugar de `if`/`else` anidados. Sin ternarios anidados y con dos niveles de
  anidación como máximo.
- Nombres en inglés que digan qué es o qué hace cada cosa. Nada de `utils`, `helpers` ni `data`
  genéricos.
- Los comentarios explican el porqué, no el qué. Sin código comentado, exports sin uso ni
  `console.log`.
- Cada módulo vive en `src/components/<módulo>/`, con su superficie pública en la raíz y carpetas por
  área (`model/`, `header/`, `body/`…). Se importa el archivo concreto; dentro de las áreas no hay
  barrels.

## Estilos

Gridory usa CSS plano, sin Tailwind ni clases utilitarias.

- Cada elemento que renderiza la librería lleva una clase `gdy-*`. Las partes de un módulo se llaman
  `gdy-<módulo>-<parte>`.
- Los estados van en atributos `data-*` o ARIA (`data-selected`, `aria-pressed`), nunca en clases.
- Los colores salen de tokens. Los colores literales solo se permiten en `src/styles/tokens.css`, y
  los tokens de componente siempre se leen con fallback: `var(--gdy-table-head-bg, var(--gdy-muted))`.
- Una clase nueva necesita una regla, o una entrada en `hookOnly` de `scripts/audit-allowlist.json`
  si es un gancho sin estilos por defecto.
- Un módulo nuevo con su propio `styles.css` tiene su hoja por módulo agregando su nombre a `MODULE_NAMES`
  en `scripts/split-stylesheets.mjs`, en el lugar que ocupan sus reglas en `gridory.css`, y su export
  `"./<módulo>.css"` en `package.json`. La auditoría de estilos falla mientras el orden esté mal.

[Temas y estilos](docs/theming.es.md) explica el contrato completo.

## Tests

Los tests viven en `src/test/` y corren con Vitest y Testing Library. Un fix debería venir con un test
que falle sin él. Las features nuevas necesitan al menos un smoke test del camino principal.

`npm test` corre dos proyectos:

- `unit` corre sobre jsdom y cubre comportamiento, ARIA y teclado. La mayoría de los tests van aquí.
- `browser` corre los archivos `*.browser.test.tsx` en Google Chrome sin ventana, con las hojas de
  estilo reales, para revisar estilos, medidas y posiciones: el foco, los bordes, los altos, hacia
  dónde abre un panel. jsdom no calcula el layout, así que estas pruebas no pueden correr ahí. Que
  sean pocas y enfocadas, porque son más lentas.

`src/test/` se revisa con `tsconfig.test.json`, que suma los tipos de Node que usan los tests (`node:fs`,
`process`). El código de la librería se revisa con `tsconfig.app.json`, sin ellos, para que no pueda usar Node por
accidente.

Los helpers de `src/test/browser/` miden cajas y estilos computados, y cambian el tema y el tamaño de
pantalla (escritorio, iPhone 14 Pro y Pixel 7).

En listas largas, como países o prefijos, elige una opción con `getOptionByName` de
`src/test/option-queries.ts` en lugar de `getByRole("option", { name })`. `getByRole` calcula el
nombre accesible de todas las opciones, y en jsdom eso cuesta más de 100 ms por consulta sobre los ~250
países y empuja los tests por encima del límite de tiempo de la CI. El helper comprueba lo mismo (una
sola opción visible con ese nombre accesible), pero solo sobre la que coincide.

El proyecto `browser` usa el Google Chrome instalado en tu máquina, igual que la CI usa el que trae el
runner de GitHub, así que no hay que descargar ningún navegador. Solo necesitas tener Chrome instalado.

### Tests de navegador rápidos

Los archivos de navegador comparten una página por worker, así que cada test la deja como la encontró:

- Cambia la media de impresión, el movimiento reducido o el táctil solo con los helpers de
  `src/test/browser/` (`emulateMediaType`, `emulateReducedMotion`, `emulateTouchScreen`). Anotan qué
  cambiaron y el setup lo deshace después de cada test, aunque falle, así que ningún archivo necesita su
  propio `afterEach` para eso. El tema y el tamaño de pantalla vuelven a claro y escritorio de la misma
  forma.
- Los tests corren con movimiento reducido. Un test de una animación activa el movimiento con
  `emulateReducedMotion(false)`; los demás nunca esperan una.
- Un archivo que necesita una página nueva va en `OWN_PAGE_BROWSER_TESTS` de `vitest.config.ts`, con el
  motivo: emulación táctil, `:focus-visible` después de un foco por código, o un módulo diferido que se
  carga por primera vez.
- Espera una condición, nunca un tiempo fijo: `expect.poll` (que en este proyecto reintenta una vez por
  cuadro), `vi.waitFor` o `findBy*`. Un `setTimeout` es lento o inestable.
- Dale a cada test solo los datos que mira: unas pocas filas en lugar de una tabla completa, y `paste`
  en lugar de teclear cuando el texto es solo la preparación.
- Cuando el componente escucha dónde está el puntero, mueve el puntero real con `userEvent.hover`: un
  `pointerenter` sintético no lo mueve, y el cursor queda donde lo dejó el archivo anterior.

## Documentación

La documentación está en inglés, con una copia en español (`*.es.md`) al lado de cada archivo.
Actualiza las dos cuando cambies un comportamiento. Si solo escribes una, indícalo en el pull request y
se traduce antes del merge.

## Commits y pull requests

- Crea tu rama desde `staging`, abre el pull request hacia `staging` y que trate una sola cosa.
  `main` solo recibe releases.
- Mensajes de commit en inglés, con un prefijo en mayúsculas: `FEAT`, `FIX`, `REFAC`, `STYLE`, `DOC`,
  `TEST`, `CHORE`, `CI` o `DEL`. Por ejemplo `FIX: keep the page when a filter is cleared`. El asunto,
  por debajo de 50 caracteres.
- Los títulos de los pull requests siguen `TIPO(ámbito): Descripción`, por ejemplo
  `FIX(table): Mantiene la página al limpiar un filtro`.
- Completa la plantilla del pull request: qué cambió, cómo lo probaste y qué debería mirar quien lo
  revise.

## Licencia

Gridory se publica bajo la [licencia MIT](LICENSE). Al enviar una contribución aceptas que se publique
bajo la misma licencia.

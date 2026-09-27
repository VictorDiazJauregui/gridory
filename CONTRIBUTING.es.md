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
proveedor real, copia `.env.example` a `.env.local` y completa tu key.

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

Los helpers de `src/test/browser/` miden cajas y estilos computados, y cambian el tema y el tamaño de
pantalla (escritorio, iPhone 14 Pro y Pixel 7).

El proyecto `browser` usa el Google Chrome instalado en tu máquina, igual que la CI usa el que trae el
runner de GitHub, así que no hay que descargar ningún navegador. Solo necesitas tener Chrome instalado.

## Documentación

La documentación está en inglés, con una copia en español (`*.es.md`) al lado de cada archivo.
Actualiza las dos cuando cambies un comportamiento. Si solo escribes una, indícalo en el pull request y
se traduce antes del merge.

## Commits y pull requests

- Crea tu rama desde `main` y que cada pull request trate una sola cosa.
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

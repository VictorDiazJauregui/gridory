# Editor Markdown

[English](markdown-editor.md) · [Español](markdown-editor.es.md)

`MarkdownEditor` permite escribir Markdown estándar (CommonMark y GFM) y ver al lado el HTML
sanitizado. No guarda estado de negocio: emite eventos (`onChange`, `onViewChange`,
`onEmojiSelect`…) y tu app decide qué guardar. Todo lo que escribe es Markdown común, que cualquier
otro visor lee igual: sin sintaxis propia.

## Contenido

- [Importar](#importar)
- [Ejemplo rápido](#ejemplo-rápido)
- [Vistas y scroll sincronizado](#vistas-y-scroll-sincronizado)
- [Barra](#barra)
- [Herramientas](#herramientas)
- [Ventanas](#ventanas)
- [Imágenes](#imágenes)
- [Índice](#índice)
- [Guía](#guía)
- [Visor de solo lectura](#visor-de-solo-lectura)
- [Diagramas y fórmulas](#diagramas-y-fórmulas)
- [Renderizado y seguridad](#renderizado-y-seguridad)
- [Peso](#peso)
- [Teclado y accesibilidad](#teclado-y-accesibilidad)
- [Celular](#celular)
- [Estilos](#estilos)
- [Textos](#textos)
- [Referencia](#referencia)

## Importar

```ts
import { MarkdownEditor, MarkdownViewer } from "gridory/markdown-editor";
```

Importá `gridory/styles.css` una sola vez en tu app, antes de cualquier override (ver
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres. Dos entradas
opcionales agregan el dibujo a demanda: `gridory/markdown-editor/mermaid` y
`gridory/markdown-editor/katex` (ver [Diagramas y fórmulas](#diagramas-y-fórmulas)).

## Ejemplo rápido

```tsx
import { useState } from "react";
import { MarkdownEditor } from "gridory/markdown-editor";

export const NoteEditor = () => {
  const [markdown, setMarkdown] = useState("# Notas de la reunión\n\n- [ ] Enviar el resumen");
  return <MarkdownEditor value={markdown} onChange={setMarkdown} />;
};
```

Sin `value` y con `defaultValue` el editor es no controlado. `onChange` recibe el Markdown completo en
cada edición, tipeada o aplicada por una herramienta.

## Vistas y scroll sincronizado

| Prop | Por defecto | Qué hace |
|---|---|---|
| `view` / `defaultView` | `"split"` | `"split"` (los dos paneles), `"source"` (solo el editor) o `"preview"` (solo el resultado). |
| `onViewChange` | — | Se dispara cuando el selector cambia la vista. |
| `views` | `["source", "split", "preview"]` | Vistas que ofrece el selector, en orden. Con una sola, el selector se oculta. |
| `syncScroll` | `true` | En la vista dividida, scrollear un panel lleva al otro al mismo bloque. |

La sincronización une líneas del texto con bloques de la vista previa, así imágenes, tablas, código,
diagramas y fórmulas quedan alineados aunque midan distinto en cada panel. Los bloques que se dibujan
a demanda (diagramas, fórmulas) vuelven a alinear los paneles cuando terminan.

## Barra

`toolbarPlacement` decide dónde pone `MarkdownEditor` su barra:

| Valor | Dónde |
|---|---|
| `"shared"` (por defecto) | Sobre los dos paneles, junto al selector de vista. |
| `"source"` | Solo sobre el área de escritura. |
| `"none"` | En ningún lado: armala vos con `MarkdownToolbar`. |

Para un diseño libre, usá las partes dentro de `MarkdownEditorProvider`:

```tsx
import { MarkdownEditorProvider, MarkdownPanels, MarkdownToolbar, MarkdownViewSwitch } from "gridory/markdown-editor";

<MarkdownEditorProvider value={markdown} onChange={setMarkdown}>
  <header className="note-header">
    <h2>Nota del cliente</h2>
    <MarkdownToolbar />
    <MarkdownViewSwitch />
  </header>
  <MarkdownPanels />
</MarkdownEditorProvider>;
```

`MarkdownSource`, `MarkdownPreview` y `MarkdownOutline` también se usan sueltos, y
`useMarkdownEditor()` le da a cualquier parte dentro del proveedor el valor, la vista y las acciones
(`apply`, `undo`, `openDialog`…). Las herramientas que no entran se pliegan en un menú "⋯", medido en
cada cambio de tamaño.

## Herramientas

`tools` recibe un preset (`"full"`, `"simple"`, `"minimal"`) o una lista de ids y objetos de
herramienta, con `"|"` entre grupos. `MARKDOWN_TOOLBAR_PRESETS` tiene los presets y
`MARKDOWN_TOOL_IDS` todos los ids incluidos.

| Id | Escribe o hace | Atajo |
|---|---|---|
| `undo`, `redo` | Deshacer y rehacer; cada herramienta es un solo paso | `Mod+Z`, `Mod+Shift+Z` |
| `bold`, `italic`, `strikethrough`, `inlineCode` | `**…**`, `*…*`, `~~…~~`, `` `…` `` (alternan) | `Mod+B`, `Mod+I`, `Mod+Shift+X`, `Mod+E` |
| `uppercase`, `lowercase`, `capitalize` | Cambian mayúsculas de la selección | — |
| `heading` | Menú con H1 a H6 | — |
| `quote`, `bulletList`, `orderedList`, `taskList` | `> `, `- `, `1. `, `- [ ] ` por línea (alternan) | — |
| `horizontalRule` | `---` | — |
| `alert` | Avisos de GitHub: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` | — |
| `link`, `reference`, `image`, `codeBlock`, `table` | Abren sus ventanas | `Mod+K` (enlace) |
| `diagram`, `formula` | Ventana de diagramas, `$…$` / `$$…$$` | — (solo si están configurados) |
| `emoji`, `htmlEntity` | Selector de emoji y de entidades HTML | — |
| `dateTime` | Fecha y hora actuales, con `locale` o `formatDateTime` | — |
| `search`, `replace`, `goToLine` | Panel de búsqueda | `Mod+F`, `Mod+H`, `Mod+G` |
| `outline` | Abre y cierra el [índice](#índice) | — |
| `fullscreen` | Cubre la página; `Escape` sale | — |
| `clear` | Vacía el documento después de confirmar; se puede deshacer | — |
| `guide` | Abre la [guía de sintaxis](#guía) | — |

`Mod` es ⌘ en macOS y Ctrl en el resto. Una herramienta propia es un objeto:

```tsx
import { insertText, MarkdownEditor, type MarkdownTool } from "gridory/markdown-editor";
import { PenLine } from "lucide-react";

const SIGNATURE_TOOL: MarkdownTool = {
  id: "signature",
  label: "Firma",
  icon: PenLine,
  shortcut: "Mod-Shift-f",
  run: ({ editor }) => editor.apply(insertText("\n\n— Equipo de soporte")),
};

<MarkdownEditor tools={["bold", "italic", "|", "link", "|", SIGNATURE_TOOL]} />;
```

Los comandos son funciones puras del texto y la selección (`wrapSelection`, `prefixLines`,
`insertBlock`, `insertText`, `transformCase`, `markdownCommands`…): una herramienta los reutiliza y
un test los prueba sin navegador. Un id desconocido lanza `UnknownMarkdownToolError`.

## Ventanas

Enlaces, referencias, imágenes, bloques de código, tablas, emoji, símbolos, diagramas y la guía se
abren en ventanas. Cada una solo devuelve datos; el editor escribe el Markdown. Cualquiera se
reemplaza con `dialogs`: tu componente recibe las mismas props (`open`, `onOpenChange`, `onInsert`,
`selectedText` y las propias de esa ventana) y `MarkdownDialogFrame` le da el marco incluido.

```tsx
import { useId, useState, type FormEvent } from "react";
import { MarkdownDialogFrame, MarkdownEditor, type LinkInsert, type MarkdownDialogProps } from "gridory/markdown-editor";

const PAGES = [{ label: "Precios", url: "/precios" }, { label: "Contacto", url: "/contacto" }];

const InternalPageDialog = ({ open, onOpenChange, onInsert, selectedText }: MarkdownDialogProps<LinkInsert>) => {
  const formId = useId();
  const [url, setUrl] = useState(PAGES[0].url);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const page = PAGES.find((candidate) => candidate.url === url) ?? PAGES[0];
    onInsert({ text: selectedText || page.label, url: page.url });
  };
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title="Enlazar una página" formId={formId} submitLabel="Enlazar">
      <form id={formId} onSubmit={submit}>
        {PAGES.map((page) => (
          <label key={page.url}>
            <input type="radio" name="page" checked={url === page.url} onChange={() => setUrl(page.url)} /> {page.label}
          </label>
        ))}
      </form>
    </MarkdownDialogFrame>
  );
};

<MarkdownEditor dialogs={{ link: InternalPageDialog }} />;
```

| Clave de `dialogs` | Props además de `open` y `onOpenChange` |
|---|---|
| `link` | `onInsert(LinkInsert)`, `selectedText` |
| `reference` | `onInsert(ReferenceInsert)`, `selectedText`, `existingIds` |
| `image` | `onInsert(ImageInsert)`, `selectedText`, `uploadImage`, `uploadRules` |
| `code` | `onInsert(CodeInsert)`, `selectedText`, `languages` |
| `table` | `onInsert(TableInsert)`, `selectedText`, `limits` |
| `emoji` | `onInsert(SymbolInsert)`, `selectedText`, `recentEmojis` |
| `htmlEntity` | `onInsert(SymbolInsert)`, `selectedText` |
| `diagram` | `onInsert(DiagramInsert)`, `selectedText`, `templates`, `diagrams` |
| `guide` | `sections`, `tools` |

Las ventanas incluidas también se exportan (`LinkDialog`, `ImageDialog`, `CodeDialog`, `TableDialog`,
`EmojiDialog`, `HtmlEntityDialog`, `DiagramDialog`, `GuideDialog`…) para envolverlas. Al cerrarse, el
foco vuelve al botón que la abrió, o al área de escritura si se abrió con un atajo. `limits` acota la
ventana de tabla (`{ tableRows: 20, tableColumns: 10 }` por defecto) y `codeLanguages` define los
lenguajes de la ventana de código y del coloreado (`DEFAULT_CODE_LANGUAGES`, 21 lenguajes cargados a
demanda).

El selector de emoji baja su catálogo recién al abrirse, busca en español e inglés, guarda los
recientes en memoria y llama a `onEmojiSelect` para que tu app los guarde.

## Imágenes

Sin `onImageUpload`, las imágenes son URLs. Con ella, la ventana de imagen también acepta archivos, y
pegar o soltar una imagen en el área de escritura la sube:

```tsx
<MarkdownEditor
  onImageUpload={async (file) => ({ url: await uploadToStorage(file), alt: file.name })}
  acceptedImageTypes={["image/png", "image/jpeg"]}
  maxImageBytes={2 * 1024 * 1024}
/>
```

Mientras sube una imagen pegada o soltada, el documento muestra un marcador que la URL final
reemplaza. Si la promesa se rechaza, se muestra su mensaje y el marcador se quita. Los archivos fuera
de `acceptedImageTypes` o por encima de `maxImageBytes` (5 MB por defecto) se rechazan antes de subir.

## Índice

La herramienta `outline` abre un panel lateral con los títulos del documento en árbol, con los mismos
ids que les da la vista previa y sin escribir ninguna marca en el documento. Un clic o `Enter` lleva
los dos paneles al título, y el panel marca el título visible al scrollear. Se controla con
`showOutline`, `defaultShowOutline` y `onOutlineChange`. `readMarkdownHeadings(markdown)` devuelve la
misma lista para un índice propio.

## Guía

La herramienta `guide` abre la guía de sintaxis, con dos pestañas (Escribir e Insertar). Cada sección
muestra el Markdown, su resultado y los iconos y atajos de las herramientas que lo escriben. Sigue a
la barra: una sección aparece solo si alguna de sus herramientas está en la barra, así que quitar una
herramienta, o no configurar diagramas o fórmulas, quita su sección.

```tsx
<MarkdownEditor
  guide={{
    sections: (defaults) => [
      ...defaults.filter((section) => section.id !== "html-entities"),
      { id: "signature", tab: "write", title: "Firma", description: "Cerrá cada nota.", examples: ["— *Equipo de soporte*"], toolIds: [] },
    ],
  }}
/>
```

`guide={false}` quita el botón, `DEFAULT_GUIDE_SECTIONS` tiene las secciones incluidas y
`dialogs.guide` reemplaza el marco. Una sección sin `toolIds` aparece siempre.

## Visor de solo lectura

`MarkdownViewer` muestra Markdown guardado igual que la vista previa, sin cargar el editor (CodeMirror
queda fuera de su bundle):

```tsx
import { MarkdownViewer } from "gridory/markdown-editor";

<MarkdownViewer value={note.body} aria-label="Nota" />;
```

Recibe `renderOptions`, `codeLanguages`, `diagrams` y `formulas` igual que el editor. Para HTML fuera
de React, `renderMarkdown(markdown, options)` devuelve el mismo texto sanitizado.

## Diagramas y fórmulas

Los dos son opcionales, no cuestan nada hasta que un documento los usa y necesitan que tu app instale
su paquete:

```bash
npm install mermaid katex
```

```tsx
import { MarkdownEditor, MarkdownViewer } from "gridory/markdown-editor";
import { mermaidDiagrams } from "gridory/markdown-editor/mermaid";
import { katexFormulas } from "gridory/markdown-editor/katex";

<MarkdownEditor diagrams={mermaidDiagrams} formulas={katexFormulas} />;
<MarkdownViewer value={report} diagrams={mermaidDiagrams} formulas={katexFormulas} />;
```

Solo esas dos entradas nombran los paquetes, así que una app que no las importa nunca los compila.

**Diagramas.** Los bloques ` ```mermaid ` (flujo, secuencia, Gantt, clases, estados, ER, torta…) se
dibujan cuando aparece el primero. Mermaid corre con `securityLevel: "strict"`, etiquetas en SVG puro
y el SVG pasa por DOMPurify sin `foreignObject` ni scripts. Mientras dibuja, el bloque conserva su
lugar; un error de sintaxis se muestra dentro del bloque, con el código debajo. Los diagramas
dibujados quedan en caché por contenido, así que tipear en otro lado no los redibuja, y los nuevos
esperan una pausa en el tipeo. Los colores salen de los tokens (`--gdy-md-diagram-*`) y se redibujan
al cambiar el tema. En un Gantt, el texto de las tareas siempre toma el color del texto, la tarea
activa se tiñe con `--gdy-md-diagram-active` y el eje dice `dd/mm`, salvo que el diagrama defina su
propio `axisFormat`. Un diagrama ancho se achica al panel y se abre a tamaño completo desde su botón.
La herramienta `diagram` abre una ventana con siete plantillas (`DEFAULT_DIAGRAM_TEMPLATES`,
reemplazables con `diagramTemplates`) y vista previa en vivo. Sin `diagrams`, los bloques se ven como
código y la herramienta se oculta.

**Fórmulas.** `$…$` en línea y `$$…$$` en bloque (también en línea), más los bloques ` ```math `, la
misma sintaxis que lee GitHub. Un importe como "$5 y $10" queda como texto: un `$` de cierre no puede
seguir a un espacio ni ir antes de un dígito, y `\$` es un dólar literal. KaTeX y su hoja de estilos
se cargan con la primera fórmula. Una fórmula que no se puede leer queda como TeX, subrayada, con el
mensaje de KaTeX (debajo, si es de bloque). La herramienta `formula` envuelve la selección en `$…$` o
abre un bloque `$$`. Sin `formulas`, los dólares se ven tal cual y la herramienta se oculta.

## Renderizado y seguridad

- CommonMark y GFM: tablas, tachado, listas de tareas, autolinks, notas al pie y avisos de GitHub.
- El HTML crudo está apagado por defecto; `renderOptions.allowHtml` lo deja pasar, siempre
  sanitizado con DOMPurify.
- Los enlaces aceptan `http`, `https`, `mailto`, `tel` y rutas relativas; `javascript:` y `data:`
  (salvo imágenes) quedan inertes. Los externos se abren en otra pestaña con
  `rel="noopener noreferrer"` (`openExternalLinksInNewTab: false` para apagarlo).
- Los títulos tienen ids estables para anclas; `renderOptions.idPrefix` los mantiene únicos cuando
  varios documentos comparten página.
- Las imágenes cargan en diferido y las tablas anchas scrollean dentro de su caja.
- La vista previa renderiza una copia diferida del valor, así tipear sigue fluido en documentos largos.

`renderOptions` también acepta `breaks` y `typographer` (los dos apagados por defecto) y `texts` para
los textos renderizados (títulos de avisos, notas al pie, mensajes de diagramas y fórmulas).

## Peso

Medido con esbuild (minificado, gzip, sin React) sobre el build publicado:

| Qué | Cuándo se descarga | gzip |
|---|---|---|
| `MarkdownViewer` solo (markdown-it, DOMPurify) | Siempre, con el visor | ≈ 65 KB |
| `MarkdownEditor` (suma partes de Radix, barra y ventanas) | Siempre, con el editor | ≈ 120 KB |
| CodeMirror (área de escritura) | Al montarse el área de escritura | ≈ 108 KB |
| Núcleo de highlight.js | Primer bloque de código con lenguaje conocido | ≈ 8 KB |
| Cada lenguaje coloreado | Primer bloque de ese lenguaje | 1–5 KB |
| Catálogo de emoji | Al abrir el selector de emoji | ≈ 5 KB |
| Mermaid | Primer diagrama (solo con `mermaidDiagrams`) | ≈ 170 KB, más 10–50 KB por tipo de diagrama |
| KaTeX y su hoja de estilos | Primera fórmula (solo con `katexFormulas`) | ≈ 75 KB, más las fuentes |

## Teclado y accesibilidad

- El área de escritura es un cuadro de texto con nombre (`texts.sourceLabel`) y la vista previa una
  región con nombre (`texts.previewLabel`).
- La barra es una sola parada de tabulación con flechas entre botones; cada botón tiene nombre y un
  tooltip con su atajo, y los que alternan exponen `aria-pressed`.
- Las ventanas atrapan el foco, se cierran con `Escape` y devuelven el foco.
- Los selectores se recorren con las flechas; cada opción tiene nombre accesible.
- Los avisos y los colores del código cumplen contraste WCAG AA en claro y oscuro (lo verifica un test
  en navegador).

## Celular

Por debajo de 768 px de ancho del editor, la vista dividida muestra un panel por vez: el selector de
vista pasa a las pestañas Editor y Vista previa (sin cambiar `view` ni disparar `onViewChange`), casi
toda la barra se pliega en "⋯" y la página nunca scrollea de costado. Está probado en los tamaños de
iPhone 14 Pro y Pixel 7.

## Estilos

El módulo sigue las reglas de la librería: clases `gdy-md-*`, estados en atributos `data-*`
(`data-view`, `data-fullscreen`, `data-variant`…) y cada valor detrás de un token `--gdy-md-*` con
fallback a un token base, en claro y oscuro. La tabla completa de tokens está en
[theming.es.md](theming.es.md#tokens-del-editor-markdown) y cada clase en
[style-hooks.es.md](style-hooks.es.md#editor-markdown). Las ventanas se renderizan en un portal bajo `<body>`:
declará los tokens que las estilan en `:root` o `.dark`.

```css
.reports-page {
  --gdy-md-editor-height: 40rem;
  --gdy-md-preview-font-family: Georgia, serif;
  --gdy-md-divider: var(--gdy-primary);
  --gdy-md-scrollbar-size: 6px;
}
```

## Textos

Todos los textos vienen en español y se reemplazan con `texts` (editor, barra, ventanas, panel de
búsqueda, índice) y `renderOptions.texts` (lo que renderiza la vista previa). Los objetos parciales se
mezclan con los de por defecto (`DEFAULT_MARKDOWN_EDITOR_TEXTS`, `DEFAULT_MARKDOWN_RENDER_TEXTS`):

```tsx
<MarkdownEditor
  texts={{ placeholder: "Write here…", tools: { bold: "Bold" }, dialogs: { link: { title: "Insert link" } } }}
  renderOptions={{ texts: { alertTitles: { warning: "Careful" } } }}
/>
```

## Referencia

`MarkdownEditor` recibe todas las props de `MarkdownEditorProvider` más `syncScroll`,
`toolbarPlacement` y `className`.

| Prop | Tipo | Por defecto |
|---|---|---|
| `value` / `defaultValue` / `onChange` | `string` / `string` / `(value) => void` | `""` |
| `view` / `defaultView` / `onViewChange` / `views` | ver [Vistas](#vistas-y-scroll-sincronizado) | `"split"` |
| `tools` | `MarkdownToolbarConfig` | `"full"` |
| `renderOptions` | `MarkdownRenderOptions` | — |
| `codeLanguages` | `readonly MarkdownCodeLanguage[]` | `DEFAULT_CODE_LANGUAGES` |
| `limits` | `Partial<MarkdownEditorLimits>` | 20 filas × 10 columnas |
| `onImageUpload` / `acceptedImageTypes` / `maxImageBytes` | ver [Imágenes](#imágenes) | solo URLs |
| `dialogs` | `Partial<MarkdownDialogComponents>` | incluidas |
| `diagrams` / `diagramTemplates` | `MarkdownDiagramRenderer` / plantillas | apagado |
| `formulas` | `MarkdownFormulaRenderer` | apagado |
| `guide` | `false \| MarkdownGuideConfig` | secciones incluidas |
| `showOutline` / `defaultShowOutline` / `onOutlineChange` | panel de índice | cerrado |
| `onFullscreenChange` | `(fullscreen) => void` | — |
| `onEmojiSelect` | `(emoji) => void` | — |
| `locale` / `formatDateTime` | herramienta de fecha | idioma del navegador |
| `texts` | `MarkdownEditorTexts` parcial | español |
| `syncScroll` | `boolean` | `true` |
| `toolbarPlacement` | `"shared" \| "source" \| "none"` | `"shared"` |

Errores: `MissingMarkdownEditorProviderError` (una parte fuera del proveedor),
`UnknownMarkdownToolError` (un id de herramienta desconocido) y `MarkdownSanitizerUnavailableError`
(`renderMarkdown` llamado fuera del navegador: sanitiza con el DOM).

export const FULL_SYNTAX_SAMPLE = `# Informe trimestral

Texto con **negrita**, *cursiva*, ~~tachado~~ y \`código en línea\`. Un enlace externo a
[la especificación CommonMark](https://spec.commonmark.org), uno relativo a [la tabla](/mocks/table),
un correo a [soporte](mailto:soporte@example.com) y un autolink: https://github.com.

## Listas

- Primer punto
- Segundo punto
  - Anidado
1. Paso uno
2. Paso dos

- [x] Tarea hecha
- [ ] Tarea pendiente

## Cita y avisos

> Una cita normal, sin aviso.

> [!NOTE]
> Información útil para el lector.

> [!TIP]
> La operación terminó con éxito.

> [!WARNING]
> Revisá los datos antes de seguir.

> [!CAUTION]
> Esta acción no se puede deshacer.

## Código

\`\`\`ts
const total = items.reduce((sum, item) => sum + item.price, 0);
\`\`\`

## Tabla

| Producto | Cantidad | Precio |
| :--- | :---: | ---: |
| Teclado | 2 | $ 45,00 |
| Monitor con un nombre bastante largo para probar el ajuste | 1 | $ 320,00 |

## Referencias

La guía de estilo[^estilo] y el [manual][manual] explican el resto.

[manual]: https://example.com/manual "Manual de uso"

[^estilo]: Una nota al pie con la fuente.

### Título 3
#### Título 4
##### Título 5
###### Título 6

---

## Seguridad

Un [enlace peligroso](javascript:alert(1)) queda inerte y <script>alert(1)</script> se muestra como texto.

![Logo de Gridory](/favicon.svg "Gridory")
`;

export const SAVED_NOTE_SAMPLE = `## Nota guardada

Este contenido viene de la base de datos de la app y se muestra **sin editor ni barra**, con el mismo
resultado que la vista previa.

> [!TIP]
> Ideal para mostrar descripciones, comentarios o informes ya guardados.

- [x] Mismo renderizado
- [x] Mismo sanitizado
- [ ] Sin cargar el editor
`;

const numberedParagraphs = (prefix: string, count: number): string =>
  Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}: texto para comprobar que los dos paneles muestran el mismo bloque.`).join("\n\n");

export const LONG_DOCUMENT_SAMPLE = `# Documento largo

${numberedParagraphs("Párrafo inicial", 8)}

## Una imagen alta en el medio

![Imagen alta](/demo-tall-image.svg)

${numberedParagraphs("Después de la imagen", 6)}

## Un bloque de código largo

\`\`\`ts
${Array.from({ length: 30 }, (_, index) => `const line${index + 1} = ${index + 1};`).join("\n")}
\`\`\`

${numberedParagraphs("Párrafo final", 10)}
`;

export const DIAGRAMS_SAMPLE = `# Diagramas

Los bloques \`mermaid\` se dibujan solo si la app pasa \`mermaidDiagrams\`.

## Flujo de una compra

\`\`\`mermaid
flowchart LR
  Carrito --> Pago{¿Pago aprobado?}
  Pago -- Sí --> Envío
  Pago -- No --> Reintento --> Pago
\`\`\`

## Plan del proyecto

\`\`\`mermaid
gantt
  title Lanzamiento
  dateFormat YYYY-MM-DD
  section Diseño
    Bocetos        :done, a1, 2026-10-01, 5d
    Revisión       :active, a2, after a1, 3d
  section Desarrollo
    Editor         :b1, after a2, 10d
    Pruebas        :b2, after b1, 4d
\`\`\`

## Saludo entre servicios

\`\`\`mermaid
sequenceDiagram
  App->>API: Pide el pedido
  API-->>App: Devuelve el pedido
\`\`\`

## Un diagrama con un error

\`\`\`mermaid
flowchart LR
  A --> 
\`\`\`
`;

export const FORMULAS_SAMPLE = String.raw`# Fórmulas

La energía es $E = mc^2$ y el área del círculo, $A = \pi r^2$.

Los importes no se confunden: la entrada cuesta $5 y la cena $10.

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

También en un bloque de código con lenguaje math, como en GitHub:

${"```"}math
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
${"```"}

Una fórmula con un error: $\frac{1}{$.
`;

export const CUSTOM_TOKENS_SAMPLE = `# Cuaderno de viaje

Todo este editor cambió de aspecto **solo con tokens** \`--gdy-md-*\`: colores, bordes, tipografía y scrollbar.

> Las rutas más lindas son las que no están en el mapa.

> [!NOTE]
> El aviso toma el color de \`--gdy-md-alert-info\` y un tinte más fuerte.

| Día | Ciudad | Km |
| :--- | :--- | ---: |
| 1 | Cusco | 0 |
| 2 | Ollantaytambo | 72 |
| 3 | Aguas Calientes | 43 |

Visitar [el sitio oficial](https://example.com) antes de salir.
`;

export const SHOWCASE_SAMPLE = `# Guía de lanzamiento de Gridory 2.0

Este documento junta **toda la sintaxis** que el editor sabe mostrar, con *cursiva*, ***negrita y cursiva***,
~~texto tachado~~ y \`código en línea\`.

## 1. Resumen

El lanzamiento sale el **15 de noviembre**. Hay tres equipos involucrados y cada uno tiene su
propia lista de tareas. Los detalles técnicos están en [la documentación del paquete](https://github.com/)
y los diseños en [el tablero de Figma](https://www.figma.com/ "Diseños del lanzamiento").

Un segundo párrafo para ver el espaciado entre párrafos: el texto corrido tiene que respirar sin
quedar separado de más, y el interlineado tiene que ser cómodo en pantallas anchas.

### 1.1 Avisos

> [!NOTE]
> La versión 2.0 mantiene la API pública de la 1.x.

> [!TIP]
> Las migraciones de prueba terminaron con éxito en los tres entornos.

> [!IMPORTANT]
> Cada equipo tiene que confirmar su lista antes del viernes.

> [!WARNING]
> El build tarda el doble si se activan los diagramas en la CI.

> [!CAUTION]
> Borrar la rama de lanzamiento no se puede deshacer.

### 1.2 Cita

> El mejor momento para publicar es cuando el último test pasa y nadie tiene miedo de apretar el botón.
>
> — Equipo de producto

## 2. Calendario

| Hito | Responsable | Fecha | Avance |
| :--- | :--- | :---: | ---: |
| Congelar funcionalidades | Producto | 01/11 | 100 % |
| Pruebas de regresión | Calidad | 05/11 | 80 % |
| Documentación bilingüe | Desarrollo | 10/11 | 65 % |
| Publicación en npm | Desarrollo | 15/11 | 0 % |

\`\`\`mermaid
gantt
  title Plan de lanzamiento
  dateFormat YYYY-MM-DD
  section Producto
    Congelar funcionalidades :done, p1, 2026-10-20, 12d
  section Calidad
    Regresión                :active, q1, after p1, 5d
  section Desarrollo
    Documentación            :d1, after q1, 5d
    Publicación              :d2, after d1, 2d
\`\`\`

## 3. Tareas

1. Preparar el entorno
   - Instalar Node 22
   - Correr \`npm ci\`
2. Ejecutar la CI completa
3. Publicar

- [x] Revisar el contraste en tema claro y oscuro
- [x] Probar en iPhone 14 Pro y Pixel 7
- [ ] Grabar el video del anuncio

## 4. Código

\`\`\`ts
import { MarkdownEditor } from "gridory/markdown-editor";

export const NotesPage = () => <MarkdownEditor defaultValue="# Hola" onChange={saveDraft} />;
\`\`\`

\`\`\`bash
npm run lint && npm run typecheck && npm test
\`\`\`

## 5. Flujo de publicación

\`\`\`mermaid
flowchart LR
  CI[CI en verde] --> Revisión{¿Aprobado?}
  Revisión -- Sí --> npm[Publicar en npm]
  Revisión -- No --> Arreglo[Corregir] --> CI
\`\`\`

## 6. Métricas

El tiempo medio de carga es $t = \\frac{1}{n}\\sum_{i=1}^{n} t_i$ y la meta es bajar un 20 % el peso total:

$$
P_{2.0} = P_{1.x} \\times (1 - 0.20)
$$

Los importes no se confunden con fórmulas: el plan cuesta $5 y el anual $50.

## 7. Referencias

La guía de estilo[^estilo] y el [manual de uso][manual] explican el resto.

[manual]: https://example.com/manual "Manual de uso"

[^estilo]: Una nota al pie con la fuente de la guía.

---

### Niveles de título

#### Título de nivel 4
Texto bajo un título de nivel 4.

##### Título de nivel 5
Texto bajo un título de nivel 5.

###### Título de nivel 6
Texto bajo un título de nivel 6.

![Logo de Gridory](/favicon.svg "Gridory")
`;

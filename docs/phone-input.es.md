# Teléfono con prefijo

[English](phone-input.md) · [Español](phone-input.es.md)

`PhoneInput` une un selector de prefijo por país y un campo de número. No guarda estado de negocio:
emite el código ISO del país y el número, y tu app decide qué hacer con ellos.

## Contenido

- [Import](#import)
- [Ejemplo rápido](#ejemplo-rápido)
- [Valor y prefijo](#valor-y-prefijo)
- [Caracteres admitidos](#caracteres-admitidos)
- [Label, obligatorio y errores](#label-obligatorio-y-errores)
- [Dentro de los formularios de auth](#dentro-de-los-formularios-de-auth)
- [Teclado y accesibilidad](#teclado-y-accesibilidad)
- [Estilos](#estilos)
- [Textos](#textos)
- [Referencia](#referencia)

## Import

```ts
import { PhoneInput } from "gridory/phone-input";
```

Importa `gridory/styles.css` una vez en tu app, antes de cualquier override (ver
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
const [phone, setPhone] = useState<PhoneInputValue>({ country: "PE", number: "" });

<PhoneInput value={phone} onValueChange={setPhone} required placeholder="999 111 222" />
```

## Valor y prefijo

El valor es `{ country, number }`. `country` es el código ISO 3166-1 alfa-2 en mayúsculas, o `null`
mientras no haya uno elegido; el prefijo se deriva de él. Canadá y EE. UU. comparten `+1`, pero son
`"CA"` y `"US"`, así que el valor nunca los confunde.

| Modo | Props |
|---|---|
| Controlado | `value` y `onValueChange`. El campo muestra `value` hasta que tu app lo cambie. |
| No controlado | `defaultValue`, o `defaultCountry` para arrancar en un país con el número vacío. |

No hay país por defecto: el prefijo muestra "País" hasta que se elija uno. `onValueChange` se dispara
con un objeto nuevo cuando cambian el país o el número, nunca con el objeto que recibió. Elegir el
país ya elegido solo cierra la lista.

```tsx
<PhoneInput defaultCountry="UY" onValueChange={(value) => save(value)} />
```

La lista muestra todos los países con prefijo, con su bandera, y busca por nombre, código ISO y
prefijo, sin importar tildes: "peru", "PE", "51" y "+51" encuentran Perú. El prefijo coincide desde
el principio, así que "51" nunca encuentra Portugal (+351). Al reabrir, el país elegido está marcado
y a la vista.

## Caracteres admitidos

El número es un `<input type="tel">` con `inputMode="tel"` y `autoComplete="tel-national"`: el país va
en el prefijo, así que el navegador sugiere el número nacional. Solo guarda dígitos, espacios,
guiones y `+`. Las letras, con o sin tilde, los demás símbolos y los emoji se descartan al escribir y
al pegar: pegar `abc 999-111` deja ` 999-111`. Un cambio hecho solo de caracteres descartados no emite
nada.

El campo no valida el largo ni el formato del número, que cambian de un país a otro: ese control es
de tu app.

## Label, obligatorio y errores

| Prop | Efecto |
|---|---|
| `label` | Label visible. "Teléfono" por defecto. |
| `aria-label` / `aria-labelledby` | Nombra el número sin label visible. |
| `labelPosition` | `"top"` (por defecto) o `"start"`, al costado del campo. |
| `required` | Suma el "*" y `aria-required` al número. |
| `error` | Tu error, debajo del campo. Pone `aria-invalid` y pinta el borde. |

El campo nunca muestra un error propio: `required` lo marca, y tu app decide cuándo está mal y pasa
`error`.

```tsx
<PhoneInput labelPosition="start" required error={isInvalid ? "Ingresa un teléfono válido" : undefined} />
```

## Dentro de los formularios de auth

Un campo `tel` de `LoginForm` o `SignUpForm` usa este mismo control, con el label, el error y los
tokens de input del formulario, y emite `{ country, number }`. Ver
[auth-forms.es.md](auth-forms.es.md#campos-adicionales).

## Teclado y accesibilidad

El prefijo es un `<button role="combobox">` con el nombre del país elegido, "Prefijo: Canadá +1",
porque el prefijo solo no distingue países. Abre un diálogo con un buscador y la lista, según el
[patrón combobox de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). El número lleva
el label, `aria-required`, `aria-invalid` y el error como descripción.

| Tecla | Acción |
|---|---|
| Tab / Shift+Tab | Pasa del prefijo al número y vuelve. |
| Enter o Espacio, en el prefijo | Abre la lista y lleva el foco al buscador. |
| Escribir | Filtra la lista. La primera coincidencia queda activa. |
| ↓ / ↑, Inicio / Fin | Recorren las opciones. |
| Enter | Elige el país activo, cierra la lista y devuelve el foco al prefijo. |
| Escape | Cierra la lista y devuelve el foco al prefijo. |

## Estilos

Los tokens y los temas claro y oscuro están en [theming.es.md](theming.es.md), y cada gancho,
selector de estado y token está en [style-hooks.es.md](style-hooks.es.md#teléfono-con-prefijo). El
campo es una sola pieza: la caja dibuja el borde, el fondo y el foco, y el prefijo y el número ocupan
todo su alto, sin línea ni fondo entre ellos: solo el espacio y la flecha. El foco es un anillo
interior sobre toda la caja y el borde nunca cambia de grosor, así que enfocar una parte no mueve
nada. El número se achica con la caja y nunca se sale del borde.

| Parte | Gancho | Clave de `classNames` |
|---|---|---|
| Marco que fija el ancho | `gdy-phone-input-frame` | — |
| Caja del campo (la raíz, ancla de la lista) | `gdy-phone-input` | `root` |
| Prefijo (`<button role="combobox">`) | `gdy-phone-input-prefix` | `prefix` |
| Prefijo o placeholder | `gdy-phone-input-dial-code` | — |
| Flecha | `gdy-phone-input-chevron` | — |
| Número (`<input type="tel">`) | `gdy-phone-input-number` | `number` |
| Panel flotante (`role="dialog"`) | `gdy-phone-input-panel` | `panel` |

`className` va en la raíz, junto a `classNames.root`. El resto sale de ganchos compartidos: el label,
el "*" y el error son `gdy-field-label`, `gdy-field-required` y `gdy-field-error`; las banderas,
`gdy-country-flag`; y la lista, `gdy-listbox-*`.

| Elemento | Atributo de estado | Valores |
|---|---|---|
| `gdy-phone-input` | `data-invalid` | presente con un error |
| `gdy-phone-input-prefix` | `aria-expanded` | `"true"` mientras la lista está abierta |
| `gdy-phone-input-dial-code` | `data-placeholder` | presente mientras no hay país elegido |

| Token | Por defecto | Uso |
|---|---|---|
| `--gdy-phone-input-width` | `280px` | Ancho del campo. Lo escribe la prop `width`. |
| `--gdy-phone-input-height` | `--gdy-field-control-height` (40px) | Alto de la caja. |
| `--gdy-phone-input-gap` | `8px` | Espacio entre el prefijo y el número. |
| `--gdy-phone-input-border` | `--gdy-input` | Borde de la caja. |
| `--gdy-phone-input-radius` | `--gdy-radius` | Radio de la caja. |
| `--gdy-phone-input-bg` / `--gdy-phone-input-color` | `--gdy-background` / `--gdy-foreground` | Fondo y texto de la caja. |
| `--gdy-phone-input-focus-ring` | `--gdy-ring` | Borde y anillo interior con foco. |
| `--gdy-phone-input-error-color` | `--gdy-destructive` | Borde con error. |
| `--gdy-phone-input-placeholder-color` | `--gdy-muted-foreground` | "País", la flecha y el placeholder del número. |
| `--gdy-phone-input-prefix-focus-color` | `--gdy-ring` | Texto del prefijo con el foco del teclado. |
| `--gdy-phone-input-panel-min-width` | `280px` | Ancho mínimo de la lista; nunca es más angosta que el campo. |
| `--gdy-phone-input-option-hover-bg` / `--gdy-phone-input-option-hover-color` | tokens de la lista | Opción activa. |
| `--gdy-phone-input-option-selected-bg`, `--gdy-phone-input-check-color` | tokens de la lista | Opción elegida y su check. |

```tsx
<div style={{ "--gdy-phone-input-height": "48px", "--gdy-phone-input-radius": "9999px" } as CSSProperties}>
  <PhoneInput label="Celular" />
</div>
```

## Textos

Todos se reemplazan con `texts`; `{country}` se completa en tiempo de ejecución.

| Clave | Por defecto | Dónde |
|---|---|---|
| `countryPlaceholder` | `"País"` | Prefijo sin país. |
| `prefixButton` | `"Prefijo: {country}"` | Nombre del prefijo; `{country}` es el país y su prefijo, o el placeholder. |
| `prefixList` | `"Prefijos por país"` | Nombre del panel y de la lista. |
| `searchLabel` | `"Buscar prefijo"` | Nombre del buscador. |
| `searchPlaceholder` | `"Buscar país o prefijo..."` | Placeholder del buscador. |
| `noResults` | `"No se encontró el país"` | Búsqueda sin resultados. |

El label es la prop `label`, "Teléfono" por defecto.

## Referencia

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | `PhoneInputValue` | — | Valor, controlado. |
| `defaultValue` | `PhoneInputValue` | — | Valor inicial, no controlado. |
| `defaultCountry` | `CountryCode` | ninguno | País de un campo no controlado sin `defaultValue`. |
| `onValueChange` | `(value: PhoneInputValue) => void` | — | Cambió el país o el número. |
| `label` | `ReactNode` | `"Teléfono"` | Label visible. |
| `aria-label` / `aria-labelledby` | `string` | — | Nombre sin label visible. Cada uno excluye a los otros. |
| `labelPosition` | `"top" \| "start"` | `"top"` | Label arriba o al costado. |
| `required` | `boolean` | `false` | "*" y `aria-required`. |
| `error` | `ReactNode` | — | Tu error, debajo del campo. |
| `placeholder` | `string` | — | Placeholder del número. |
| `width` | `number \| string` | `--gdy-phone-input-width` (280px) | Ancho del campo; un número son píxeles. Nunca más ancho que el contenedor. |
| `locale` | `string` | `"es"` | Idioma de los nombres de países y su orden. |
| `showFlags` | `boolean` | `true` | Banderas en el prefijo y en la lista. |
| `flagUrl` | `FlagUrlResolver` | flagcdn.com | Arma la URL de cada bandera. |
| `thinScrollbars` | `boolean` | `true` | Scrollbar fina en la lista. |
| `scrollbarColor` | `string` | — | Color de la scrollbar; si falta, `--gdy-scrollbar-thumb`. |
| `texts` | `Partial<PhoneInputTexts>` | `DEFAULT_PHONE_INPUT_TEXTS` | Reemplaza los textos. |
| `className` | `string` | — | Tu clase en la raíz. |
| `classNames` | `PhoneInputClassNames` | — | Tu clase en cada parte. |

### Tipos

- `PhoneInputValue`: `{ country: CountryCode | null; number: string }`.
- `PhoneInputProps`: `PhoneInputNaming` combinado con `PhoneInputSettings` y `labelPosition`,
  `required` y `error`.
- `PhoneInputSettings`: las props de valor, prefijo, lista y estilo.
- `PhoneInputNaming`: exactamente uno de `label`, `aria-label` o `aria-labelledby` (o ninguno, para el
  label por defecto).
- `PhoneInputTexts`: las claves de [Textos](#textos), cada una un `string`.
- `PhoneInputClassNames`: `{ root?; prefix?; number?; panel? }`, cada una un `string`.
- `CountryCode` y `FlagUrlResolver`: los mismos tipos del selector de país.

### Valores

- `DEFAULT_PHONE_INPUT_TEXTS`: los textos por defecto.
- `DEFAULT_PHONE_INPUT_LABEL`: `"Teléfono"`.

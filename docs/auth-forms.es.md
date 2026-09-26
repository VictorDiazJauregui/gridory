# Formularios de autenticación

[English](auth-forms.md) · [Español](auth-forms.es.md)

`LoginForm` y `SignUpForm` muestran un formulario de inicio de sesión y uno de creación de cuenta,
con tema claro y oscuro. Los dos validan en el cliente y llevan el foco al primer campo inválido.
Nunca llaman a un backend ni a Google: enviar, seguir un enlace o tocar el botón de Google se emite
como un callback, y tu app decide qué pasa después.

## Import

```ts
import { LoginForm, SignUpForm } from "gridory/auth";
```

Importa `gridory/styles.css` una vez en tu app, antes de cualquier override (ver
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
import { useState } from "react";
import { LoginForm, type LoginFormValues } from "gridory/auth";

export const LoginPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const signIn = async (values: LoginFormValues) => {
    setSubmitting(true);
    const response = await fetch("/api/login", { method: "POST", body: JSON.stringify(values) });
    setSubmitting(false);
    if (!response.ok) setError("Email o contraseña incorrectos");
  };
  return (
    <LoginForm
      onSubmit={signIn}
      submitting={submitting}
      error={error}
      forgotPassword={{ href: "/recuperar" }}
      signUpLink={{ href: "/registro" }}
      google={{ onClick: () => startGoogleFlow() }}
    />
  );
};
```

```tsx
<SignUpForm
  onSubmit={(values) => createAccount(values)}
  passwordRules={{ minLength: 8, uppercase: true, number: true, symbol: true }}
  extraFields={[
    { name: "phone", label: "Teléfono", type: "tel" },
    { name: "terms", label: "Acepto los términos", type: "checkbox", required: true },
  ]}
  signInLink={{ href: "/login" }}
/>
```

## Cómo funciona

- **Cuándo valida.** Un campo se revisa cuando pierde el foco después de que el usuario lo editó, y
  todos se revisan al enviar. Mientras se escribe, solo se vuelve a revisar el campo que ya muestra
  un error, así el mensaje desaparece apenas se corrige. El formulario nunca marca un campo en medio
  de una edición, ni uno por el que solo se pasó con Tab.
- **Ningún clic se pierde.** Presionar con el mouse el botón de envío, un enlace o el botón de Google
  no le quita el foco al campo que se está editando. Si no, su error podría aparecer al perder el
  foco, empujar el botón hacia abajo antes de soltar el mouse, y el clic caería en otro lado.
- **Envío.** Si hay errores, `onSubmit` no se llama: aparecen todos los mensajes y el foco va al
  primer campo inválido en el orden visual, centrado en la pantalla. La validación nunca deshabilita
  el botón de envío; solo lo deshabilita `submitting` en `true`.
- **Valores.** `onSubmit` recibe valores validados y normalizados en un objeto plano:
  `{ email, password, ...extras }`. El texto llega sin espacios en los extremos, el email en
  minúsculas y las contraseñas intactas, espacios incluidos. Los checkboxes son booleanos.
- **Tus datos siguen siendo tuyos.** El formulario guarda su propio borrador. Los valores iniciales
  salen de `defaultValues` y `onValuesChange` informa cada edición. Para cargar valores nuevos
  después de montarlo (por ejemplo, tras un inicio de sesión con Google), vuelve a montarlo con otra
  `key`.

## Campos

### Campos base

| Formulario | Campo (`name`) | Tipo | Obligatorio | `autoComplete` |
|---|---|---|---|---|
| Login | `email` | email | Siempre | `email` |
| Login | `password` | password | Siempre | `current-password` |
| Registro | `firstName` | text | No, salvo `required: true` | `given-name` |
| Registro | `lastName` | text | No, salvo `required: true` | `family-name` |
| Registro | `email` | email | Siempre | `email` |
| Registro | `password` | password | Siempre | `new-password` |
| Registro | `confirmPassword` | password | Siempre, mientras se muestra | `new-password` |

Cualquiera se cambia con `fields`. `false` oculta los opcionales (`firstName`, `lastName`,
`confirmPassword`):

```tsx
<SignUpForm
  fields={{
    firstName: { label: "Nombre", placeholder: "Tu nombre", required: true },
    lastName: false,
    email: { label: "Email de trabajo" },
    confirmPassword: { label: "Repite la contraseña", requiredMessage: "Repite tu contraseña" },
  }}
  onSubmit={createAccount}
/>
```

| Clave de `AuthFieldConfig` | Tipo | Descripción |
|---|---|---|
| `label` | `ReactNode` | Etiqueta visible. |
| `placeholder` | `string` | Placeholder del control. |
| `required` | `boolean` | Solo la respetan los campos de nombre: email y contraseña son siempre obligatorios. |
| `requiredMessage` | `string` | Mensaje cuando el campo está vacío. |
| `validate` | `(value, values) => string \| undefined` | Chequeo extra, después de las reglas propias. |

Nombre y apellido comparten fila cuando están uno al lado del otro y el formulario mide al menos
360 px por dentro de su padding. Si es más angosto, se apilan.

### Campos adicionales

`extraFields` agrega tus propios campos después de los campos base. Cada campo tiene un `name`, que
es su clave en los valores enviados, y un `label`:

```tsx
extraFields={[
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "teamSize", label: "Tamaño del equipo", type: "number" },
  {
    name: "role",
    label: "Rol",
    type: "select",
    required: true,
    placeholder: "Elige tu rol",
    options: [{ value: "dev", label: "Desarrollo" }, { value: "design", label: "Diseño" }],
  },
  { name: "about", label: "Sobre ti", type: "textarea" },
  { name: "terms", label: <>Acepto los <a href="/terminos">términos</a></>, type: "checkbox", required: true },
]}
```

| `type` | Control | Valor | Mensaje de obligatorio |
|---|---|---|---|
| `"text"` (por defecto), `"tel"`, `"url"`, `"number"` | `<input>` de ese tipo | `string` | Derivado del label |
| `"email"` | `<input type="email">`, validado como email | `string` | Derivado del label |
| `"textarea"` | `<textarea>` | `string` | Derivado del label |
| `"select"` | El select de Gridory, con `options` | `string` (el `value` de la opción) | `texts.selectRequired` |
| `"checkbox"` | Checkbox nativo, con el label a la derecha | `boolean` | `texts.checkboxRequired` |

`AuthExtraField` también acepta `required`, `placeholder`, `requiredMessage`, `autoComplete` y
`validate`. Un `name` repetido, o igual al de un campo base, lanza `DuplicateAuthFieldError`.

### Orden de los campos

Por defecto los campos adicionales van al final. `fieldOrder` lista los nombres que van primero, en
ese orden. Los campos que no menciona conservan su orden después de ellos:

```tsx
fieldOrder={["firstName", "lastName", "email", "phone", "password", "confirmPassword"]}
```

Un nombre que no corresponde a ningún campo lanza `UnknownAuthFieldError`. Un campo base oculto
(`lastName: false`) puede quedar en la lista.

## Validación

### Campos obligatorios y mensajes

Los campos obligatorios muestran un asterisco rojo después del label y llevan `aria-required`. Un
campo obligatorio vacío muestra `texts.requiredMessage` con `{label}` reemplazado por su label, en
minúscula salvo que parezca una sigla: "Email" da "Ingresa tu email" y "DNI" da "Ingresa tu DNI".
Cuando el label no es un texto simple, se usa `texts.requiredFallback`.

La plantilla funciona con labels en singular. Para un label en plural o con género ("Nombres"),
pasa `requiredMessage` en el campo.

### Email y contraseñas

- Todo campo `email` debe tener la forma `nombre@dominio.tld`.
- `confirmPassword` debe ser igual a `password` (`texts.passwordMismatch`).
- `passwordRules` (solo en el registro) agrega requisitos a la contraseña y los muestra como una
  lista en vivo debajo del campo. El login solo exige que la contraseña no esté vacía, así pueden
  entrar los usuarios cuya contraseña se creó con reglas anteriores.

| Clave de `AuthPasswordRules` | Requisito | Texto por defecto |
|---|---|---|
| `minLength` | Al menos N caracteres (se cuentan puntos de código Unicode, así un emoji vale uno). | `"Al menos {count} caracteres"` |
| `maxLength` | Como máximo N caracteres. | `"Como máximo {count} caracteres"` |
| `uppercase` / `lowercase` | Una letra mayúscula / minúscula. La Ñ y las letras con tilde cuentan. | `"Una letra mayúscula"` / `"Una letra minúscula"` |
| `number` | Un dígito. | `"Un número"` |
| `symbol` | Cualquier cosa que no sea letra, dígito ni espacio. | `"Un carácter especial"` |
| `patterns` | `{ pattern: RegExp, label: string }[]`, un requisito por cada uno. | Su `label` |

Cada ítem de la lista tiene `data-status`:

- `"pending"`: la contraseña está vacía y todavía no se intentó enviar.
- `"met"`: el requisito se cumple.
- `"unmet"`: el usuario escribió, o intentó enviar, y el requisito no se cumple.

El ícono cambia con el estado, así la lista no depende solo del color. Si falta algún requisito, el
envío se bloquea con `texts.passwordRequirements`.

### Tus propios chequeos y zod

`validate` en cualquier campo corre después de las reglas propias. Para un chequeo de todo el
formulario, `schema` acepta cualquier validador que cumpla [Standard Schema](https://standardschema.dev),
como zod 3.24 o posterior, valibot o arktype, sin agregarle dependencias a Gridory:

```tsx
import { z } from "zod";

const schema = z
  .object({ email: z.string(), password: z.string(), confirmPassword: z.string() })
  .refine((values) => !values.email.endsWith("@competencia.com"), {
    path: ["email"],
    message: "Usa tu email de trabajo",
  });

<SignUpForm schema={schema} onSubmit={createAccount} />;
```

El esquema corre al enviar, después de que pasan las reglas propias, y recibe todos los valores,
`confirmPassword` incluido. Cada problema se muestra debajo del campo que nombra el primer segmento
de su `path`, y uno sin `path` se muestra arriba del botón de envío. Editar un campo limpia su
mensaje del esquema hasta el próximo envío. Los esquemas asíncronos se esperan.

### Errores de tu servidor

| Prop | Muestra |
|---|---|
| `fieldErrors` | `{ [name]: mensaje }` debajo de cada campo, por ejemplo `{ email: "Ese email ya está registrado" }`. El mensaje se oculta cuando se edita su campo y vuelve cuando pasas un objeto nuevo. |
| `error` | Un mensaje arriba del botón de envío, con `role="alert"`. |
| `submitting` | Deshabilita el botón de envío y el de Google, y muestra `texts.submitting` con un spinner. |

## Enlaces y Google

Cada parte opcional aparece solo si la configuras.

| Prop | Formulario | Muestra |
|---|---|---|
| `forgotPassword` | Login | "¿Olvidaste tu contraseña?" debajo de la contraseña, alineado a la derecha. |
| `signUpLink` | Login | "¿No tienes cuenta? Regístrate aquí" al final. |
| `signInLink` | Registro | "¿Ya tienes una cuenta? Inicia sesión" al final. |
| `google` | Los dos | El separador "o" y el botón "Continuar con Google". |

Un enlace se configura con `{ href?, onClick? }`:

- Con `href` se muestra un `<a>`. Funciona el clic medio y el lector de pantalla lo anuncia como
  enlace.
- Sin `href` se muestra un `<button>`.
- `onClick` recibe `{ event }`, así puedes llamar a `event.preventDefault()` y navegar con tu
  router.
- `forgotPassword.onClick` además recibe el `email` escrito, por ejemplo para abrir la recuperación
  con el email ya cargado.

`google` acepta `onClick`, `disabled` y `render`. El botón lleva el logo de Google y nunca carga el
script de Google. Si tu flujo necesita el token de identidad (`credential`), que solo entrega el
botón oficial de Google, usa `render` para montar ese botón oficial invisible encima de este. La cara
visible conserva su diseño y su hover, y queda oculta para las tecnologías de asistencia:

```tsx
import { GoogleLogin } from "@react-oauth/google";

<LoginForm
  google={{
    render: () => <GoogleLogin onSuccess={({ credential }) => signInWithGoogle(credential)} width={400} />,
  }}
  onSubmit={signIn}
/>;
```

El botón de Google mide como máximo 400 px. Si tu formulario es más ancho, el borde derecho de la
cara no responde al clic.

## Eventos

| Callback | Firma | Se dispara |
|---|---|---|
| `onSubmit` | `(values: LoginFormValues \| SignUpFormValues) => void` | Al enviar, solo si pasan todas las reglas y el `schema`. |
| `onValuesChange` | `(values: AuthFormValues) => void` | En cada edición, con todos los valores actuales. |
| `forgotPassword.onClick` | `({ event, email }) => void` | Al tocar "¿Olvidaste tu contraseña?". |
| `signUpLink.onClick` / `signInLink.onClick` | `({ event }) => void` | Al tocar el enlace del pie. |
| `google.onClick` | `(event) => void` | Al tocar el botón de Google (no se llama si usas `render`). |

## Textos

Los textos de la UI vienen en español y todos se pueden reemplazar con `texts`. Los valores por
defecto se exportan como `DEFAULT_LOGIN_TEXTS` y `DEFAULT_SIGN_UP_TEXTS`, y los campos base como
`DEFAULT_LOGIN_FIELDS` y `DEFAULT_SIGN_UP_FIELDS`.

| Clave | Login | Registro | Uso |
|---|---|---|---|
| `title` | `"Iniciar sesión"` | `"Crea tu cuenta"` | Título. |
| `subtitle` | no tiene | no tiene | Línea opcional debajo del título. |
| `submit` | `"Iniciar sesión"` | `"Siguiente"` | Botón de envío. |
| `submitting` | `"Iniciando sesión..."` | `"Validando..."` | Botón de envío mientras `submitting`. |
| `google` | `"Continuar con Google"` | igual | Botón de Google. |
| `divider` | `"o"` | igual | Separador sobre el botón de Google. |
| `showPassword` / `hidePassword` | `"Mostrar contraseña"` / `"Ocultar contraseña"` | igual | Nombre y tooltip del ojo. |
| `requiredMessage` | `"Ingresa tu {label}"` | igual | Campo obligatorio vacío. |
| `requiredFallback` | `"Este campo es obligatorio"` | igual | Lo mismo, cuando el label no es texto. |
| `invalidEmail` | `"Ingresa un email válido"` | igual | Email mal formado. |
| `checkboxRequired` | `"Debes marcar esta casilla para continuar"` | igual | Checkbox obligatorio sin marcar. |
| `selectRequired` | `"Selecciona una opción"` | igual | Select obligatorio vacío. |
| `forgotPassword` | `"¿Olvidaste tu contraseña?"` | — | Enlace de recuperación. |
| `signUpPrompt` / `signUpLink` | `"¿No tienes cuenta?"` / `"Regístrate aquí"` | — | Pie del login. |
| `signInPrompt` / `signInLink` | — | `"¿Ya tienes una cuenta?"` / `"Inicia sesión"` | Pie del registro. |
| `passwordMismatch` | — | `"Las contraseñas no coinciden"` | Confirmación distinta. |
| `passwordRequirements` | — | `"La contraseña no cumple todos los requisitos"` | Contraseña débil al enviar. |
| `passwordRulesTitle` | — | `"La contraseña debe tener:"` | Título de la lista de requisitos. |
| `ruleMinLength`, `ruleMaxLength` | — | `"Al menos {count} caracteres"`, `"Como máximo {count} caracteres"` | Requisitos de largo. |
| `ruleUppercase`, `ruleLowercase`, `ruleNumber`, `ruleSymbol` | — | Ver [Email y contraseñas](#email-y-contraseñas) | Requisitos de caracteres. |
| `ruleMet` / `ruleUnmet` | — | `"Cumplido"` / `"Pendiente"` | Nombre accesible del ícono de cada requisito. |

El ojo conserva `showPassword` como nombre accesible y anuncia su estado con `aria-pressed`.
`hidePassword` es el tooltip mientras la contraseña está visible.

## Layout

- **Ancho.** La tarjeta mide 448 px por defecto y nunca es más ancha que su contenedor, así entra
  en un teléfono. `width` acepta un número de píxeles o cualquier medida CSS (`width={400}`,
  `width="32rem"`). El alto lo da el contenido.
- **Centrado.** La tarjeta se centra sola en horizontal. Centrarla en vertical le corresponde a tu
  página. Ocupa el espacio que deja tu encabezado en lugar de usar `100vh`, que genera un scroll
  debajo de una barra de navegación:

  ```css
  .auth-page { flex: 1; display: grid; place-items: center; padding: 24px 16px; }
  ```

- **Título.** Se renderiza como `h1`; `titleAs` lo cambia a `h2`, `h3` o `h4`.
- **Pantallas táctiles.** En dispositivos con puntero grueso (`pointer: coarse`), los inputs y el
  select usan texto de 16 px, así iOS no hace zoom al enfocar un campo, y el botón del ojo crece a
  36 × 36 px. Los colores de hover solo se aplican donde el puntero puede pasar por encima
  (`hover: hover`), para que no queden pegados al último botón tocado en un celular.

## Estilos

Los tokens y el tema claro/oscuro están en [theming.es.md](theming.es.md), y cada gancho, selector
de estado y token figura en [style-hooks.es.md](style-hooks.es.md). Los formularios siguen el tema
que pones en `<html>` (`.dark` o `data-theme="dark"`), y las partes nativas, como el checkbox,
también.

| Zona | Ganchos |
|---|---|
| Tarjeta | `gdy-auth` (raíz, con `data-form="login"` o `"signup"`), `gdy-auth-header`, `gdy-auth-title`, `gdy-auth-subtitle` |
| Formulario | `gdy-auth-form`, `gdy-auth-fields`, `gdy-auth-name-row`, `gdy-auth-field`, `gdy-auth-label`, `gdy-auth-required` |
| Controles | `gdy-auth-input`, `gdy-auth-textarea`, `gdy-auth-select`, `gdy-auth-checkbox`, `gdy-auth-checkbox-input`, `gdy-auth-checkbox-label` |
| Contraseña | `gdy-auth-password`, `gdy-auth-password-toggle`, `gdy-auth-password-icon`, `gdy-auth-addon`, `gdy-auth-forgot`, `gdy-auth-rules`, `gdy-auth-rules-title`, `gdy-auth-rules-list`, `gdy-auth-rule`, `gdy-auth-rule-icon` |
| Mensajes | `gdy-auth-error`, `gdy-auth-alert` |
| Acciones | `gdy-auth-submit`, `gdy-auth-spinner`, `gdy-auth-divider`, `gdy-auth-google-slot`, `gdy-auth-google`, `gdy-auth-google-logo`, `gdy-auth-google-overlay`, `gdy-auth-link`, `gdy-auth-footer` |

| Elemento | Atributo de estado | Valores |
|---|---|---|
| `gdy-auth` | `data-form` | `"login"`, `"signup"` |
| Controles | `aria-invalid`, `aria-required` | Presentes en un campo inválido u obligatorio. |
| `gdy-auth-rule` | `data-status` | `"pending"`, `"met"`, `"unmet"` |
| `gdy-auth-google-slot` | `data-disabled` | Presente mientras el botón de Google está deshabilitado. |
| `gdy-auth-password-toggle` | `aria-pressed` | `"true"` mientras la contraseña se ve. |

Ningún control pinta por fuera de su caja: al recibir el foco, los inputs, el select y los botones
cambian su borde y suman un anillo hacia adentro en `--gdy-auth-input-focus-border`.

La librería no define los tokens de componente: cada uno se lee con un fallback, así que defines
solo los que necesitas. Ponlos en `:root` para el tema claro y en `.dark` para el oscuro:

```css
:root {
  --gdy-auth-submit-bg: #1d4ed8;
  --gdy-auth-submit-hover-bg: #1a44c2;
  --gdy-auth-google-hover-bg: #eff6ff;
  --gdy-auth-input-focus-border: #1d4ed8;
}
.dark {
  --gdy-auth-submit-bg: #3b82f6;
  --gdy-auth-google-hover-bg: #1e293b;
  --gdy-auth-input-focus-border: #60a5fa;
}
```

| Token | Fallback | Lo usa |
|---|---|---|
| `--gdy-auth-width` | `448px` | Ancho de la tarjeta (la prop `width` lo fija en línea). |
| `--gdy-auth-padding` | `24px` | Padding de la tarjeta. |
| `--gdy-auth-bg`, `--gdy-auth-fg` | `--gdy-card`, `--gdy-card-foreground` | Fondo y texto de la tarjeta. |
| `--gdy-auth-border`, `--gdy-auth-radius`, `--gdy-auth-shadow` | `--gdy-border`, `--gdy-radius` + 2px, `--gdy-shadow-sm` | Marco de la tarjeta. |
| `--gdy-auth-gap` | `16px` | Espacio entre los bloques de la tarjeta. |
| `--gdy-auth-field-gap` | `14px` | Espacio entre campos. |
| `--gdy-auth-label-gap` | `6px` | Del label al control. |
| `--gdy-auth-header-gap` | `4px` | Espacio extra debajo del título. |
| `--gdy-auth-divider-gap` | `12px` | Espacio arriba y abajo del separador. |
| `--gdy-auth-title`, `--gdy-auth-label`, `--gdy-auth-muted` | heredado, heredado, `--gdy-muted-foreground` | Título, labels, texto secundario. |
| `--gdy-auth-input-height`, `--gdy-auth-input-radius` | `40px`, `--gdy-radius` | Inputs y select. |
| `--gdy-auth-input-bg`, `--gdy-auth-input-fg`, `--gdy-auth-input-border` | `--gdy-background`, `--gdy-foreground`, `--gdy-input` | Inputs y select. |
| `--gdy-auth-input-focus-border` | `--gdy-ring` | Borde y anillo interior de foco de todos los controles. |
| `--gdy-auth-error` | `--gdy-destructive` | Errores de campo, bordes inválidos, el aviso. |
| `--gdy-auth-required` | `--gdy-destructive` | Asterisco de los obligatorios. |
| `--gdy-auth-checkbox` | `--gdy-primary` | Relleno del checkbox. |
| `--gdy-auth-rule-pending`, `--gdy-auth-rule-met`, `--gdy-auth-rule-unmet` | `--gdy-muted-foreground`, `--gdy-success`, `--gdy-destructive` | Requisitos de la contraseña. |
| `--gdy-auth-button-height`, `--gdy-auth-button-radius` | `40px`, `--gdy-radius` | Botones de envío y de Google. |
| `--gdy-auth-submit-bg`, `--gdy-auth-submit-fg` | `--gdy-primary`, `--gdy-primary-foreground` | Botón de envío. |
| `--gdy-auth-submit-hover-bg` | `--gdy-auth-submit-bg` al 85% | Botón de envío con el mouse encima. |
| `--gdy-auth-submit-focus` | `--gdy-ring` | Anillo interior del botón de envío. |
| `--gdy-auth-google-bg`, `--gdy-auth-google-fg`, `--gdy-auth-google-border` | `--gdy-background`, `--gdy-foreground`, `--gdy-border` | Botón de Google. |
| `--gdy-auth-google-hover-bg`, `--gdy-auth-google-hover-fg`, `--gdy-auth-google-hover-border` | `--gdy-muted`, `--gdy-foreground`, `--gdy-ring` | Botón de Google con el mouse encima. |
| `--gdy-auth-divider` | `--gdy-border` | Líneas del separador. |
| `--gdy-auth-link` | `--gdy-link` | Enlaces. |

El separador dibuja dos líneas alrededor de la "o" en lugar de tapar una línea con un fondo, así
nada tiene que coincidir con el color de la tarjeta en ninguno de los dos temas. Los cuatro colores
del logo de Google son tokens base (`--gdy-google-*`) solo porque las hojas de estilo no aceptan
colores literales. Las guías de marca de Google prohíben recolorear el logo, así que déjalos como
están.

Las reglas de la librería pesan una clase. Los botones de envío, de Google y del ojo se apoyan en el
`gdy-button` compartido y usan dos clases (`.gdy-button.gdy-auth-submit`), y el select usa
`.gdy-select-trigger.gdy-auth-select`; iguala ese peso para sobrescribirlos. `className` va en la
raíz y `classNames` agrega tus clases a cada parte:

| Slot de `classNames` | Elemento |
|---|---|
| `root` | La tarjeta. |
| `title`, `subtitle` | Título y subtítulo. |
| `form` | El `<form>`. |
| `field`, `label`, `input`, `error` | Cada contenedor de campo, label, control y mensaje de error. |
| `alert` | El mensaje de `error`. |
| `submit`, `google`, `divider` | Botones y separador. |
| `footer`, `link` | Párrafo del pie y cada enlace. |
| `passwordRules` | La lista de requisitos. |

## Accesibilidad

- Cada control tiene su `<label>` y apunta a su error y, en la contraseña, a la lista de requisitos
  mediante `aria-describedby`.
- Los campos inválidos y obligatorios llevan `aria-invalid` y `aria-required`. El asterisco queda
  oculto para los lectores de pantalla porque `aria-required` ya lo dice.
- El formulario usa `noValidate`: los mensajes los pone el formulario, no los globos del navegador.
- El ojo se alcanza con el teclado, y tocarlo no le quita el foco al campo de contraseña.

## Referencia

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `onSubmit` | `(values) => void` | obligatoria | Valores validados y normalizados. |
| `onValuesChange` | `(values: AuthFormValues) => void` | — | Cada edición. |
| `defaultValues` | `AuthFormValues` | — | Valores iniciales por nombre de campo. |
| `fields` | `LoginFieldsConfig` / `SignUpFieldsConfig` | — | Cambios a los campos base. |
| `extraFields` | `AuthExtraField[]` | — | Tus propios campos. |
| `fieldOrder` | `string[]` | — | Nombres que van primero, en orden. |
| `schema` | `AuthStandardSchema` | — | Validador de todo el formulario (zod, valibot…). |
| `passwordRules` | `AuthPasswordRules` | — | Solo registro: requisitos de la contraseña. |
| `submitting` | `boolean` | `false` | Estado de envío. |
| `error` | `ReactNode` | — | Mensaje arriba del botón de envío. |
| `fieldErrors` | `AuthFieldErrors` | — | Mensajes del servidor por nombre de campo. |
| `forgotPassword` | `AuthLinkConfig<AuthForgotPasswordEvent>` | — | Solo login. |
| `signUpLink` / `signInLink` | `AuthLinkConfig` | — | Pie del login / del registro. |
| `google` | `AuthGoogleConfig` | — | Botón de Google y separador. |
| `texts` | `LoginFormTexts` / `SignUpFormTexts` | Textos en español | Textos de la UI. |
| `titleAs` | `"h1" \| "h2" \| "h3" \| "h4"` | `"h1"` | Nivel del título. |
| `width` | `number \| string` | `448px` | Ancho de la tarjeta. |
| `className` / `classNames` | `string` / `AuthFormClassNames` | — | Tus clases. |

### Tipos

- `LoginFormValues`: `{ email: string; password: string }` más tus campos adicionales.
- `SignUpFormValues`: `{ email; password; firstName?; lastName?; confirmPassword? }` más tus campos
  adicionales.
- `AuthFormValues`: `Record<string, string | boolean>`.
- `AuthExtraField`, `AuthExtraFieldType`, `AuthFieldOption`, `AuthFieldConfig`,
  `AuthFieldValidator`: campos.
- `AuthPasswordRules`, `AuthPasswordPattern`, `AuthPasswordRuleStatus`: requisitos de la
  contraseña.
- `AuthLinkConfig`, `AuthLinkEvent`, `AuthForgotPasswordEvent`, `AuthGoogleConfig`: enlaces y Google.
- `AuthStandardSchema`, `AuthSchemaResult`, `AuthSchemaIssue`: la parte de Standard Schema que lee el
  formulario.
- `DuplicateAuthFieldError`, `UnknownAuthFieldError`: errores de configuración, lanzados al
  renderizar.

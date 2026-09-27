# Auth forms

[English](auth-forms.md) · [Español](auth-forms.es.md)

`LoginForm` and `SignUpForm` render a sign-in form and an account creation form with light and dark
themes. Both forms validate on the client and move the focus to the first invalid field. They never
call a backend or Google: submitting, following a link or pressing the Google button is emitted as
a callback, and your app decides what happens next.

## Import

```ts
import { LoginForm, SignUpForm } from "gridory/auth";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

## Quick example

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
    if (!response.ok) setError("Wrong email or password");
  };
  return (
    <LoginForm
      onSubmit={signIn}
      submitting={submitting}
      error={error}
      forgotPassword={{ href: "/recover" }}
      signUpLink={{ href: "/register" }}
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
    { name: "phone", label: "Phone", type: "tel" },
    { name: "terms", label: "I accept the terms", type: "checkbox", required: true },
  ]}
  signInLink={{ href: "/login" }}
/>
```

## How it works

- **When it validates.** A field is checked when it loses the focus after the user edited it, and
  every field is checked on submit. While typing, only a field that already shows an error is checked
  again, so the message disappears as soon as it is fixed. The form never flags a field in the
  middle of an edit, nor one the user only tabbed through.
- **No lost clicks.** Pressing the submit button, a link or the Google button with the mouse does
  not take the focus away from the field being edited. Otherwise its error could appear on blur,
  push the button down before the mouse is released, and the click would land elsewhere.
- **Submit.** With errors, `onSubmit` is not called: every message appears and the focus moves to
  the first invalid field in visual order, centered on screen. The submit button is never disabled
  by validation, only while `submitting` is `true`.
- **Values.** `onSubmit` receives validated, normalized values in a flat object: `{ email, password,
  ...extras }`. Text is trimmed, the email lowercased and passwords are left intact, spaces included.
  Checkboxes are booleans.
- **Your data stays yours.** The form keeps its own draft state. Initial values come from
  `defaultValues`, and `onValuesChange` reports every edit. To load new values after mounting (for
  example after a Google sign-in), remount the form with a new `key`.

## Fields

### Built-in fields

| Form | Field (`name`) | Type | Required | `autoComplete` |
|---|---|---|---|---|
| Login | `email` | email | Always | `email` |
| Login | `password` | password | Always | `current-password` |
| Sign-up | `firstName` | text | No, unless `required: true` | `given-name` |
| Sign-up | `lastName` | text | No, unless `required: true` | `family-name` |
| Sign-up | `email` | email | Always | `email` |
| Sign-up | `password` | password | Always | `new-password` |
| Sign-up | `confirmPassword` | password | Always, while shown | `new-password` |

Change any of them with `fields`. `false` hides the optional ones (`firstName`, `lastName`,
`confirmPassword`):

```tsx
<SignUpForm
  fields={{
    firstName: { label: "Name", placeholder: "Your name", required: true },
    lastName: false,
    email: { label: "Work email" },
    confirmPassword: { label: "Repeat the password", requiredMessage: "Repeat your password" },
  }}
  onSubmit={createAccount}
/>
```

| `AuthFieldConfig` key | Type | Description |
|---|---|---|
| `label` | `ReactNode` | Visible label. |
| `placeholder` | `string` | Placeholder of the control. |
| `required` | `boolean` | Only the name fields honor it: email and password are always required. |
| `requiredMessage` | `string` | Message when the field is empty. |
| `validate` | `(value, values) => string \| undefined` | Extra check, run after the built-in rules. |

First and last name share a row when they are next to each other and the form is at least 360px
wide inside its padding. Below that they stack.

### Extra fields

`extraFields` adds your own fields after the built-in ones. Each field has a `name`, which is its key
in the submitted values, and a `label`:

```tsx
extraFields={[
  { name: "phone", label: "Phone", type: "tel" },
  { name: "teamSize", label: "Team size", type: "number" },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    placeholder: "Pick your role",
    options: [{ value: "dev", label: "Development" }, { value: "design", label: "Design" }],
  },
  { name: "about", label: "About you", type: "textarea" },
  { name: "terms", label: <>I accept the <a href="/terms">terms</a></>, type: "checkbox", required: true },
]}
```

| `type` | Control | Value | Required message |
|---|---|---|---|
| `"text"` (default), `"url"`, `"number"` | `<input>` of that type | `string` | Derived from the label |
| `"tel"` | The phone input: dial code picker plus number (see [phone-input.md](phone-input.md)) | `AuthPhoneValue`: `{ country: CountryCode \| null; number: string }` | Derived from the label |
| `"email"` | `<input type="email">`, validated as an email | `string` | Derived from the label |
| `"textarea"` | `<textarea>` | `string` | Derived from the label |
| `"select"` | The Gridory select, with `options` | `string` (the option `value`) | `texts.selectRequired` |
| `"checkbox"` | Native checkbox, label on the right | `boolean` | `texts.checkboxRequired` |

`AuthExtraField` also takes `required`, `placeholder`, `requiredMessage`, `autoComplete` and
`validate`. A `name` used twice, or equal to a built-in field, throws `DuplicateAuthFieldError`.

A `tel` field emits the country by its ISO code and the number, trimmed, so `+1` never mixes up
Canada and the United States. The number keeps only digits, spaces, hyphens and `+`, typed or
pasted. It counts as empty while the number is blank, and a number without a country fails with
`texts.phoneCountryRequired`, even when the field is optional. A string in `defaultValues` still
works: it becomes the number, with no country. Its `autoComplete` is always `tel-national`, because
the country goes in the prefix.

> Since this version a `tel` field emits `{ country, number }` instead of a `string`. If your code
> reads it as text, read `values.phone.number` and, when you need it, the dial code of
> `values.phone.country`.

### Field order

Extra fields go last by default. `fieldOrder` lists names to place first, in that order. Fields
it does not list keep their order after them:

```tsx
fieldOrder={["firstName", "lastName", "email", "phone", "password", "confirmPassword"]}
```

A name that matches no field throws `UnknownAuthFieldError`. A hidden built-in field (`lastName:
false`) can stay in the list.

## Validation

### Required fields and messages

Required fields show a red asterisk after the label and carry `aria-required`. An empty required
field shows `texts.requiredMessage` with `{label}` replaced by its label, in lowercase unless it
reads as an acronym: "Email" gives "Ingresa tu email" and "DNI" gives "Ingresa tu DNI". When the
label is not a plain string, `texts.requiredFallback` is used instead.

The template works for singular labels. For a plural or gendered label ("Nombres"), pass
`requiredMessage` on the field.

### Email and passwords

- Every `email` field must look like `name@domain.tld`.
- `confirmPassword` must equal `password` (`texts.passwordMismatch`).
- `passwordRules` (sign-up only) adds requirements to the password and shows them as a live list
  under the field. The login only requires a non-empty password, so users with passwords created
  under older rules can still sign in.

| `AuthPasswordRules` key | Requirement | Default label |
|---|---|---|
| `minLength` | At least N characters (Unicode code points, so an emoji counts once). | `"Al menos {count} caracteres"` |
| `maxLength` | At most N characters. | `"Como máximo {count} caracteres"` |
| `uppercase` / `lowercase` | An uppercase / lowercase letter. Ñ and accented letters count. | `"Una letra mayúscula"` / `"Una letra minúscula"` |
| `number` | A digit. | `"Un número"` |
| `symbol` | Anything that is not a letter, a digit or a space. | `"Un carácter especial"` |
| `patterns` | `{ pattern: RegExp, label: string }[]`, one requirement each. | Its `label` |

Each item of the list has `data-status`:

- `"pending"`: the password is empty and nothing was submitted yet.
- `"met"`: the requirement is fulfilled.
- `"unmet"`: the user typed, or tried to submit, and the requirement is not fulfilled.

The icon changes with the status, so the list does not rely on color alone. An unmet list blocks
the submit with `texts.passwordRequirements`.

### Your own checks and zod

`validate` on any field runs after the built-in rules. For a whole-form check, `schema` accepts any
[Standard Schema](https://standardschema.dev) validator, such as zod 3.24 or later, valibot or arktype,
without adding a dependency to Gridory:

```tsx
import { z } from "zod";

const schema = z
  .object({ email: z.string(), password: z.string(), confirmPassword: z.string() })
  .refine((values) => !values.email.endsWith("@competitor.com"), {
    path: ["email"],
    message: "Use your work email",
  });

<SignUpForm schema={schema} onSubmit={createAccount} />;
```

The schema runs on submit, after the built-in rules pass, and receives every value, including
`confirmPassword`. Each issue is shown under the field named by the first segment of its `path`,
and one without a path is shown above the submit button. Editing a field clears its schema message
until the next submit. Asynchronous schemas are awaited.

### Errors from your server

| Prop | Shows |
|---|---|
| `fieldErrors` | `{ [name]: message }` under each field, for example `{ email: "That email is taken" }`. A message hides once its field is edited, and shows again when you pass a new object. |
| `error` | A message above the submit button, with `role="alert"`. |
| `submitting` | Disables the submit and Google buttons and shows `texts.submitting` with a spinner. |

## Links and Google

Every optional part shows only when you configure it.

| Prop | Form | Renders |
|---|---|---|
| `forgotPassword` | Login | "¿Olvidaste tu contraseña?" under the password field, aligned right. |
| `signUpLink` | Login | "¿No tienes cuenta? Regístrate aquí" at the bottom. |
| `signInLink` | Sign-up | "¿Ya tienes una cuenta? Inicia sesión" at the bottom. |
| `google` | Both | The "o" divider and the "Continuar con Google" button. |

A link config is `{ href?, onClick? }`:

- With `href`, it renders an `<a>`. Middle click works and screen readers announce it as a link.
- Without `href`, it renders a `<button>`.
- `onClick` receives `{ event }`, so you can call `event.preventDefault()` and navigate with your
  router.
- `forgotPassword.onClick` also receives the typed `email`, for example to open the recovery form
  already filled in.

`google` takes `onClick`, `disabled` and `render`. The button carries Google's logo and never loads
Google's script. For a flow that needs the ID token (`credential`), which only Google's official
button returns, use `render` to mount that official button invisibly over this one. The visible face
keeps its design and hover, and is hidden from assistive technology:

```tsx
import { GoogleLogin } from "@react-oauth/google";

<LoginForm
  google={{
    render: () => <GoogleLogin onSuccess={({ credential }) => signInWithGoogle(credential)} width={400} />,
  }}
  onSubmit={signIn}
/>;
```

Google's button is at most 400px wide. If your form is wider, the right edge of the face is not
clickable.

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onSubmit` | `(values: LoginFormValues \| SignUpFormValues) => void` | On submit, only when every rule and the `schema` pass. |
| `onValuesChange` | `(values: AuthFormValues) => void` | On every edit, with all the current values. |
| `forgotPassword.onClick` | `({ event, email }) => void` | "¿Olvidaste tu contraseña?" is clicked. |
| `signUpLink.onClick` / `signInLink.onClick` | `({ event }) => void` | The footer link is clicked. |
| `google.onClick` | `(event) => void` | The Google button is clicked (not called when `render` is used). |

## Texts

UI texts default to Spanish and every one can be replaced through `texts`. The defaults are exported
as `DEFAULT_LOGIN_TEXTS` and `DEFAULT_SIGN_UP_TEXTS`, and the built-in fields as
`DEFAULT_LOGIN_FIELDS` and `DEFAULT_SIGN_UP_FIELDS`.

| Key | Login default | Sign-up default | Used for |
|---|---|---|---|
| `title` | `"Iniciar sesión"` | `"Crea tu cuenta"` | Heading. |
| `subtitle` | none | none | Optional line under the heading. |
| `submit` | `"Iniciar sesión"` | `"Siguiente"` | Submit button. |
| `submitting` | `"Iniciando sesión..."` | `"Validando..."` | Submit button while `submitting`. |
| `google` | `"Continuar con Google"` | same | Google button. |
| `divider` | `"o"` | same | Divider above the Google button. |
| `showPassword` / `hidePassword` | `"Mostrar contraseña"` / `"Ocultar contraseña"` | same | Eye button name and tooltip. |
| `requiredMessage` | `"Ingresa tu {label}"` | same | Empty required field. |
| `requiredFallback` | `"Este campo es obligatorio"` | same | Same, when the label is not a string. |
| `invalidEmail` | `"Ingresa un email válido"` | same | Malformed email. |
| `checkboxRequired` | `"Debes marcar esta casilla para continuar"` | same | Required checkbox left unchecked. |
| `selectRequired` | `"Selecciona una opción"` | same | Required select left empty. |
| `phoneCountryRequired` | `"Elige el prefijo de tu país"` | same | Phone number without a country. |
| `forgotPassword` | `"¿Olvidaste tu contraseña?"` | — | Forgot-password link. |
| `signUpPrompt` / `signUpLink` | `"¿No tienes cuenta?"` / `"Regístrate aquí"` | — | Login footer. |
| `signInPrompt` / `signInLink` | — | `"¿Ya tienes una cuenta?"` / `"Inicia sesión"` | Sign-up footer. |
| `passwordMismatch` | — | `"Las contraseñas no coinciden"` | Different confirmation. |
| `passwordRequirements` | — | `"La contraseña no cumple todos los requisitos"` | Weak password on submit. |
| `passwordRulesTitle` | — | `"La contraseña debe tener:"` | Heading of the requirement list. |
| `ruleMinLength`, `ruleMaxLength` | — | `"Al menos {count} caracteres"`, `"Como máximo {count} caracteres"` | Length requirements. |
| `ruleUppercase`, `ruleLowercase`, `ruleNumber`, `ruleSymbol` | — | See [Email and passwords](#email-and-passwords) | Character requirements. |
| `ruleMet` / `ruleUnmet` | — | `"Cumplido"` / `"Pendiente"` | Accessible name of each requirement icon. |

The eye button keeps `showPassword` as its accessible name and reports its state with
`aria-pressed`. `hidePassword` is the tooltip while the password is visible.

## Layout

- **Width.** The card is 448px wide by default and never wider than its container, so it fits on a
  phone. `width` takes a number of pixels or any CSS length (`width={400}`, `width="32rem"`). The
  height follows the content.
- **Centering.** The card centers itself horizontally. Centering it vertically belongs to your
  page. Fill the space left by your header instead of using `100vh`, which adds a scroll under a
  navigation bar:

  ```css
  .auth-page { flex: 1; display: grid; place-items: center; padding: 24px 16px; }
  ```

- **Heading.** The title renders as an `h1`; `titleAs` switches it to `h2`, `h3` or `h4`.
- **Touch screens.** On devices with a coarse pointer (`pointer: coarse`), inputs and the select use
  16px text, so iOS does not zoom in when a field gets the focus, and the eye button grows to
  36 × 36px. Hover colors only apply where the pointer can hover (`hover: hover`), so they do not
  stick to the last button tapped on a phone.

## Styling

Tokens and light/dark themes are covered in [theming.md](theming.md), and every hook, state
selector and token is listed in [style-hooks.md](style-hooks.md). The forms follow the theme set on
`<html>` (`.dark` or `data-theme="dark"`), and native parts such as the checkbox follow it too.

| Area | Hooks |
|---|---|
| Card | `gdy-auth` (root, with `data-form="login"` or `"signup"`), `gdy-auth-header`, `gdy-auth-title`, `gdy-auth-subtitle` |
| Form | `gdy-auth-form`, `gdy-auth-fields`, `gdy-auth-name-row`, `gdy-auth-field`, `gdy-auth-label`, `gdy-auth-required` |
| Controls | `gdy-auth-input`, `gdy-auth-textarea`, `gdy-auth-select`, `gdy-auth-checkbox`, `gdy-auth-checkbox-input`, `gdy-auth-checkbox-label` |
| Password | `gdy-auth-password`, `gdy-auth-password-toggle`, `gdy-auth-password-icon`, `gdy-auth-addon`, `gdy-auth-forgot`, `gdy-auth-rules`, `gdy-auth-rules-title`, `gdy-auth-rules-list`, `gdy-auth-rule`, `gdy-auth-rule-icon` |
| Messages | `gdy-auth-error`, `gdy-auth-alert` |
| Actions | `gdy-auth-submit`, `gdy-auth-spinner`, `gdy-auth-divider`, `gdy-auth-google-slot`, `gdy-auth-google`, `gdy-auth-google-logo`, `gdy-auth-google-overlay`, `gdy-auth-link`, `gdy-auth-footer` |

| Element | State attribute | Values |
|---|---|---|
| `gdy-auth` | `data-form` | `"login"`, `"signup"` |
| Controls | `aria-invalid`, `aria-required` | Present on an invalid or a required field. |
| `gdy-auth-rule` | `data-status` | `"pending"`, `"met"`, `"unmet"` |
| `gdy-auth-google-slot` | `data-disabled` | Present while the Google button is disabled. |
| `gdy-auth-password-toggle` | `aria-pressed` | `"true"` while the password is visible. |

No control paints outside its box: on focus, inputs, the select and the buttons change their
border and add an inset ring in `--gdy-auth-input-focus-border`.

The library does not define the component tokens: each one is read with a fallback, so set only the
ones you need. Set them on `:root` for the light theme and on `.dark` for the dark one:

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

| Token | Fallback | Used by |
|---|---|---|
| `--gdy-auth-width` | `448px` | Card width (the `width` prop sets it inline). |
| `--gdy-auth-padding` | `24px` | Card padding. |
| `--gdy-auth-bg`, `--gdy-auth-fg` | `--gdy-card`, `--gdy-card-foreground` | Card background and text. |
| `--gdy-auth-border`, `--gdy-auth-radius`, `--gdy-auth-shadow` | `--gdy-border`, `--gdy-radius` + 2px, `--gdy-shadow-sm` | Card frame. |
| `--gdy-auth-gap` | `16px` | Space between the card blocks. |
| `--gdy-auth-field-gap` | `14px` | Space between fields. |
| `--gdy-auth-label-gap` | `6px` | Label to control. |
| `--gdy-auth-header-gap` | `4px` | Extra space under the heading. |
| `--gdy-auth-divider-gap` | `12px` | Space above and below the divider. |
| `--gdy-auth-title`, `--gdy-auth-label`, `--gdy-auth-muted` | inherited, inherited, `--gdy-muted-foreground` | Heading, labels, secondary text. |
| `--gdy-auth-input-height`, `--gdy-auth-input-radius` | `40px`, `--gdy-radius` | Inputs and select. |
| `--gdy-auth-input-bg`, `--gdy-auth-input-fg`, `--gdy-auth-input-border` | `--gdy-background`, `--gdy-foreground`, `--gdy-input` | Inputs and select. |
| `--gdy-auth-input-focus-border` | `--gdy-ring` | Focus border and inset ring of every control. |
| `--gdy-auth-error` | `--gdy-destructive` | Field errors, invalid borders, the alert. |
| `--gdy-auth-required` | `--gdy-destructive` | Asterisk of required fields. |
| `--gdy-auth-checkbox` | `--gdy-primary` | Checkbox fill. |
| `--gdy-auth-rule-pending`, `--gdy-auth-rule-met`, `--gdy-auth-rule-unmet` | `--gdy-muted-foreground`, `--gdy-success`, `--gdy-destructive` | Password requirements. |
| `--gdy-auth-button-height`, `--gdy-auth-button-radius` | `40px`, `--gdy-radius` | Submit and Google buttons. |
| `--gdy-auth-submit-bg`, `--gdy-auth-submit-fg` | `--gdy-primary`, `--gdy-primary-foreground` | Submit button. |
| `--gdy-auth-submit-hover-bg` | `--gdy-auth-submit-bg` at 85% | Submit button on hover. |
| `--gdy-auth-submit-focus` | `--gdy-ring` | Inset ring of the submit button. |
| `--gdy-auth-google-bg`, `--gdy-auth-google-fg`, `--gdy-auth-google-border` | `--gdy-background`, `--gdy-foreground`, `--gdy-border` | Google button. |
| `--gdy-auth-google-hover-bg`, `--gdy-auth-google-hover-fg`, `--gdy-auth-google-hover-border` | `--gdy-muted`, `--gdy-foreground`, `--gdy-ring` | Google button on hover. |
| `--gdy-auth-divider` | `--gdy-border` | Divider lines. |
| `--gdy-auth-link` | `--gdy-link` | Links. |

The divider draws two lines around the "o" instead of masking one line with a background, so
nothing has to match the card color in either theme. The four colors of Google's logo are base
tokens (`--gdy-google-*`) only because literal colors are not allowed in the stylesheets. Google's
brand guidelines forbid recoloring the logo, so leave them as they are.

The library rules weigh one class. The submit, Google and eye buttons sit on the shared
`gdy-button` and use two classes (`.gdy-button.gdy-auth-submit`), and the select uses
`.gdy-select-trigger.gdy-auth-select`; match that weight to override them. `className` goes on the
root and `classNames` adds your classes to each part:

| `classNames` slot | Element |
|---|---|
| `root` | The card. |
| `title`, `subtitle` | Heading and subtitle. |
| `form` | The `<form>`. |
| `field`, `label`, `input`, `error` | Every field wrapper, label, control and error message. |
| `alert` | The `error` message. |
| `submit`, `google`, `divider` | Buttons and divider. |
| `footer`, `link` | Footer paragraph and every link. |
| `passwordRules` | The requirement list. |

## Accessibility

- Every control has a `<label>` and points to its error and, for the password, to the requirement
  list through `aria-describedby`.
- Invalid and required fields carry `aria-invalid` and `aria-required`. The asterisk is hidden
  from screen readers because `aria-required` already says it.
- The form uses `noValidate`: messages come from the form, not from the browser's bubbles.
- The eye button is reachable with the keyboard, and clicking it does not take the focus away from
  the password field.

## Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSubmit` | `(values) => void` | required | Validated, normalized values. |
| `onValuesChange` | `(values: AuthFormValues) => void` | — | Every edit. |
| `defaultValues` | `AuthFormValues` | — | Initial values by field name. |
| `fields` | `LoginFieldsConfig` / `SignUpFieldsConfig` | — | Built-in field overrides. |
| `extraFields` | `AuthExtraField[]` | — | Your own fields. |
| `fieldOrder` | `string[]` | — | Names placed first, in order. |
| `schema` | `AuthStandardSchema` | — | Whole-form validator (zod, valibot…). |
| `passwordRules` | `AuthPasswordRules` | — | Sign-up only: password requirements. |
| `submitting` | `boolean` | `false` | Busy state. |
| `error` | `ReactNode` | — | Message above the submit button. |
| `fieldErrors` | `AuthFieldErrors` | — | Server messages by field name. |
| `forgotPassword` | `AuthLinkConfig<AuthForgotPasswordEvent>` | — | Login only. |
| `signUpLink` / `signInLink` | `AuthLinkConfig` | — | Login / sign-up footer. |
| `google` | `AuthGoogleConfig` | — | Google button and divider. |
| `texts` | `LoginFormTexts` / `SignUpFormTexts` | Spanish defaults | UI texts. |
| `titleAs` | `"h1" \| "h2" \| "h3" \| "h4"` | `"h1"` | Heading level. |
| `width` | `number \| string` | `448px` | Card width. |
| `className` / `classNames` | `string` / `AuthFormClassNames` | — | Your classes. |

### Types

- `LoginFormValues`: `{ email: string; password: string }` plus your extra fields.
- `SignUpFormValues`: `{ email; password; firstName?; lastName?; confirmPassword? }` plus your extra
  fields.
- `AuthFormValues`: `Record<string, AuthFieldValue>`, where `AuthFieldValue` is
  `string | boolean | AuthPhoneValue`.
- `AuthPhoneValue`: `{ country: CountryCode | null; number: string }`, the value of a `tel` field.
- `AuthExtraField`, `AuthExtraFieldType`, `AuthFieldOption`, `AuthFieldConfig`,
  `AuthFieldValidator`: fields.
- `AuthPasswordRules`, `AuthPasswordPattern`, `AuthPasswordRuleStatus`: password requirements.
- `AuthLinkConfig`, `AuthLinkEvent`, `AuthForgotPasswordEvent`, `AuthGoogleConfig`: links and
  Google.
- `AuthStandardSchema`, `AuthSchemaResult`, `AuthSchemaIssue`: the Standard Schema subset the form
  reads.
- `DuplicateAuthFieldError`, `UnknownAuthFieldError`: configuration errors, thrown while rendering.

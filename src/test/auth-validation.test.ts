import { expect, test } from "vitest";
import { DEFAULT_SIGN_UP_TEXTS } from "../components/auth/constants";
import { applyFieldOrder, assertUniqueFieldNames } from "../components/auth/config/field-order";
import { groupFieldRows } from "../components/auth/config/field-rows";
import { normalizeValues } from "../components/auth/model/form-values";
import { resolveRequiredMessage } from "../components/auth/config/required-message";
import type { ResolvedAuthField } from "../components/auth/config/resolved-field";
import type { AuthFieldType, AuthStandardSchema } from "../components/auth/types";
import {
  DuplicateAuthFieldError,
  UnknownAuthFieldError,
} from "../components/auth/validation/auth-field-errors";
import { emailRule, matchRule, requiredRule } from "../components/auth/validation/field-rules";
import {
  buildPasswordRequirements,
  resolveRequirementStatus,
} from "../components/auth/password/password-rules";
import { FORM_ERROR_KEY, validateWithSchema } from "../components/auth/validation/standard-schema";

const fieldNamed = (name: string, type: AuthFieldType = "text"): ResolvedAuthField => ({
  name,
  label: name,
  type,
  required: false,
  rules: [],
});

const requirementIds = (password: string, rules: Parameters<typeof buildPasswordRequirements>[0]) =>
  buildPasswordRequirements(rules, DEFAULT_SIGN_UP_TEXTS)
    .filter((requirement) => requirement.isMet(password))
    .map((requirement) => requirement.id);

test("required rule rejects empty text, blank text and an unchecked box", () => {
  const rule = requiredRule("Obligatorio");
  expect(rule("", {})).toBe("Obligatorio");
  expect(rule("   ", {})).toBe("Obligatorio");
  expect(rule(false, {})).toBe("Obligatorio");
  expect(rule("Ana", {})).toBeUndefined();
  expect(rule(true, {})).toBeUndefined();
});

test("email rule accepts real addresses and leaves empty values to the required rule", () => {
  const rule = emailRule("Email inválido");
  expect(rule("hola@", {})).toBe("Email inválido");
  expect(rule("a b@c.com", {})).toBe("Email inválido");
  expect(rule("ana@empresa", {})).toBe("Email inválido");
  expect(rule(" ana@empresa.com ", {})).toBeUndefined();
  expect(rule("", {})).toBeUndefined();
});

test("match rule compares against the other field", () => {
  const rule = matchRule("password", "No coinciden");
  expect(rule("abc", { password: "abd" })).toBe("No coinciden");
  expect(rule("abc", { password: "abc" })).toBeUndefined();
});

test("password requirements count characters and treat ñ and accents as letters", () => {
  const rules = { minLength: 4, uppercase: true, lowercase: true, number: true, symbol: true };
  expect(requirementIds("Ñandú", rules)).toEqual(["minLength", "uppercase", "lowercase"]);
  expect(requirementIds("año 2", rules)).toEqual(["minLength", "lowercase", "number"]);
  expect(requirementIds("🔒🔒🔒", { minLength: 4 })).toEqual([]);
  expect(requirementIds("a#", { symbol: true })).toEqual(["symbol"]);
});

test("a custom pattern with the global flag gives the same answer every time", () => {
  const patterns = [{ pattern: /\d{2}/g, label: "Dos dígitos seguidos" }];
  const [requirement] = buildPasswordRequirements({ patterns }, DEFAULT_SIGN_UP_TEXTS);
  expect(requirement.label).toBe("Dos dígitos seguidos");
  expect([requirement.isMet("a12"), requirement.isMet("a12")]).toEqual([true, true]);
});

test("requirement status is pending until the user types or the form is submitted", () => {
  const [minLength] = buildPasswordRequirements({ minLength: 8 }, DEFAULT_SIGN_UP_TEXTS);
  expect(minLength.label).toBe("Al menos 8 caracteres");
  expect(resolveRequirementStatus(minLength, "", false)).toBe("pending");
  expect(resolveRequirementStatus(minLength, "", true)).toBe("unmet");
  expect(resolveRequirementStatus(minLength, "abc", false)).toBe("unmet");
  expect(resolveRequirementStatus(minLength, "abcdefgh", false)).toBe("met");
});

test("required message derives from the label and respects acronyms and custom texts", () => {
  const texts = DEFAULT_SIGN_UP_TEXTS;
  expect(resolveRequiredMessage({ label: "Email", type: "email" }, texts)).toBe("Ingresa tu email");
  expect(resolveRequiredMessage({ label: "DNI", type: "text" }, texts)).toBe("Ingresa tu DNI");
  expect(resolveRequiredMessage({ label: ["Acepto"], type: "text" }, texts)).toBe(texts.requiredFallback);
  expect(resolveRequiredMessage({ label: "Términos", type: "checkbox" }, texts)).toBe(texts.checkboxRequired);
  expect(resolveRequiredMessage({ label: "Rol", type: "select" }, texts)).toBe(texts.selectRequired);
  expect(resolveRequiredMessage({ label: "Rol", type: "text", requiredMessage: "Falta" }, texts)).toBe("Falta");
});

const ISSUES_SCHEMA: AuthStandardSchema = {
  "~standard": {
    version: 1,
    vendor: "test",
    validate: async () => ({
      issues: [
        { message: "Email tomado", path: ["email"] },
        { message: "Segundo mensaje", path: ["email"] },
        { message: "No coinciden", path: [{ key: "confirmPassword" }] },
        { message: "Formulario inválido" },
      ],
    }),
  },
};

test("schema issues map to the first message per field and path-less issues to the form", async () => {
  expect(await validateWithSchema(ISSUES_SCHEMA, {})).toEqual({
    email: "Email tomado",
    confirmPassword: "No coinciden",
    [FORM_ERROR_KEY]: "Formulario inválido",
  });
});

test("field order moves the listed fields first and keeps the rest", () => {
  const fields = ["email", "password", "phone"].map((name) => fieldNamed(name));
  const ordered = applyFieldOrder(fields, ["phone", "lastName", "email"]);
  expect(ordered.map((field) => field.name)).toEqual(["phone", "email", "password"]);
  expect(() => applyFieldOrder(fields, ["telefono"])).toThrow(UnknownAuthFieldError);
});

test("duplicate field names are rejected", () => {
  expect(() => assertUniqueFieldNames([fieldNamed("email"), fieldNamed("email")])).toThrow(
    DuplicateAuthFieldError,
  );
});

test("first and last name share a row only when they are next to each other", () => {
  const rows = (names: string[]) =>
    groupFieldRows(names.map((name) => fieldNamed(name))).map((row) => row.length);
  expect(rows(["firstName", "lastName", "email"])).toEqual([2, 1]);
  expect(rows(["firstName", "email", "lastName"])).toEqual([1, 1, 1]);
});

test("submitted values are trimmed, the email lowercased and passwords left intact", () => {
  const fields = [fieldNamed("email", "email"), fieldNamed("password", "password"), fieldNamed("terms", "checkbox")];
  expect(normalizeValues(fields, { email: " Ana@Empresa.COM ", password: " clave ", terms: true })).toEqual({
    email: "ana@empresa.com",
    password: " clave ",
    terms: true,
  });
});

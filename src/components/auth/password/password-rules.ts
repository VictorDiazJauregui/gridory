import type {
  AuthPasswordPattern,
  AuthPasswordRules,
  AuthPasswordRuleStatus,
  SignUpFormTexts,
} from "../types";
import type { AuthRule } from "../config/resolved-field";

export interface PasswordRequirement {
  id: string;
  label: string;
  isMet: (password: string) => boolean;
}

export type PasswordRequirementTexts = Required<
  Pick<
    SignUpFormTexts,
    | "ruleMinLength"
    | "ruleMaxLength"
    | "ruleUppercase"
    | "ruleLowercase"
    | "ruleNumber"
    | "ruleSymbol"
  >
>;

// Unicode classes so ñ, Ñ and accented vowels count as letters, not symbols.
const CHARACTER_CHECKS = [
  { id: "uppercase", pattern: /\p{Lu}/u, textKey: "ruleUppercase" },
  { id: "lowercase", pattern: /\p{Ll}/u, textKey: "ruleLowercase" },
  { id: "number", pattern: /\p{N}/u, textKey: "ruleNumber" },
  { id: "symbol", pattern: /[^\p{L}\p{N}\s]/u, textKey: "ruleSymbol" },
] as const;

const countCharacters = (password: string): number => [...password].length;

const fillCount = (template: string, count: number): string =>
  template.replace("{count}", String(count));

const minLengthRequirement = (
  minLength: number,
  template: string,
): PasswordRequirement => ({
  id: "minLength",
  label: fillCount(template, minLength),
  isMet: (password) => countCharacters(password) >= minLength,
});

const maxLengthRequirement = (
  maxLength: number,
  template: string,
): PasswordRequirement => ({
  id: "maxLength",
  label: fillCount(template, maxLength),
  isMet: (password) => countCharacters(password) <= maxLength,
});

const lengthRequirements = (
  { minLength, maxLength }: AuthPasswordRules,
  texts: PasswordRequirementTexts,
): PasswordRequirement[] => [
  ...(minLength === undefined ? [] : [minLengthRequirement(minLength, texts.ruleMinLength)]),
  ...(maxLength === undefined ? [] : [maxLengthRequirement(maxLength, texts.ruleMaxLength)]),
];

const characterRequirements = (
  rules: AuthPasswordRules,
  texts: PasswordRequirementTexts,
): PasswordRequirement[] =>
  CHARACTER_CHECKS.filter((check) => rules[check.id]).map((check) => ({
    id: check.id,
    label: texts[check.textKey],
    isMet: (password) => check.pattern.test(password),
  }));

// A copy without the g/y flags: RegExp#test on those is stateful across calls.
const patternRequirement = (
  { pattern, label }: AuthPasswordPattern,
  index: number,
): PasswordRequirement => {
  const matcher = new RegExp(
    pattern.source,
    pattern.flags.replace(/[gy]/g, ""),
  );
  return {
    id: `pattern-${index}`,
    label,
    isMet: (password) => matcher.test(password),
  };
};

export const buildPasswordRequirements = (
  rules: AuthPasswordRules | undefined,
  texts: PasswordRequirementTexts,
): PasswordRequirement[] => {
  if (!rules) return [];
  return [
    ...lengthRequirements(rules, texts),
    ...characterRequirements(rules, texts),
    ...(rules.patterns ?? []).map(patternRequirement),
  ];
};

export const resolveRequirementStatus = (
  requirement: PasswordRequirement,
  password: string,
  revealed: boolean,
): AuthPasswordRuleStatus => {
  if (password === "" && !revealed) return "pending";
  return requirement.isMet(password) ? "met" : "unmet";
};

export const passwordRequirementsRule =
  (requirements: PasswordRequirement[], message: string): AuthRule =>
  (value) => {
    const password = String(value);
    if (password === "") return undefined;
    return requirements.every((requirement) => requirement.isMet(password))
      ? undefined
      : message;
  };

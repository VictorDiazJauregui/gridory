import postcss from "postcss";
import tailwindcss, { type Config } from "tailwindcss";
import { expect, test } from "vitest";
import { createGridoryPreset } from "../../tailwind-preset.js";

const PROJECT_CLASSES = ["bg-primary", "text-primary-foreground", "bg-popover", "border-border", "rounded-lg", "rounded-md", "bg-primary/10"];
const GRIDORY_CLASSES = ["bg-gdy-primary", "text-gdy-primary-foreground", "border-gdy-border", "outline-gdy-ring", "rounded-gdy-lg", "bg-gdy-primary/10"];
const MARKUP = [...PROJECT_CLASSES, ...GRIDORY_CLASSES].join(" ");

const SHADCN_THEME: Config["theme"] = {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
      primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
    },
    borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)" },
  },
};

const PROJECTS: Record<string, Config["theme"]> = { minimal: {}, shadcn: SHADCN_THEME };

const compileUtilities = async (theme: Config["theme"], withPreset: boolean) => {
  const config: Config = {
    content: [{ raw: `<div class="${MARKUP}"></div>`, extension: "html" }],
    theme,
    // An empty `presets` array would also drop Tailwind's own default theme.
    ...(withPreset ? { presets: [createGridoryPreset()] } : {}),
    corePlugins: { preflight: false },
  };
  const result = await postcss([tailwindcss(config)]).process("@tailwind utilities;", { from: undefined });
  return result.root;
};

const ruleOf = (root: postcss.Root, className: string) => {
  const selector = `.${className.replace("/", "\\/")}`;
  let rule: string | undefined;
  root.walkRules((candidate) => {
    if (candidate.selector === selector) rule = candidate.toString();
  });
  return rule;
};

test.each(Object.keys(PROJECTS))("in a %s project the prefixed preset changes no utility of the project", async (project) => {
  // One after the other: Tailwind 3 keeps one build context per process and two at once mix up.
  const plain = await compileUtilities(PROJECTS[project], false);
  const withPreset = await compileUtilities(PROJECTS[project], true);
  PROJECT_CLASSES.forEach((className) => expect(ruleOf(withPreset, className)).toBe(ruleOf(plain, className)));
  GRIDORY_CLASSES.forEach((className) => {
    expect(ruleOf(plain, className)).toBeUndefined();
    expect(ruleOf(withPreset, className)).toContain("--gdy-");
  });
});

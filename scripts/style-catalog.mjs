#!/usr/bin/env node
/**
 * Writes docs/style-hooks.md and docs/style-hooks.es.md from the sources: every
 * gdy-* class, the state selectors it takes, every state attribute and every
 * token with its defaults or fallbacks. The catalog is generated so it cannot
 * drift from the stylesheets; `--check` fails when the committed files are stale.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  CLASS_IN_CSS,
  CLASS_IN_SOURCE,
  TOKEN_DECLARATION,
  collect,
  librarySources,
  libraryStylesheets,
  readAllowlist,
  readStripped,
  root,
} from "./style-sources.mjs";

const allowlist = readAllowlist();
const publicUtilities = new Set(allowlist.publicUtilities);
const tokensFile = path.join(root, "src/styles/tokens.css");
const componentStylesheets = libraryStylesheets.filter((file) => file !== tokensFile);

const COMPOUND =
  /\.(gdy-[a-z0-9]+(?:-[a-z0-9]+)*)((?:\.[\w-]+|\[[^\]]+\]|::?[\w-]+(?:\((?:[^()]|\([^()]*\))*\))?)*)/g;
const ATTRIBUTE = /\[((?:data|aria)-[a-z0-9-]+)(?:="?([^"\]]+)"?)?\]/g;
const EMITTED_DATA_ATTRIBUTE = /\b(data-[a-z0-9-]+)=/g;
const EMITTED_LITERAL_VALUE = /\b(data-[a-z0-9-]+)="([^"]+)"/g;
// Attributes whose value is a typed prop (data-action-type={action.type}):
// their values are read from the union type so the catalog follows the API.
const TYPED_ATTRIBUTE_VALUES = {
  "data-action-type": { file: "src/components/ai/types.ts", type: "AIActionType" },
  "data-form": { file: "src/components/auth/types.ts", type: "AuthFormKind" },
  "data-status": { file: "src/components/auth/types.ts", type: "AuthPasswordRuleStatus" },
};
const IGNORED_ATTRIBUTES = new Set([
  "data-slot",
  "data-1p-ignore",
  "data-lpignore",
  "data-form-type",
  "data-bwignore",
]);
const GROUPS = [
  { id: "table", match: /^gdy-table(?:-|$)/ },
  { id: "kanban", match: /^gdy-kanban(?:-|$)/ },
  { id: "ai", match: /^gdy-ai(?:-|$)/ },
  { id: "auth", match: /^gdy-auth(?:-|$)/ },
  { id: "segmented-control", match: /^gdy-segmented(?:-|$)/ },
  { id: "country-select", match: /^gdy-country-select(?:-|$)/ },
  { id: "phone-input", match: /^gdy-phone-input(?:-|$)/ },
  { id: "ui", match: /^gdy-(?:button|select|menu|popover|toggle|calendar)(?:-|$)/ },
  { id: "shared", match: /^gdy-/ },
];

const formatAttribute = (name, value) => (value ? `[${name}="${value}"]` : `[${name}]`);
const addTo = (map, key, value) => {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
};

const readStateSelectorRecords = () =>
  componentStylesheets.flatMap((file) =>
    [...readStripped(file).matchAll(COMPOUND)].flatMap(([, className, tail]) =>
      [...tail.matchAll(ATTRIBUTE)].map(([, name, value]) => ({ className, name, value })),
    ),
  );

const readUnionLiterals = ({ file, type }) => {
  const source = readStripped(path.join(root, file));
  const union = source.match(new RegExp(`type ${type} =([^;]+);`));
  return union ? [...union[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
};

const readEmittedValues = () => [
  ...librarySources.flatMap((file) =>
    [...readStripped(file).matchAll(EMITTED_LITERAL_VALUE)].map(([, name, value]) => ({ name, value })),
  ),
  ...Object.entries(TYPED_ATTRIBUTE_VALUES).flatMap(([name, source]) =>
    readUnionLiterals(source).map((value) => ({ name, value })),
  ),
];

const readStateSelectors = () => {
  const selectorsByClass = new Map();
  const classesByAttribute = new Map();
  const valuesByAttribute = new Map();
  for (const { className, name, value } of readStateSelectorRecords()) {
    addTo(selectorsByClass, className, formatAttribute(name, value));
    addTo(classesByAttribute, name, className);
    if (value) addTo(valuesByAttribute, name, value);
  }
  for (const { name, value } of readEmittedValues()) {
    if (!IGNORED_ATTRIBUTES.has(name)) addTo(valuesByAttribute, name, value);
  }
  return { selectorsByClass, classesByAttribute, valuesByAttribute };
};

const readEmittedAttributes = () =>
  new Set(
    librarySources
      .flatMap((file) => [...readStripped(file).matchAll(EMITTED_DATA_ATTRIBUTE)])
      .map((match) => match[1])
      .filter((name) => !IGNORED_ATTRIBUTES.has(name)),
  );

const readClasses = () => {
  const emitted = collect(librarySources, CLASS_IN_SOURCE);
  const styled = collect(componentStylesheets, CLASS_IN_CSS);
  const names = new Set([...emitted.keys(), ...publicUtilities]);
  const kindOf = (name) => {
    if (publicUtilities.has(name)) return "utility";
    return styled.has(name) ? "styled" : "hook";
  };
  return [...names].sort().map((name) => ({ name, kind: kindOf(name) }));
};

const splitBridge = (value) => {
  const bridge = value.match(/^var\((--[a-z0-9-]+),\s*([\s\S]+)\)$/);
  if (!bridge) return { bridge: null, fallback: value };
  return { bridge: bridge[1], fallback: bridge[2] };
};

const readDeclarations = (text) =>
  new Map(
    [...text.matchAll(TOKEN_DECLARATION)].map(([, name, value]) => [
      name,
      splitBridge(value.replace(/\s+/g, " ").trim()),
    ]),
  );

const readBaseTokens = () => {
  const text = readStripped(tokensFile);
  const darkStart = text.indexOf(":where(.dark");
  const light = readDeclarations(text.slice(0, darkStart));
  const dark = readDeclarations(text.slice(darkStart));
  return [...light].map(([name, value]) => ({
    name,
    bridge: value.bridge,
    light: value.fallback,
    dark: dark.get(name)?.fallback ?? value.fallback,
  }));
};

const readBalanced = (text, start) => {
  let depth = 1;
  let index = start;
  while (index < text.length && depth > 0) {
    if (text[index] === "(") depth += 1;
    if (text[index] === ")") depth -= 1;
    index += 1;
  }
  return text.slice(start, index - 1).replace(/\s+/g, " ").trim();
};

const stylesheetLabel = (file) => {
  const parts = path.relative(root, file).split(path.sep);
  return parts[1] === "components" ? parts[2] : path.basename(file, ".css");
};

const readTokenReads = () =>
  componentStylesheets.flatMap((file) => {
    const text = readStripped(file);
    return [...text.matchAll(/var\(\s*(--gdy-[a-z0-9-]+)\s*,/g)].map((match) => ({
      name: match[1],
      fallback: readBalanced(text, match.index + match[0].length),
      readBy: stylesheetLabel(file),
    }));
  });

const readComponentTokens = (baseNames) => {
  const internal = new Set(
    componentStylesheets.flatMap((file) =>
      [...readStripped(file).matchAll(TOKEN_DECLARATION)].map((match) => match[1]),
    ),
  );
  const tokens = new Map();
  const reads = readTokenReads().filter(
    ({ name }) => !baseNames.has(name) && !internal.has(name),
  );
  for (const { name, fallback, readBy } of reads) {
    if (!tokens.has(name)) tokens.set(name, { fallbacks: new Set(), readBy: new Set() });
    tokens.get(name).fallbacks.add(fallback);
    tokens.get(name).readBy.add(readBy);
  }
  return [...tokens].sort(([a], [b]) => a.localeCompare(b));
};

const TEXT = {
  en: {
    file: "docs/style-hooks.md",
    title: "Style hooks",
    languageSwitch: "[English](style-hooks.md) · [Español](style-hooks.es.md)",
    intro: [
      "Catalog of every class, state attribute and token the library ships. It is generated from the",
      "sources by `npm run docs:hooks` and checked by `npm run audit:styles`, so it always matches the",
      "stylesheets. How to use these hooks is explained in [Theming and styling](theming.md).",
    ],
    classes: "Classes",
    classesIntro: [
      "**Styled** classes have default rules. **Hook only** classes are written on purpose without",
      "styles so you can target them. **Utility** classes are meant to be passed through props.",
      "The state selectors column lists the attributes the stylesheets combine with each class.",
    ],
    groups: {
      table: "Table",
      kanban: "Kanban",
      ai: "AI assistant",
      auth: "Auth forms",
      "segmented-control": "Segmented control",
      "country-select": "Country select",
      "phone-input": "Phone input",
      ui: "Primitives",
      shared: "Shared layer and toolbar",
    },
    classHeader: "| Class | Kind | State selectors |",
    kinds: { styled: "styled", hook: "hook only", utility: "utility" },
    attributes: "State attributes",
    attributesIntro: [
      "Boolean attributes are present or absent; the others take the listed values. Attributes set by",
      "Radix or react-day-picker follow those libraries.",
    ],
    attributeHeader: "| Attribute | Values | Set by | Used with |",
    origins: {
      library: "Gridory",
      runtime: "Radix or react-day-picker",
      both: "Gridory, Radix or react-day-picker",
      host: "your app",
    },
    boolean: "present / absent",
    noRule: "no default rule",
    baseTokens: "Base tokens",
    baseIntro: [
      "Declared by the library with zero specificity. Each one reads the shadcn/ui variable in the",
      "bridge column first, when your app defines it.",
    ],
    baseHeader: "| Token | Bridge | Light | Dark |",
    componentTokens: "Component tokens",
    componentIntro: [
      "Never declared by the library: each one is read with the fallback shown, so declaring it on",
      "any ancestor overrides that part only. `--gdy-select-*` also mirror the `selectTheme` prop.",
    ],
    componentHeader: "| Token | Fallback | Read by |",
  },
  es: {
    file: "docs/style-hooks.es.md",
    title: "Ganchos de estilo",
    languageSwitch: "[English](style-hooks.md) · [Español](style-hooks.es.md)",
    intro: [
      "Catálogo de todas las clases, atributos de estado y tokens que trae la librería. Se genera desde",
      "el código con `npm run docs:hooks` y `npm run audit:styles` comprueba que esté al día, así que",
      "siempre coincide con las hojas de estilo. Cómo usarlos está en [Temas y estilos](theming.es.md).",
    ],
    classes: "Clases",
    classesIntro: [
      "Las clases **con estilos** tienen reglas por defecto. Las de **solo gancho** se escriben a",
      "propósito sin estilos para que puedas apuntarles. Las **utilidades** se pasan por props. La",
      "columna de selectores de estado lista los atributos con los que las hojas combinan cada clase.",
    ],
    groups: {
      table: "Tabla",
      kanban: "Kanban",
      ai: "Asistente de IA",
      auth: "Formularios de autenticación",
      "segmented-control": "Control segmentado",
      "country-select": "Selector de país",
      "phone-input": "Teléfono con prefijo",
      ui: "Primitivos",
      shared: "Capa compartida y toolbar",
    },
    classHeader: "| Clase | Tipo | Selectores de estado |",
    kinds: { styled: "con estilos", hook: "solo gancho", utility: "utilidad" },
    attributes: "Atributos de estado",
    attributesIntro: [
      "Los atributos booleanos están presentes o ausentes; el resto toma los valores listados. Los que",
      "ponen Radix o react-day-picker siguen a esas librerías.",
    ],
    attributeHeader: "| Atributo | Valores | Lo pone | Se usa con |",
    origins: {
      library: "Gridory",
      runtime: "Radix o react-day-picker",
      both: "Gridory, Radix o react-day-picker",
      host: "tu app",
    },
    boolean: "presente / ausente",
    noRule: "sin regla por defecto",
    baseTokens: "Tokens base",
    baseIntro: [
      "Los declara la librería con especificidad cero. Cada uno lee primero la variable de shadcn/ui",
      "de la columna puente, si tu app la define.",
    ],
    baseHeader: "| Token | Puente | Claro | Oscuro |",
    componentTokens: "Tokens de componente",
    componentIntro: [
      "La librería nunca los declara: cada uno se lee con el fallback indicado, así que declararlo en",
      "cualquier ancestro cambia solo esa parte. Los `--gdy-select-*` también reflejan la prop `selectTheme`.",
    ],
    componentHeader: "| Token | Fallback | Lo lee |",
  },
};

const code = (value) => `\`${value}\``;
const codeList = (values) => (values.length ? [...values].sort().map(code).join(", ") : "—");
const tableDivider = (header) => header.replace(/[^|]+/g, "---");

const renderClassGroups = (text, classes, selectorsByClass) =>
  GROUPS.flatMap((group) => {
    const members = classes.filter(
      ({ name }) => GROUPS.find((candidate) => candidate.match.test(name)) === group,
    );
    const rows = members.map(
      ({ name, kind }) =>
        `| ${code(name)} | ${text.kinds[kind]} | ${codeList([...(selectorsByClass.get(name) ?? [])])} |`,
    );
    return [`### ${text.groups[group.id]}`, "", text.classHeader, tableDivider(text.classHeader), ...rows, ""];
  });

const originOf = (name, emitted) => {
  if (allowlist.hostAttributes.includes(name)) return "host";
  if (!allowlist.runtimeAttributes.includes(name)) return "library";
  return emitted.has(name) ? "both" : "runtime";
};

const renderAttributeRow = (text, name, { selectors, emitted }) => {
  const values = [...(selectors.valuesByAttribute.get(name) ?? [])].map((value) => `"${value}"`);
  const classes = [...(selectors.classesByAttribute.get(name) ?? [])];
  const usedWith = classes.length ? codeList(classes) : text.noRule;
  const valueList = values.length ? codeList(values) : text.boolean;
  return `| ${code(name)} | ${valueList} | ${text.origins[originOf(name, emitted)]} | ${usedWith} |`;
};

const renderAttributes = (text, selectors, emitted) => {
  const names = [...new Set([...selectors.classesByAttribute.keys(), ...emitted])].sort();
  const rows = names.map((name) => renderAttributeRow(text, name, { selectors, emitted }));
  const section = { title: text.attributes, intro: text.attributesIntro, header: text.attributeHeader };
  return renderSection(section, rows);
};

const renderSection = ({ title, intro, header }, rows) => [
  `## ${title}`,
  "",
  ...intro,
  "",
  header,
  tableDivider(header),
  ...rows,
  "",
];

const renderTokens = (text, baseTokens, componentTokens) => [
  ...renderSection(
    { title: text.baseTokens, intro: text.baseIntro, header: text.baseHeader },
    baseTokens.map(
      ({ name, bridge, light, dark }) =>
        `| ${code(name)} | ${bridge ? code(bridge) : "—"} | ${code(light)} | ${code(dark)} |`,
    ),
  ),
  ...renderSection(
    { title: text.componentTokens, intro: text.componentIntro, header: text.componentHeader },
    componentTokens.map(
      ([name, { fallbacks, readBy }]) =>
        `| ${code(name)} | ${codeList([...fallbacks])} | ${[...readBy].sort().join(", ")} |`,
    ),
  ),
];

const renderCatalog = (text, model) =>
  [
    `# ${text.title}`,
    "",
    text.languageSwitch,
    "",
    ...text.intro,
    "",
    `## ${text.classes}`,
    "",
    ...text.classesIntro,
    "",
    ...renderClassGroups(text, model.classes, model.selectors.selectorsByClass),
    ...renderAttributes(text, model.selectors, model.emittedAttributes),
    ...renderTokens(text, model.baseTokens, model.componentTokens),
    "",
  ].join("\n");

const buildModel = () => {
  const baseTokens = readBaseTokens();
  return {
    classes: readClasses(),
    selectors: readStateSelectors(),
    emittedAttributes: readEmittedAttributes(),
    baseTokens,
    componentTokens: readComponentTokens(new Set(baseTokens.map((token) => token.name))),
  };
};

const syncCatalog = (text, model, checkOnly) => {
  const file = path.join(root, text.file);
  const content = renderCatalog(text, model);
  if (checkOnly) return existsSync(file) && readFileSync(file, "utf8") === content;
  writeFileSync(file, content);
  return true;
};

const checkOnly = process.argv.includes("--check");
const model = buildModel();
const stale = Object.values(TEXT).filter((text) => !syncCatalog(text, model, checkOnly));
if (stale.length > 0) {
  const files = stale.map((text) => text.file).join(", ");
  console.error(`style-catalog: ${files} out of date, run \`npm run docs:hooks\``);
  process.exit(1);
}
console.log(
  `style-catalog: ${checkOnly ? "up to date" : "written"} (${model.classes.length} classes, ${model.baseTokens.length} base tokens, ${model.componentTokens.length} component tokens)`,
);

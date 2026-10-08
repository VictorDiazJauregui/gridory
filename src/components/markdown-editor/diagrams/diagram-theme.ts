export interface DiagramTheme {
  key: string;
  variables: Record<string, string>;
  /** Width the diagrams that lay out to a width, such as Gantt charts, are drawn at. */
  width: number;
}

const WIDTH_STEP = 40;
const FIGURE_INSET = 32;
const MIN_DIAGRAM_WIDTH = 320;
const HIDDEN_PREVIEW_WIDTH = 640;

// A hidden preview, such as the closed tab on a phone, measures 0: the panels around it still tell the room it will get.
const readAvailableWidth = (previewRoot: HTMLElement): number =>
  previewRoot.clientWidth || previewRoot.closest<HTMLElement>(".gdy-md-panels")?.clientWidth || HIDDEN_PREVIEW_WIDTH;

const COLOR_TOKENS = {
  background: ["--gdy-md-diagram-background", "--gdy-background"],
  node: ["--gdy-md-diagram-node", "--gdy-muted"],
  border: ["--gdy-md-diagram-border", "--gdy-ring"],
  line: ["--gdy-md-diagram-line", "--gdy-muted-foreground"],
  text: ["--gdy-md-diagram-text", "--gdy-foreground"],
  accent: ["--gdy-md-diagram-accent", "--gdy-accent"],
  active: ["--gdy-md-diagram-active", "--gdy-primary"],
} as const;

const ACTIVE_TASK_TINT = 0.3;

type DiagramColors = Record<keyof typeof COLOR_TOKENS, string>;

const readToken = (style: CSSStyleDeclaration, names: readonly string[]): string =>
  names.map((name) => style.getPropertyValue(name).trim()).find(Boolean) ?? "";

const toHexChannel = (channel: number): string => channel.toString(16).padStart(2, "0");

const createColorConverter = () => {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  return (color: string): string => {
    if (!context || !color) return color;
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`;
  };
};

const readHexChannels = (hex: string): number[] => [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));

const mixHexColors = (tint: string, base: string, tintWeight: number): string => {
  const baseChannels = readHexChannels(base);
  const mixed = readHexChannels(tint).map((channel, index) => Math.round(channel * tintWeight + baseChannels[index] * (1 - tintWeight)));
  return `#${mixed.map(toHexChannel).join("")}`;
};

// Mermaid derives task colors on its own and can put light text on a light bar: every task text takes the text color instead.
const toGanttVariables = (colors: DiagramColors): Record<string, string> => ({
  taskBkgColor: colors.node,
  taskBorderColor: colors.border,
  activeTaskBkgColor: mixHexColors(colors.active, colors.background, ACTIVE_TASK_TINT),
  activeTaskBorderColor: colors.active,
  doneTaskBkgColor: colors.background,
  doneTaskBorderColor: colors.line,
  gridColor: colors.border,
  taskTextColor: colors.text,
  taskTextLightColor: colors.text,
  taskTextDarkColor: colors.text,
  taskTextOutsideColor: colors.text,
  taskTextClickableColor: colors.text,
});

const toMermaidVariables = (colors: DiagramColors, fontFamily: string): Record<string, string> => ({
  ...toGanttVariables(colors),
  background: colors.background,
  fontFamily,
  primaryColor: colors.node,
  primaryTextColor: colors.text,
  primaryBorderColor: colors.border,
  secondaryColor: colors.accent,
  tertiaryColor: colors.background,
  lineColor: colors.line,
  textColor: colors.text,
  titleColor: colors.text,
  edgeLabelBackground: colors.background,
  noteBkgColor: colors.accent,
  noteTextColor: colors.text,
});

export const readDiagramTheme = (previewRoot: HTMLElement): DiagramTheme => {
  const style = getComputedStyle(previewRoot);
  const convert = createColorConverter();
  const entries = Object.entries(COLOR_TOKENS).map(([part, names]) => [part, convert(readToken(style, names))]);
  const variables = toMermaidVariables(Object.fromEntries(entries) as DiagramColors, style.fontFamily);
  const width = Math.max(MIN_DIAGRAM_WIDTH, Math.floor((readAvailableWidth(previewRoot) - FIGURE_INSET) / WIDTH_STEP) * WIDTH_STEP);
  return { key: JSON.stringify({ variables, width }), variables, width };
};

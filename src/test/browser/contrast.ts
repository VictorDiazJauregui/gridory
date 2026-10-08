type Rgba = [number, number, number, number];

const toRgba = (color: string): Rgba => {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("The browser test needs a 2D canvas to read colors");
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  return [red, green, blue, alpha / 255];
};

const blend = (top: Rgba, bottom: Rgba): Rgba => [0, 1, 2].map((index) => top[index] * top[3] + bottom[index] * (1 - top[3])).concat(1) as Rgba;

const readLuminance = ([red, green, blue]: Rgba): number => {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
};

const readBackgroundLayers = (element: Element): Rgba[] => {
  const layers: Rgba[] = [];
  for (let current: Element | null = element; current; current = current.parentElement) {
    const layer = toRgba(getComputedStyle(current).backgroundColor);
    if (layer[3] > 0) layers.unshift(layer);
    if (layer[3] === 1) break;
  }
  return layers;
};

const readEffectiveBackground = (element: Element): Rgba =>
  readBackgroundLayers(element).reduce((below, layer) => blend(layer, below), [255, 255, 255, 1] as Rgba);

const measureContrast = (foreground: Rgba, background: Rgba): number => {
  const text = readLuminance(blend(foreground, background));
  const behind = readLuminance(background);
  return (Math.max(text, behind) + 0.05) / (Math.min(text, behind) + 0.05);
};

/** WCAG contrast ratio between the text color of an element and what is painted behind it. */
export const readContrastRatio = (element: Element): number =>
  measureContrast(toRgba(getComputedStyle(element).color), readEffectiveBackground(element));

/** WCAG contrast ratio between two opaque CSS colors, such as an SVG text fill and the shape under it. */
export const readColorContrast = (foreground: string, background: string): number =>
  measureContrast(toRgba(foreground), toRgba(background));

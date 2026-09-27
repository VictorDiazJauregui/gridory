const TEMPLATE_MARK = /\{(\w+)\}/g;

/** Replaces each `{name}` mark with its value; a mark without a value stays as written. */
export const fillTextTemplate = (template: string, values: Record<string, string | number>): string =>
  template.replace(TEMPLATE_MARK, (mark, name: string) =>
    Object.hasOwn(values, name) ? String(values[name]) : mark,
  );

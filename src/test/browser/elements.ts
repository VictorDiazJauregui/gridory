export class MissingElementError extends Error {
  constructor(selector: string) {
    super(`No element matches "${selector}"`);
    this.name = "MissingElementError";
  }
}

// Browser tests measure a specific part of a component; failing loudly here
// beats a null reaching getComputedStyle with a vaguer message.
export const findRequiredElement = (root: ParentNode, selector: string): Element => {
  const element = root.querySelector(selector);
  if (!element) throw new MissingElementError(selector);
  return element;
};

/** Only `data-*` and `aria-*`, so consumers never override the element's handlers, class or own attributes. */
export type ConsumerAttributes = Partial<
  Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>
>;

type ConsumerAttributeValue = ConsumerAttributes[keyof ConsumerAttributes];

const CONSUMER_ATTRIBUTE_PREFIXES = ["data-", "aria-"];

const isAllowedAttribute = (name: string, reservedNames: readonly string[]) =>
  CONSUMER_ATTRIBUTE_PREFIXES.some((prefix) => name.startsWith(prefix)) && !reservedNames.includes(name);

// In ARIA `false` is a state ("aria-selected=false"); on a data hook it means "absent".
const isRenderedValue = (name: string, value: ConsumerAttributeValue) => {
  if (value === undefined) return false;
  return value !== false || name.startsWith("aria-");
};

/** Keeps the allowed attributes as strings; `reservedNames` are the ones the component writes. */
export const pickConsumerAttributes = (
  attributes: ConsumerAttributes | undefined,
  reservedNames: readonly string[],
) =>
  Object.fromEntries(
    Object.entries(attributes ?? {})
      .filter(([name, value]) => isAllowedAttribute(name, reservedNames) && isRenderedValue(name, value))
      .map(([name, value]) => [name, String(value)]),
  );

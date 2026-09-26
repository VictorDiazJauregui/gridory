export class DuplicateAuthFieldError extends Error {
  constructor(fieldName: string) {
    super(
      `Auth field name "${fieldName}" is used twice. ` +
        "Built-in field names and extra field names must be unique.",
    );
    this.name = "DuplicateAuthFieldError";
  }
}

export class UnknownAuthFieldError extends Error {
  constructor(fieldName: string) {
    super(
      `fieldOrder lists "${fieldName}", but the form has no field with that name.`,
    );
    this.name = "UnknownAuthFieldError";
  }
}

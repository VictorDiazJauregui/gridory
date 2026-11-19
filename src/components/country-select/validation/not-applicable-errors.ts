export class InvalidNotApplicableValueError extends Error {
  constructor(notApplicableValue: string) {
    super(
      `notApplicableValue "${notApplicableValue}" is a country code. ` +
        "The not applicable answer could not be told apart from that country.",
    );
    this.name = "InvalidNotApplicableValueError";
  }
}

export class InvalidSelectionRangeError extends Error {
  constructor(minSelected: number, maxSelected: number) {
    super(
      `minSelected (${minSelected}) is greater than maxSelected (${maxSelected}). ` +
        "The smallest selection cannot exceed the largest one.",
    );
    this.name = "InvalidSelectionRangeError";
  }
}

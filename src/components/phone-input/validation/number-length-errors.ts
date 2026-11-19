export class InvalidMaxNumberLengthError extends Error {
  constructor(maxNumberLength: number) {
    super(`maxNumberLength (${maxNumberLength}) must be a whole number from 1.`);
    this.name = "InvalidMaxNumberLengthError";
  }
}

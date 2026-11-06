export declare class SplitStylesheetsError extends Error {
  constructor(message: string);
}
export declare const stripViteMarker: (bundle: string) => string;
export declare const joinSplitStylesheets: (sheets: string[]) => string;
export declare const findFirstDifference: (expected: string, actual: string) => number;

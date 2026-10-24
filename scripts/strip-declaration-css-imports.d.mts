export declare class CssImportLeftError extends Error {
  constructor(files: string[]);
}
export declare const stripCssImports: (source: string) => string;
export declare const hasCssImport: (source: string) => boolean;

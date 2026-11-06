export interface SplitStylesheet {
  fileName: string;
  source: string;
}
export declare const BASE_STYLESHEET: SplitStylesheet;
export declare const MODULE_NAMES: string[];
export declare const SPLIT_STYLESHEETS: SplitStylesheet[];
export declare class UnsupportedCssTargetError extends Error {
  constructor(target: string);
}
export declare const toLightningcssTargets: (
  cssTarget: string | string[] | false,
) => Record<string, number> | undefined;

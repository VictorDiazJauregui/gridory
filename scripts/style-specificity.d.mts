export type Specificity = [number, number, number];
export declare const splitSelectorList: (list: string) => string[];
export declare const computeSpecificity: (selector: string) => Specificity;
export declare const formatSpecificity: (specificity: Specificity) => string;
export declare const readRuleSelectors: (css: string) => string[];
export declare const listCompoundRules: (css: string) => Array<{ selector: string; specificity: string }>;

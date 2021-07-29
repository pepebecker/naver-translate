import type { Options as UtilsOptions } from './utils';
export interface Options extends UtilsOptions {
    enko?: boolean;
}
export declare const searchStem: (query: string) => Promise<string | undefined>;
export declare const searchMeanings: (query: string, o?: Options | undefined) => Promise<import("./types/meaning-entry").MeaningEntry[]>;
export declare const searchExamples: (query: string, o?: Options | undefined) => Promise<import("./types/example-entry").ExampleEntry[]>;
export declare const searchWordExamples: (query: string, o?: Options | undefined) => Promise<{
    ko: string | undefined;
    en: string | undefined;
}[][]>;
export declare const searchCombinedExamples: (query: string, o?: Options | undefined) => Promise<import("./types/example-entry").ExampleEntry[]>;

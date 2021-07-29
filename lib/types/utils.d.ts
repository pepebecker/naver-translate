import { ExampleEntry } from './types/example-entry';
import { MeaningEntry } from './types/meaning-entry';
import type { SearchResult } from './types/search-result';
import { WordEntry } from './types/word-entry';
export declare const trimEmptyValues: (text?: string | undefined) => string | undefined;
export declare const stripLinks: (text?: string | undefined) => string | undefined;
export declare const stripTags: (text?: string | undefined) => string | undefined;
export declare const stripAlts: (text?: string | undefined) => string | undefined;
export declare const stripHtml: (text?: string | undefined) => string | undefined;
export interface Options {
    fetchExtraData?: boolean;
    strip?: boolean;
}
export declare const getWordData: (data: SearchResult) => {
    items: import("./types/word-item").WordItem[];
} | undefined;
export declare const getMeaningData: (data: SearchResult) => {
    items: import("./types/word-item").WordItem[];
} | undefined;
export declare const getExampleData: (data: SearchResult) => {
    items: {
        expExample1: string;
        expExample2: string;
    }[];
} | undefined;
export declare const getWordEntries: (data: SearchResult, o?: Options | undefined) => Promise<WordEntry[]>;
export declare const getMeanings: (data: SearchResult, o?: Options | undefined) => Promise<MeaningEntry[]>;
export declare const getWordExamples: (data: SearchResult, o?: Options | undefined) => Promise<{
    ko: string | undefined;
    en: string | undefined;
}[][]>;
export declare const getMeaningExamples: (data: SearchResult) => ExampleEntry[][];
export declare const getExamples: (data: SearchResult) => ExampleEntry[];
export declare const getCombinedExamples: (data: SearchResult, o?: Options | undefined) => Promise<ExampleEntry[]>;
export declare const getSteam: (data: SearchResult) => string | undefined;

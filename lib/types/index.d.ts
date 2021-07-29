import { Config } from 'papago';
import { ExampleEntry } from './types/example-entry';
import { MeaningEntry } from './types/meaning-entry';
export declare const configurePapago: (config: Config) => void;
export declare const lookupStem: (query: string) => Promise<string | undefined>;
export declare const lookupMeanings: (query: string, { enko, google, strip }?: {
    enko?: boolean | undefined;
    google?: boolean | undefined;
    strip?: boolean | undefined;
}) => Promise<MeaningEntry[]>;
export declare const lookupExamples: (query: string, { google, strip }?: {
    google?: boolean | undefined;
    strip?: boolean | undefined;
}) => Promise<ExampleEntry[]>;
export declare const lookupWordExamples: (query: string, { enko, google, strip }?: {
    enko?: boolean | undefined;
    google?: boolean | undefined;
    strip?: boolean | undefined;
}) => Promise<ExampleEntry[][]>;
export declare const lookupCombinedExamples: (query: string, { google, strip }?: {
    google?: boolean | undefined;
    strip?: boolean | undefined;
}) => Promise<ExampleEntry[]>;
export declare const lookup: (query: string, { enko, google, strip }?: {
    enko?: boolean | undefined;
    google?: boolean | undefined;
    strip?: boolean | undefined;
}) => Promise<{
    query: string;
    stem: string | undefined;
    meanings: MeaningEntry[];
    examples: ExampleEntry[];
}>;
declare const _default: {
    lookupStem: (query: string) => Promise<string | undefined>;
    lookupMeanings: (query: string, { enko, google, strip }?: {
        enko?: boolean | undefined;
        google?: boolean | undefined;
        strip?: boolean | undefined;
    }) => Promise<MeaningEntry[]>;
    lookupExamples: (query: string, { google, strip }?: {
        google?: boolean | undefined;
        strip?: boolean | undefined;
    }) => Promise<ExampleEntry[]>;
    lookupWordExamples: (query: string, { enko, google, strip }?: {
        enko?: boolean | undefined;
        google?: boolean | undefined;
        strip?: boolean | undefined;
    }) => Promise<ExampleEntry[][]>;
    lookupCombinedExamples: (query: string, { google, strip }?: {
        google?: boolean | undefined;
        strip?: boolean | undefined;
    }) => Promise<ExampleEntry[]>;
    lookup: (query: string, { enko, google, strip }?: {
        enko?: boolean | undefined;
        google?: boolean | undefined;
        strip?: boolean | undefined;
    }) => Promise<{
        query: string;
        stem: string | undefined;
        meanings: MeaningEntry[];
        examples: ExampleEntry[];
    }>;
};
export default _default;

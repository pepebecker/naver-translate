declare type SrcDest = 'enko' | 'koen' | 'koko' | boolean;
export declare const fetchEntry: (entryId: string, srcDest?: SrcDest) => Promise<any>;
export declare const search: (query: string, srcDest?: SrcDest) => Promise<any>;
export {};

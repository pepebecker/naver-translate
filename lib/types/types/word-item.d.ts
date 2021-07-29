export interface WordItem {
    entryId: string;
    expEntry: string;
    meansCollector: [
        {
            partOfSpeech?: string;
            partOfSpeech2: string;
            means: {
                value?: string;
                exampleOri?: string;
                exampleTrans?: string;
            }[];
        }
    ];
    searchPhoneticSymbolList: any[];
}

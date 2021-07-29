export interface WordEntry {
    entryId: string;
    means: {
        value?: string;
        exampleOri?: string;
        exampleTrans?: string;
    }[];
    partOfSpeech?: string;
    partOfSpeech2?: string;
    origin?: string;
    phonetics?: {
        type?: string;
        value?: string;
        audio?: string;
    }[];
}

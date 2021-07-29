export interface MeaningEntry {
  means: string[];
  partOfSpeech?: string;
  partOfSpeech2?: string;
  origin?: string;
  phonetics?: {
    type?: string;
    value?: string;
    audio?: string;
  }[];
}

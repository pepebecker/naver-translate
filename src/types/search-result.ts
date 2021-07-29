import { WordItem } from './word-item';

export interface SearchResult {
  searchResultMap?: {
    searchResultListMap?: {
      WORD: {
        items: WordItem[];
      };
      MEANING: {
        items: WordItem[];
      };
      EXAMPLE: {
        items: {
          expExample1: string;
          expExample2: string;
        }[];
      };
    };
  };
  recommendEntry: {
    revert: string;
  };
}

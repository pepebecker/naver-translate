import googleTranslate from '@vitalets/google-translate-api';
import Papago, { Config } from 'papago';

import { search } from './api';
import * as dict from './dict';
import { ExampleEntry } from './types/example-entry';
import { MeaningEntry } from './types/meaning-entry';
import { WordItem } from './types/word-item';
import {
  getCombinedExamples,
  getMeanings,
  getSteam,
  stripAlts,
  stripHtml,
} from './utils';

let papago = null as Papago | null;

export const configurePapago = (config: Config) => {
  papago = new Papago(config);
};

const gTranslate = async (query: string, enko = false) => {
  const options = {
    from: enko ? 'en' : 'ko',
    to: enko ? 'ko' : 'en',
  };
  const result = await googleTranslate(query, options);
  return result.text;
};

const translate = async (query: string, enko = false, google = false): Promise<string> => {
  if (google || !papago?.isConfigured()) return gTranslate(query, enko);
  try {
    return await papago?.translate(query, enko);
  } catch (error) {
    if (error.request?.res?.statusCode === 429) {
      return gTranslate(query, enko);
    }
    throw error;
  }
};

const translateExamples = async (examples: ExampleEntry[], google = false, strip = false): Promise<ExampleEntry[]> => {
  return Promise.all(examples.map(async (ex) => {
    const strippedKo = (strip || !ex.en) ? stripHtml(ex.ko) : undefined;
    const en = (strip ? stripHtml(ex.en) : ex.en);
    return {
      ko: stripAlts(strip && strippedKo || ex.ko),
      en: en || await translate(stripAlts(strippedKo) || '', false, google),
    };
  }));
};

const getMeaningsWithFallback = async (meanings: MeaningEntry[], query: string, { enko = false, google = false } = {}): Promise<MeaningEntry[]> => {
  if (meanings?.length) {
    return meanings;
  } else {
    return [
      {
        partOfSpeech: undefined,
        partOfSpeech2: undefined,
        means: [await translate(query, enko, google)]
      }
    ];
  }
};

export const lookupStem = (query: string) => {
  return dict.searchStem(query);
};

export const lookupMeanings = async (query: string, { enko = false, google = false, strip = false } = {}) => {
  const meanings = await dict.searchMeanings(query, { enko, strip, fetchExtraData: true });
  return getMeaningsWithFallback(meanings, query, { enko, google });
};

export const lookupExamples = async (query: string, { google = false, strip = false } = {}) => {
  const examples = await dict.searchExamples(query);
  return translateExamples(examples, google, strip);
};

export const lookupWordExamples = async (query: string, { enko = false, google = false, strip = false } = {}) => {
  const wordExamples = await dict.searchWordExamples(query, { enko, strip });
  return Promise.all(wordExamples.map(list => {
    return translateExamples(list, google, strip);
  }));
};

export const lookupCombinedExamples = async (query: string, { google = false, strip = false } = {}) => {
  const examples = await dict.searchCombinedExamples(query);
  return translateExamples(examples, google, strip);
};

export const lookup = async (query: string, { enko = false, google = false, strip = false } = {}) => {
  const result = await search(query, enko);
  const meanings = await getMeanings(result, { fetchExtraData: true, strip });
  const combinedExamples = await getCombinedExamples(result, { fetchExtraData: true, strip });
  const [meaningsWithFallback, examples] = await Promise.all([
    getMeaningsWithFallback(meanings, query, { enko, google }),
    translateExamples(combinedExamples, google, strip),
  ]);
  return {
    query,
    stem: getSteam(result),
    meanings: meaningsWithFallback,
    examples
  };
};

export default {
  lookupStem,
  lookupMeanings,
  lookupExamples,
  lookupWordExamples,
  lookupCombinedExamples,
  lookup,
};

import { fetchEntry } from './api';
import { ExampleEntry } from './types/example-entry';
import { MeaningEntry } from './types/meaning-entry';
import type { SearchResult } from './types/search-result';
import { WordEntry } from './types/word-entry';

const supRe = /<sup[^>]*>.*?<\/sup>/gi;
const linkRe = /\(?[→↔]?<a[^>]*>.*?<\/a>\)?/gi;
const tagsRe = /<([^>]+)>/gi;
const altsRe = /\[[^\]]*\]/gi;
const htmlRe = new RegExp(
  `${supRe.source}|${linkRe.source}|${tagsRe.source}`,
  'gi'
);

export const trimEmptyValues = (text?: string) => {
  return text
    ?.split(',')
    .map((v) => v?.trim())
    .filter(Boolean)
    .join(', ');
};

export const stripLinks = (text?: string) => {
  return trimEmptyValues(text?.replace(linkRe, ''));
};

export const stripTags = (text?: string) => {
  return trimEmptyValues(text?.replace(tagsRe, ''));
};

export const stripAlts = (text?: string) => {
  return trimEmptyValues(text?.replace(altsRe, ''));
};

export const stripHtml = (text?: string) => {
  return trimEmptyValues(text?.replace(htmlRe, ''));
};

export interface Options {
  fetchExtraData?: boolean;
  strip?: boolean;
}

export const getWordData = (data: SearchResult) => {
  return data?.searchResultMap?.searchResultListMap?.WORD;
};

export const getMeaningData = (data: SearchResult) => {
  return data?.searchResultMap?.searchResultListMap?.MEANING;
};

export const getExampleData = (data: SearchResult) => {
  return data?.searchResultMap?.searchResultListMap?.EXAMPLE;
};

export const getWordEntries = async (
  data: SearchResult,
  o?: Options
): Promise<WordEntry[]> => {
  const items = getWordData(data)?.items;
  if (!items || items.length <= 0) return [];
  const results = await Promise.all(
    items
      .filter((item) => item.matchType === 'exact:entry')
      .map(async (item) => {
        const collection = item?.meansCollector[0];
        const result: WordEntry = {
          entryId: item.entryId,
          partOfSpeech: collection.partOfSpeech,
          partOfSpeech2: collection.partOfSpeech2,
          means: collection.means.map((mean) => ({
            value: o?.strip ? stripHtml(mean.value) : stripLinks(mean.value),
            exampleOri: o?.strip
              ? stripHtml(mean.exampleOri)
              : stripLinks(mean.exampleOri),
            exampleTrans: o?.strip
              ? stripHtml(mean.exampleTrans)
              : stripLinks(mean.exampleTrans),
          })),
          phonetics: item.searchPhoneticSymbolList
            ?.map((p) => ({
              type: p.symbolType,
              value: o?.strip ? stripHtml(p.symbolValue) : p.symbolValue,
              audio: p.symbolFile,
            }))
            .filter((p) => p.audio),
          origin: undefined,
        };
        if (o?.fetchExtraData) {
          const extraData = await fetchEntry(item.entryId);
          const origins = extraData?.entry?.members?.map((m: any) => m?.origin_language);
          result.origin = origins?.filter(Boolean).join('|') || null;
        }
        return result;
      })
  );
  return results.filter((r) => r?.means?.length);
};

export const getMeanings = async (
  data: SearchResult,
  o?: Options
): Promise<MeaningEntry[]> => {
  const wordEntries = await getWordEntries(data, o);
  const matches = {} as { [key: string]: boolean };
  return (
    wordEntries
      .map((entry) => {
        const means = entry.means.map((m) => {
          let t = m.value;
          // Remove "(...)", "[...]", "a ", "an ", "It's"
          t = t?.replace(/\([^()]*\)|\[[^[\]]*\]|^an?\s|\.$/gi, '');
          t = t?.replace(/\s+/g, ' ');
          return t
            ?.split(/[;,] /)
            .map((m) => m.trim())
            .filter((m) => /[A-Za-z]/.test(m));
        });
        return {
          means: [...new Set(means.flat())].filter(Boolean),
          partOfSpeech: entry.partOfSpeech,
          partOfSpeech2: entry.partOfSpeech2,
          origin: entry.origin?.replace(/\([^()]*\)|\[[^[\]]*\]/g, ''),
          phonetics: entry.phonetics,
        } as MeaningEntry;
      })
      // Remove empty meanings
      .filter((entry) => entry.means?.length)
      // Remove duplicate meanings
      .reduce((acc, val) => {
        const means = val.means.filter((m) => {
          if (matches[m]) return false;
          matches[m] = true;
          matches['beeing ' + m] = true;
          matches[m.replace('being ', '')] = true;
          return true;
        });
        if (means?.length > 0) {
          return [...acc, { ...val, means }];
        }
        return acc;
      }, [] as MeaningEntry[])
      .reduce((acc, v, i) => {
        const p = acc[i - 1];
        if (p?.means.includes(v.means[0]) || v.means.includes(p?.means[0])) {
          if (!p.origin && v.origin) return [...acc.splice(0, -1), v];
          if (p.origin && !v.origin) return acc;
          // Compare origins
          if (p.origin && v.origin) {
            if (!v.origin.includes(p.origin) && !p.origin.includes(v.origin)) {
              return [...acc, v]; // Return both if origin differs
            }
          }
          // Compare parts of speech
          if (!p.partOfSpeech && v.partOfSpeech)
            return [...acc.splice(0, -1), v];
          if (p.partOfSpeech && !v.partOfSpeech) return acc;
          return [...acc, v];
        } else {
          return [...acc, v];
        }
      }, [] as MeaningEntry[])
  );
};

export const getWordExamples = async (data: SearchResult, o?: Options) => {
  const wordEntries = await getWordEntries(data, o);
  return wordEntries?.map((entry) => {
    return entry?.means
      ?.map((mean) => {
        return {
          ko: mean.exampleOri,
          en: mean.exampleTrans,
        };
      })
      .filter((ex) => ex.ko || ex.en);
  });
};

export const getMeaningExamples = (data: SearchResult): ExampleEntry[][] => {
  const meaningData = getMeaningData(data);
  return (
    meaningData?.items
      ?.map((entry) => {
        return entry.meansCollector[0]?.means
          ?.map((mean) => {
            return {
              ko: mean.value,
              en: entry.expEntry,
            };
          })
          .filter((ex) => ex.ko || ex.en);
      })
      ?.filter(Boolean) || []
  );
};

export const getExamples = (data: SearchResult): ExampleEntry[] => {
  const exampleData = getExampleData(data);
  if (!exampleData?.items || exampleData.items.length <= 0) return [];
  return exampleData.items.map((ex) => ({
    en: ex.expExample2 ? ex.expExample1 : undefined,
    ko: ex.expExample2 || ex.expExample1,
  }));
};

export const getCombinedExamples = async (data: SearchResult, o?: Options) => {
  const wordExamples = await getWordExamples(data, o);
  const examples = getExamples(data);
  return [...wordExamples.flat(), ...examples];
};

export const getSteam = (data: SearchResult) => {
  const revert = data?.recommendEntry?.revert;
  if (revert) return revert;
  const wordItem = data.searchResultMap?.searchResultListMap?.WORD.items[0];
  return stripTags(wordItem?.expEntry);
};

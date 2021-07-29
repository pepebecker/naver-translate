import { search } from './api';
import {
  getSteam,
  getMeanings,
  getWordExamples,
  getExamples,
  getCombinedExamples,
} from './utils';
import type { Options as UtilsOptions } from './utils';

export interface Options extends UtilsOptions {
  enko?: boolean;
}

export const searchStem = async (query: string) => {
  const result = await search(query);
  return getSteam(result);
};

export const searchMeanings = async (query: string, o?: Options) => {
  const result = await search(query, o?.enko);
  return getMeanings(result, o);
};

export const searchExamples = async (query: string, o?: Options) => {
  const result = await search(query, o?.enko);
  return getExamples(result);
};

export const searchWordExamples = async (query: string, o?: Options) => {
  const result = await search(query, o?.enko);
  return getWordExamples(result, o);
};

export const searchCombinedExamples = async (query: string, o?: Options) => {
  const result = await search(query, o?.enko);
  return getCombinedExamples(result, o);
};

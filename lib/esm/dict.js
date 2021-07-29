import { search } from './api';
import { getSteam, getMeanings, getWordExamples, getExamples, getCombinedExamples, } from './utils';
export const searchStem = async (query) => {
    const result = await search(query);
    return getSteam(result);
};
export const searchMeanings = async (query, o) => {
    const result = await search(query, o === null || o === void 0 ? void 0 : o.enko);
    return getMeanings(result, o);
};
export const searchExamples = async (query, o) => {
    const result = await search(query, o === null || o === void 0 ? void 0 : o.enko);
    return getExamples(result);
};
export const searchWordExamples = async (query, o) => {
    const result = await search(query, o === null || o === void 0 ? void 0 : o.enko);
    return getWordExamples(result, o);
};
export const searchCombinedExamples = async (query, o) => {
    const result = await search(query, o === null || o === void 0 ? void 0 : o.enko);
    return getCombinedExamples(result, o);
};

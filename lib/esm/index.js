import googleTranslate from '@vitalets/google-translate-api';
import Papago from 'papago';
import { search } from './api';
import * as dict from './dict';
import { getCombinedExamples, getMeanings, getSteam, stripAlts, stripHtml, } from './utils';
let papago = null;
export const configurePapago = (config) => {
    papago = new Papago(config);
};
const formatTranslation = (text) => {
    if (!text)
        return text;
    if (text[text.length - 1] === '.') {
        text = text.slice(0, -1);
        text = text[0].toLowerCase() + text.slice(1);
    }
    return text;
};
const gTranslate = async (query, enko = false) => {
    const options = {
        from: enko ? 'en' : 'ko',
        to: enko ? 'ko' : 'en',
    };
    const result = await googleTranslate(query, options);
    return formatTranslation(result.text);
};
const translate = async (query, enko = false, google = false) => {
    var _a, _b;
    if (google || !(papago === null || papago === void 0 ? void 0 : papago.isConfigured()))
        return gTranslate(query, enko);
    try {
        return formatTranslation(await (papago === null || papago === void 0 ? void 0 : papago.translate(query, enko)));
    }
    catch (error) {
        if (((_b = (_a = error.request) === null || _a === void 0 ? void 0 : _a.res) === null || _b === void 0 ? void 0 : _b.statusCode) === 429) {
            return gTranslate(query, enko);
        }
        throw error;
    }
};
const translateExamples = async (examples, google = false, strip = false) => {
    return Promise.all(examples.map(async (ex) => {
        const strippedKo = strip || !ex.en ? stripHtml(ex.ko) : undefined;
        const en = strip ? stripHtml(ex.en) : ex.en;
        return {
            ko: stripAlts((strip && strippedKo) || ex.ko),
            en: en || (await translate(stripAlts(strippedKo) || '', false, google)),
        };
    }));
};
const getMeaningsWithFallback = async (meanings, query, { enko = false, google = false } = {}) => {
    if (meanings === null || meanings === void 0 ? void 0 : meanings.length) {
        return meanings;
    }
    else {
        return [
            {
                partOfSpeech: undefined,
                partOfSpeech2: undefined,
                means: [await translate(query, enko, google)],
            },
        ];
    }
};
export const lookupStem = (query) => {
    return dict.searchStem(query);
};
export const lookupMeanings = async (query, { enko = false, google = false, strip = false } = {}) => {
    const meanings = await dict.searchMeanings(query, {
        enko,
        strip,
        fetchExtraData: true,
    });
    return getMeaningsWithFallback(meanings, query, { enko, google });
};
export const lookupExamples = async (query, { google = false, strip = false } = {}) => {
    const examples = await dict.searchExamples(query);
    return translateExamples(examples, google, strip);
};
export const lookupWordExamples = async (query, { enko = false, google = false, strip = false } = {}) => {
    const wordExamples = await dict.searchWordExamples(query, { enko, strip });
    return Promise.all(wordExamples.map((list) => {
        return translateExamples(list, google, strip);
    }));
};
export const lookupCombinedExamples = async (query, { google = false, strip = false } = {}) => {
    const examples = await dict.searchCombinedExamples(query);
    return translateExamples(examples, google, strip);
};
export const lookup = async (query, { enko = false, google = false, strip = false } = {}) => {
    const result = await search(query, enko);
    const meanings = await getMeanings(result, { fetchExtraData: true, strip });
    const combinedExamples = await getCombinedExamples(result, {
        fetchExtraData: true,
        strip,
    });
    const [meaningsWithFallback, examples] = await Promise.all([
        getMeaningsWithFallback(meanings, query, { enko, google }),
        translateExamples(combinedExamples, google, strip),
    ]);
    return {
        query,
        stem: getSteam(result),
        meanings: meaningsWithFallback,
        examples,
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

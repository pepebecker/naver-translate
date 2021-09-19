"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = exports.lookupCombinedExamples = exports.lookupWordExamples = exports.lookupExamples = exports.lookupMeanings = exports.lookupStem = exports.configurePapago = void 0;
const google_translate_api_1 = __importDefault(require("@vitalets/google-translate-api"));
const papago_1 = __importDefault(require("papago"));
const api_1 = require("./api");
const dict = __importStar(require("./dict"));
const utils_1 = require("./utils");
let papago = null;
const configurePapago = (config) => {
    papago = new papago_1.default(config);
};
exports.configurePapago = configurePapago;
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
    const result = await google_translate_api_1.default(query, options);
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
        const strippedKo = strip || !ex.en ? utils_1.stripHtml(ex.ko) : undefined;
        const en = strip ? utils_1.stripHtml(ex.en) : ex.en;
        return {
            ko: utils_1.stripAlts((strip && strippedKo) || ex.ko),
            en: en || (await translate(utils_1.stripAlts(strippedKo) || '', false, google)),
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
const lookupStem = (query) => {
    return dict.searchStem(query);
};
exports.lookupStem = lookupStem;
const lookupMeanings = async (query, { enko = false, google = false, strip = false } = {}) => {
    const meanings = await dict.searchMeanings(query, {
        enko,
        strip,
        fetchExtraData: true,
    });
    return getMeaningsWithFallback(meanings, query, { enko, google });
};
exports.lookupMeanings = lookupMeanings;
const lookupExamples = async (query, { google = false, strip = false } = {}) => {
    const examples = await dict.searchExamples(query);
    return translateExamples(examples, google, strip);
};
exports.lookupExamples = lookupExamples;
const lookupWordExamples = async (query, { enko = false, google = false, strip = false } = {}) => {
    const wordExamples = await dict.searchWordExamples(query, { enko, strip });
    return Promise.all(wordExamples.map((list) => {
        return translateExamples(list, google, strip);
    }));
};
exports.lookupWordExamples = lookupWordExamples;
const lookupCombinedExamples = async (query, { google = false, strip = false } = {}) => {
    const examples = await dict.searchCombinedExamples(query);
    return translateExamples(examples, google, strip);
};
exports.lookupCombinedExamples = lookupCombinedExamples;
const lookup = async (query, { enko = false, google = false, strip = false } = {}) => {
    const result = await api_1.search(query, enko);
    const meanings = await utils_1.getMeanings(result, { fetchExtraData: true, strip });
    const combinedExamples = await utils_1.getCombinedExamples(result, {
        fetchExtraData: true,
        strip,
    });
    const [meaningsWithFallback, examples] = await Promise.all([
        getMeaningsWithFallback(meanings, query, { enko, google }),
        translateExamples(combinedExamples, google, strip),
    ]);
    return {
        query,
        stem: utils_1.getSteam(result),
        meanings: meaningsWithFallback,
        examples,
    };
};
exports.lookup = lookup;
exports.default = {
    lookupStem: exports.lookupStem,
    lookupMeanings: exports.lookupMeanings,
    lookupExamples: exports.lookupExamples,
    lookupWordExamples: exports.lookupWordExamples,
    lookupCombinedExamples: exports.lookupCombinedExamples,
    lookup: exports.lookup,
};

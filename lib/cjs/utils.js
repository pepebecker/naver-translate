"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSteam = exports.getCombinedExamples = exports.getExamples = exports.getMeaningExamples = exports.getWordExamples = exports.getMeanings = exports.getWordEntries = exports.getExampleData = exports.getMeaningData = exports.getWordData = exports.stripHtml = exports.stripAlts = exports.stripTags = exports.stripLinks = exports.trimEmptyValues = void 0;
const api_1 = require("./api");
const supRe = /<sup[^>]*>.*?<\/sup>/gi;
const linkRe = /\(?[→↔]?<a[^>]*>.*?<\/a>\)?/gi;
const tagsRe = /<([^>]+)>/gi;
const altsRe = /\[[^\]]*\]/gi;
const htmlRe = new RegExp(`${supRe.source}|${linkRe.source}|${tagsRe.source}`, 'gi');
const trimEmptyValues = (text) => {
    return text === null || text === void 0 ? void 0 : text.split(',').map((v) => v === null || v === void 0 ? void 0 : v.trim()).filter(Boolean).join(', ');
};
exports.trimEmptyValues = trimEmptyValues;
const stripLinks = (text) => {
    return exports.trimEmptyValues(text === null || text === void 0 ? void 0 : text.replace(linkRe, ''));
};
exports.stripLinks = stripLinks;
const stripTags = (text) => {
    return exports.trimEmptyValues(text === null || text === void 0 ? void 0 : text.replace(tagsRe, ''));
};
exports.stripTags = stripTags;
const stripAlts = (text) => {
    return exports.trimEmptyValues(text === null || text === void 0 ? void 0 : text.replace(altsRe, ''));
};
exports.stripAlts = stripAlts;
const stripHtml = (text) => {
    return exports.trimEmptyValues(text === null || text === void 0 ? void 0 : text.replace(htmlRe, ''));
};
exports.stripHtml = stripHtml;
const getWordData = (data) => {
    var _a, _b;
    return (_b = (_a = data === null || data === void 0 ? void 0 : data.searchResultMap) === null || _a === void 0 ? void 0 : _a.searchResultListMap) === null || _b === void 0 ? void 0 : _b.WORD;
};
exports.getWordData = getWordData;
const getMeaningData = (data) => {
    var _a, _b;
    return (_b = (_a = data === null || data === void 0 ? void 0 : data.searchResultMap) === null || _a === void 0 ? void 0 : _a.searchResultListMap) === null || _b === void 0 ? void 0 : _b.MEANING;
};
exports.getMeaningData = getMeaningData;
const getExampleData = (data) => {
    var _a, _b;
    return (_b = (_a = data === null || data === void 0 ? void 0 : data.searchResultMap) === null || _a === void 0 ? void 0 : _a.searchResultListMap) === null || _b === void 0 ? void 0 : _b.EXAMPLE;
};
exports.getExampleData = getExampleData;
const getWordEntries = async (data, o) => {
    var _a;
    const items = (_a = exports.getWordData(data)) === null || _a === void 0 ? void 0 : _a.items;
    if (!items || items.length <= 0)
        return [];
    const results = await Promise.all(items
        .filter((item) => item.matchType === 'exact:entry')
        .map(async (item) => {
        var _a, _b, _c, _d;
        const collection = item === null || item === void 0 ? void 0 : item.meansCollector[0];
        const result = {
            entryId: item.entryId,
            partOfSpeech: collection.partOfSpeech,
            partOfSpeech2: collection.partOfSpeech2,
            means: collection.means.map((mean) => ({
                value: (o === null || o === void 0 ? void 0 : o.strip) ? exports.stripHtml(mean.value) : exports.stripLinks(mean.value),
                exampleOri: (o === null || o === void 0 ? void 0 : o.strip)
                    ? exports.stripHtml(mean.exampleOri)
                    : exports.stripLinks(mean.exampleOri),
                exampleTrans: (o === null || o === void 0 ? void 0 : o.strip)
                    ? exports.stripHtml(mean.exampleTrans)
                    : exports.stripLinks(mean.exampleTrans),
            })),
            phonetics: (_a = item.searchPhoneticSymbolList) === null || _a === void 0 ? void 0 : _a.map((p) => ({
                type: p.symbolType,
                value: (o === null || o === void 0 ? void 0 : o.strip) ? exports.stripHtml(p.symbolValue) : p.symbolValue,
                audio: p.symbolFile,
            })).filter((p) => p.audio),
            origin: undefined,
        };
        if (o === null || o === void 0 ? void 0 : o.fetchExtraData) {
            const extraData = await api_1.fetchEntry(item.entryId);
            const origin = (_d = (_c = (_b = extraData === null || extraData === void 0 ? void 0 : extraData.entry) === null || _b === void 0 ? void 0 : _b.group) === null || _c === void 0 ? void 0 : _c.entryCommon) === null || _d === void 0 ? void 0 : _d.origin_language;
            result.origin = origin || null;
        }
        return result;
    }));
    return results.filter((r) => { var _a; return (_a = r === null || r === void 0 ? void 0 : r.means) === null || _a === void 0 ? void 0 : _a.length; });
};
exports.getWordEntries = getWordEntries;
const getMeanings = async (data, o) => {
    const wordEntries = await exports.getWordEntries(data, o);
    return wordEntries
        .map((entry) => {
        var _a;
        const means = entry.means.map((m) => {
            var _a;
            return (_a = m.value) === null || _a === void 0 ? void 0 : _a.split(/[;,] /).map((m) => {
                // remove "(...)", "[...]", "a ", ending dot
                m = m.replace(/\([^()]*\)|\[[^[\]]*\]|a\s|\.$/g, '');
                m = m.replace(/\s+/g, ' '); // reduce multi-spaces to one space
                return m.trim();
            });
        });
        return {
            means: [...new Set(means.flat())].filter(Boolean),
            partOfSpeech: entry.partOfSpeech,
            partOfSpeech2: entry.partOfSpeech2,
            origin: (_a = entry.origin) === null || _a === void 0 ? void 0 : _a.replace(/\([^()]*\)|\[[^[\]]*\]/g, ''),
            phonetics: entry.phonetics,
        };
    })
        .filter((entry) => { var _a; return (_a = entry.means) === null || _a === void 0 ? void 0 : _a.length; })
        .reduce((acc, v, i) => {
        const p = acc[i - 1];
        if ((p === null || p === void 0 ? void 0 : p.means.includes(v.means[0])) || v.means.includes(p === null || p === void 0 ? void 0 : p.means[0])) {
            const bothHaveOrigin = p.origin && v.origin;
            const bothHavePos = p.partOfSpeech && v.partOfSpeech;
            if (!p.origin && v.origin)
                return [...acc.splice(0, -1), v];
            if (p.origin && !v.origin)
                return acc;
            // Compare origins
            if (p.origin && v.origin) {
                if (!v.origin.includes(p.origin) && !p.origin.includes(v.origin)) {
                    return [...acc, v]; // Return both if origin differs
                }
            }
            // Compare parts of speech
            if (!p.partOfSpeech && v.partOfSpeech)
                return [...acc.splice(0, -1), v];
            if (p.partOfSpeech && !v.partOfSpeech)
                return acc;
            return [...acc, v];
        }
        else {
            return [...acc, v];
        }
    }, []);
};
exports.getMeanings = getMeanings;
const getWordExamples = async (data, o) => {
    const wordEntries = await exports.getWordEntries(data, o);
    return wordEntries === null || wordEntries === void 0 ? void 0 : wordEntries.map((entry) => {
        var _a;
        return (_a = entry === null || entry === void 0 ? void 0 : entry.means) === null || _a === void 0 ? void 0 : _a.map((mean) => {
            return {
                ko: mean.exampleOri,
                en: mean.exampleTrans,
            };
        }).filter((ex) => ex.ko || ex.en);
    });
};
exports.getWordExamples = getWordExamples;
const getMeaningExamples = (data) => {
    var _a, _b;
    const meaningData = exports.getMeaningData(data);
    return (((_b = (_a = meaningData === null || meaningData === void 0 ? void 0 : meaningData.items) === null || _a === void 0 ? void 0 : _a.map((entry) => {
        var _a, _b;
        return (_b = (_a = entry.meansCollector[0]) === null || _a === void 0 ? void 0 : _a.means) === null || _b === void 0 ? void 0 : _b.map((mean) => {
            return {
                ko: mean.value,
                en: entry.expEntry,
            };
        }).filter((ex) => ex.ko || ex.en);
    })) === null || _b === void 0 ? void 0 : _b.filter(Boolean)) || []);
};
exports.getMeaningExamples = getMeaningExamples;
const getExamples = (data) => {
    const exampleData = exports.getExampleData(data);
    if (!(exampleData === null || exampleData === void 0 ? void 0 : exampleData.items) || exampleData.items.length <= 0)
        return [];
    return exampleData.items.map((ex) => ({
        en: ex.expExample2 ? ex.expExample1 : undefined,
        ko: ex.expExample2 || ex.expExample1,
    }));
};
exports.getExamples = getExamples;
const getCombinedExamples = async (data, o) => {
    const wordExamples = await exports.getWordExamples(data, o);
    const examples = exports.getExamples(data);
    return [...wordExamples.flat(), ...examples];
};
exports.getCombinedExamples = getCombinedExamples;
const getSteam = (data) => {
    var _a, _b, _c;
    const revert = (_a = data === null || data === void 0 ? void 0 : data.recommendEntry) === null || _a === void 0 ? void 0 : _a.revert;
    if (revert)
        return revert;
    const wordItem = (_c = (_b = data.searchResultMap) === null || _b === void 0 ? void 0 : _b.searchResultListMap) === null || _c === void 0 ? void 0 : _c.WORD.items[0];
    return exports.stripTags(wordItem === null || wordItem === void 0 ? void 0 : wordItem.expEntry);
};
exports.getSteam = getSteam;

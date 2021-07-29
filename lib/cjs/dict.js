"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCombinedExamples = exports.searchWordExamples = exports.searchExamples = exports.searchMeanings = exports.searchStem = void 0;
const api_1 = require("./api");
const utils_1 = require("./utils");
const searchStem = async (query) => {
    const result = await api_1.search(query);
    return utils_1.getSteam(result);
};
exports.searchStem = searchStem;
const searchMeanings = async (query, o) => {
    const result = await api_1.search(query, o === null || o === void 0 ? void 0 : o.enko);
    return utils_1.getMeanings(result, o);
};
exports.searchMeanings = searchMeanings;
const searchExamples = async (query, o) => {
    const result = await api_1.search(query, o === null || o === void 0 ? void 0 : o.enko);
    return utils_1.getExamples(result);
};
exports.searchExamples = searchExamples;
const searchWordExamples = async (query, o) => {
    const result = await api_1.search(query, o === null || o === void 0 ? void 0 : o.enko);
    return utils_1.getWordExamples(result, o);
};
exports.searchWordExamples = searchWordExamples;
const searchCombinedExamples = async (query, o) => {
    const result = await api_1.search(query, o === null || o === void 0 ? void 0 : o.enko);
    return utils_1.getCombinedExamples(result, o);
};
exports.searchCombinedExamples = searchCombinedExamples;

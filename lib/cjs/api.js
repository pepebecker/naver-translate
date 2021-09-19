"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.fetchEntry = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
axios_retry_1.default(axios_1.default, { retries: 3 });
const fetchEntry = async (entryId, srcDest = 'koen') => {
    if (typeof srcDest === 'boolean')
        srcDest = srcDest ? 'enko' : 'koen';
    const baseUrl = `https://en.dict.naver.com/api/platform/${srcDest}`;
    const url = `${baseUrl}/entry?entryId=${entryId}`;
    const response = await axios_1.default.get(url);
    return response.data;
};
exports.fetchEntry = fetchEntry;
const search = async (query, srcDest = 'koen') => {
    if (typeof srcDest === 'boolean')
        srcDest = srcDest ? 'enko' : 'koen';
    const encoded = encodeURIComponent(query);
    const baseUrl = `https://en.dict.naver.com/api3/${srcDest}`;
    const url = `${baseUrl}/search?query=${encoded}`;
    const response = await axios_1.default.get(url);
    return response.data;
};
exports.search = search;

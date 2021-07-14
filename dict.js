const axios = require('axios');
const {
  getSteam,
  getWordMeanings,
  getWordExamples,
  getMeanings,
  getExamples,
  getCombinedExamples,
  getCombinedMeanings,
} = require('./utils');

const search = async (query, enko = false) => {
  const encoded = encodeURIComponent(query, enko);
  const baseUrl = `https://en.dict.naver.com/api3/${enko ? 'enko' : 'koen'}`
  const url = `${baseUrl}/search?query=${encoded}`;
  const response = await axios.get(url);
  return response.data;
};

const searchStem = async (query) => {
  const result = await search(query);
  return getSteam(result);
};

const searchMeanings = async (query, enko = false) => {
  const result = await search(query, enko);
  return getMeanings(result);
};

const searchExamples = async (query, enko = false) => {
  const result = await search(query, enko);
  return getExamples(result);
};

const searchWordMeanings = async (query, enko = false) => {
  const result = await search(query, enko);
  return getWordMeanings(result);
};

const searchWordExamples = async (query, enko = false) => {
  const result = await search(query, enko);
  return getWordExamples(result);
};

const searchCombinedMeanings = async (query, enko = false) => {
  const result = await search(query, enko);
  return getCombinedMeanings(result);
};

const searchCombinedExamples = async (query, enko = false) => {
  const result = await search(query, enko);
  return getCombinedExamples(result);
};

module.exports = {
  search,
  searchStem,
  searchMeanings,
  searchExamples,
  searchWordMeanings,
  searchWordExamples,
  searchCombinedMeanings,
  searchCombinedExamples,
};

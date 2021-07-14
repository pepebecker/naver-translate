const googleTranslate = require('@vitalets/google-translate-api');
const Papago = require('papago');

const dict = require('./dict');
const { getSteam, getCombinedExamples, getCombinedMeanings } = require('./utils');

let papago = null;

const configurePapago = (config) => {
  papago = new Papago(config);
};

const gTranslate = async (query, enko = false) => {
  const options = {
    from: enko ? 'en' : 'ko',
    to: enko ? 'ko' : 'en',
  };
  const result = await googleTranslate(query, options);
  return result.text;
};

const translate = async (query, enko = false, google = false) => {
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

const htmlRe = /(<([^>]+)>)/gi;
const stripHtml = (text) => {
  return text?.replace(htmlRe, '');
};

const translateExamples = async (examples, google = false, strip = false) => {
  return Promise.all(examples.map(async ex => {
    const en = ex.en || await translate(stripHtml(ex.ko), false, google);
    return {
      ko: strip ? stripHtml(ex.ko) : ex.ko,
      en: strip ? stripHtml(en) : en,
    };
  }));
};

const combinedMeaningsWithFallback = async (combinedMeanings, query, { enko = false, google = false, strip = false } = {}) => {
  if (combinedMeanings?.length) {
    if (strip) return combinedMeanings.map(list => list.map(stripHtml));
    else return combinedMeanings;
  } else {
    return [[await translate(query, enko, google)]];
  }
};

const lookupStem = (query) => {
  return dict.searchStem(query);
};

const lookupMeanings = async (query, { enko = false, strip = false } = {}) => {
  const result = await dict.searchMeanings(query, enko);
  return strip ? result.map(stripHtml) : result;
};

const lookupWordMeanings = async (query, { enko = false, strip = false } = {}) => {
  const result = await dict.searchWordMeanings(query, enko);
  return strip ? result.map(list => list.map(stripHtml)) : result;
};

const lookupExamples = async (query, { google = false, strip = false } = {}) => {
  const examples = await dict.searchExamples(query);
  return translateExamples(examples, google, strip);
};

const lookupWordExamples = async (query, { google = false, strip = false } = {}) => {
  const wordExamples = await dict.searchWordExamples(query);
  return Promise.all(wordExamples.map(list => {
    return translateExamples(list, google, strip);
  }));
};

const lookupCombinedMeanings = async (query, { enko = false, google = false, strip = false } = {}) => {
  const combinedMeanings = await dict.searchCombinedMeanings(query);
  return combinedMeaningsWithFallback(combinedMeanings, query, { enko, google, strip });
};

const lookupCombinedExamples = async (query, { google = false, strip = false } = {}) => {
  const examples = await dict.searchCombinedExamples(query);
  return translateExamples(examples, google, strip);
};

const lookup = async (query, { enko = false, google = false, strip = false } = {}) => {
  const result = await dict.search(query, enko);
  const combinedMeanings = getCombinedMeanings(result);
  const combinedExamples = getCombinedExamples(result);
  const [meanings, examples] = await Promise.all([
    combinedMeaningsWithFallback(combinedMeanings, query, { enko, google, strip }),
    translateExamples(combinedExamples, google, strip),
  ]);
  return { query, stem: getSteam(result), meanings, examples };
};

module.exports = {
  configurePapago,
  lookup,
  lookupStem,
  lookupMeanings,
  lookupExamples,
  lookupWordMeanings,
  lookupWordExamples,
  lookupCombinedMeanings,
  lookupCombinedExamples,
};

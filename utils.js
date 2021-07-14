const getWordData = (data) => {
  return data?.searchResultMap?.searchResultListMap?.WORD;
};

const getMeaningData = (data) => {
  return data?.searchResultMap?.searchResultListMap?.MEANING;
};

const getExampleData = (data) => {
  return data?.searchResultMap?.searchResultListMap?.EXAMPLE;
};

const getWordEntries = (data) => {
  return getWordData(data)?.items || [];
};

const getWordMeanings = (data) => {
  const wordEntries = getWordEntries(data);
  return wordEntries?.map(item => {
    const list = item?.meansCollector?.[0]?.means?.map(m => m.value?.replace(/\[.*]/g, ''));
    const filtered = list?.filter(Boolean);
    return filtered?.length > 0 ? filtered : null;
  })?.filter(Boolean);
};

const getWordExamples = (data) => {
  const wordEntries = getWordEntries(data);
  return wordEntries?.map(item => {
    const list = item?.meansCollector?.[0]?.means?.map(mean => {
      return {
        ko: mean.exampleOri?.replace(/\[.*]/g, ''),
        en: mean.exampleTrans?.replace(/\[.*]/g, ''),
      };
    }).filter(ex => ex.ko || ex.en);
    const filtered = list?.filter(Boolean);
    return filtered?.length > 0 ? filtered : null;
  })?.filter(Boolean);
};

const getMeanings = (data) => {
  const meaningData = getMeaningData(data);
  return meaningData?.items?.map(entry => {
    return entry?.expEntry?.replace(/\[.*]/g, '');
  }).filter(Boolean);
};

const getExamples = (data) => {
  const exampleData = getExampleData(data);
  return exampleData?.items?.map(ex => ({
    en: ex.expExample2 ? ex.expExample1 : null,
    ko: ex.expExample2 || ex.expExample1,
  }));
};

const getCombinedMeanings = (data) => {
  const wordMeanings = getWordMeanings(data);
  const meanings = getMeanings(data);
  return [...wordMeanings, ...meanings.map(mean => [mean])];
};

const getCombinedExamples = (data) => {
  const wordExamples = getWordExamples(data)?.flat();
  const examples = getExamples(data);
  return [...wordExamples, ...examples];
};

const _getStrongOfWordEntry = (word) => {
  return word?.expEntry?.match(/(?<=<strong>).*?(?=<\/strong>)/gs)?.join('');
};

const getSteam = (data) => {
  const revert = data?.recommendEntry?.revert;
  if (revert) return revert;
  const words = getWordEntries(data);
  return _getStrongOfWordEntry(words[0]);
};

module.exports = {
  getSteam,
  getWordMeanings,
  getWordExamples,
  getMeanings,
  getExamples,
  getCombinedExamples,
  getCombinedMeanings,
};

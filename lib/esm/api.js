import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 3 });
export const fetchEntry = async (entryId, srcDest = 'koen') => {
    if (typeof srcDest === 'boolean')
        srcDest = srcDest ? 'enko' : 'koen';
    const baseUrl = `https://en.dict.naver.com/api/platform/${srcDest}`;
    const url = `${baseUrl}/entry?entryId=${entryId}`;
    const response = await axios.get(url);
    return response.data;
};
export const search = async (query, srcDest = 'koen') => {
    if (typeof srcDest === 'boolean')
        srcDest = srcDest ? 'enko' : 'koen';
    const encoded = encodeURIComponent(query);
    const baseUrl = `https://en.dict.naver.com/api3/${srcDest}`;
    const url = `${baseUrl}/search?query=${encoded}`;
    const response = await axios.get(url);
    return response.data;
};

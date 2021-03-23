const { google } =  require('googleapis');
const KEY = process.env.KEY;

const youtubeAPI = google.youtube({
    version: 'v3',
    auth: KEY
})

const defaultSearchOptions = {
    maxResults: 50,
    part: 'snippet',
    type: 'video',
}

const memoize = (fn) => {
    let cache = {};
    return async (query) => {
      if (query in cache) {
        return cache[query];
      }
        const queryResult = await fn(query);
        cache[query] = queryResult;
        return queryResult;
    }
  }

const search = async (q, nextPage = false, data = []) => {
    if(nextPage) defaultSearchOptions.pageToken = nextPage;

    const videos = await youtubeAPI.search.list({
        ...defaultSearchOptions,
        q
    })

    data = [...videos.data.items, ...data];

    if(data.length === 200) return data;

    return await search(q, videos.data.nextPageToken, data);
}

const video = async ( videoIds, data = []) => {
    delete defaultSearchOptions.pageToken;
    let allIds = videoIds.split(',');

    const fiftyIds = allIds.splice(0, 50).join(',');

    allIds = allIds.join(',');

    const videos = await youtubeAPI.videos.list({
        ...defaultSearchOptions,
        part: 'contentDetails',
        id: fiftyIds
    })

    data = [...videos.data.items, ...data];

    if(data.length === 200) return data;

     return await video( allIds, data);
}

const memoizeSearch = memoize(search);

module.exports = {
    memoizeSearch,
    video
}
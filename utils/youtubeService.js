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


module.exports = {
    search: async (q) => {
        const videos = await youtubeAPI.search.list({
            ...defaultSearchOptions,
            q
        })
        return videos;
    },
    video: async (q) => {
        const videos = await youtubeAPI.videos.list({
            ...defaultSearchOptions,
            q
        })
        return videos;
    }
}
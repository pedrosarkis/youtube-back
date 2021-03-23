'use strict';
const youtubeService = require('../utils/youtubeService');
const {clone} = require('../utils/util');
var LRU = require("lru-cache");
const optionsCache = { max: 500
              , length: function (n, key) { return n * 2 + key.length }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
const cache = new LRU(optionsCache);
 


const getMostUsedWords = (text) => {
    const words = text.replace(/[.]/g, '').replace(/[^A-Za-z]/g, ' ').split(/\s/).filter(word => word);
    const wordsFrequence = {};
    words.forEach(word => {
        if (!wordsFrequence[word]) {
            wordsFrequence[word] = 0;
        }
        wordsFrequence[word] += 1;
    });
   
    const fiveMostUsedWordsCount = Object.entries(wordsFrequence).sort((a, b) => b[1] - a[1]).slice(0, 5).map(word => word[0]);
    return fiveMostUsedWordsCount;
}

const convertYouTubeDurations = (duration)  => {
    const timeExtractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
    const extracted = timeExtractor.exec(duration);
    const hours = parseInt(extracted[1], 10) || 0;
    const minutes = parseInt(extracted[2], 10) || 0;
    const seconds = parseInt(extracted[3], 10) || 0;
    return (hours * 3600 ) + (minutes * 60 ) + (seconds);
}


const searchQuery = async (req, res) => {
    const {q} = req.body;

    const videos = await youtubeService.memoizeSearch(q);
    //Apenas quis testar duas formas de fazer cache, nunca fiz nenhuma profissionalmente, apenas aprendendo.

    const videoIds = videos.map(({id: {videoId}}) => {
        return videoId;
    }).join(',');

    const cachedValue = cache.get(q);

    const videoInfo = cachedValue ? clone(cachedValue) : await youtubeService.video(videoIds);

    if(!cachedValue) cache.set(q, clone(videoInfo));

    let completeText = '';

    videos.forEach(({ snippet: {thumbnails, title, description}, id: {videoId}}, index) => {
        videoInfo.forEach(videoInfo => {
            if(videoInfo.id === videoId) {
                videoInfo.thumbNail = thumbnails;
                videoInfo.title = title;
                videoInfo.description = description;
                completeText += title + description;
                videoInfo.contentDetails.duration = convertYouTubeDurations(videoInfo.contentDetails.duration);
            }
        })
    })

    const mostUsedWords = getMostUsedWords(completeText);

    const responseVideoData = {
        items: videoInfo,
        mostUsedWords
    }
    return res.send(responseVideoData);
}

module.exports = {
    searchQuery
}
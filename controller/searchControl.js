'use strict';
const youtubeService = require('../utils/youtubeService');

const getMostUsedWords = (text) => {
    const words = text.replace(/[.]/g, '').replace(/[^A-Za-z]/g, ' ').split(/\s/);
    const wordsFrequence = {};
    words.forEach(word => {
        if (!wordsFrequence[word]) {
            wordsFrequence[word] = 0;
        }
        wordsFrequence[word] += 1;
    });
   
    const fiveMostUsedWordsCount = Object.entries(wordsFrequence).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return fiveMostUsedWordsCount;
}


const searchQuery = async (req, res) => {
    const {q} = req.body;
    const videos = await youtubeService.search(q);
    const videoIds = videos.data.items.map(videoId => {
        return videoId.id.videoId;
    }).join(',');

    const videoInfo = await youtubeService.video(videoIds);
    let completeText = '';
    videos.data.items.forEach((videoData, index) => {
        videoInfo.data.items[index].thumbNail = videoData.snippet.thumbnails;
        videoInfo.data.items[index].title = videoData.snippet.title;
        videoInfo.data.items[index].description = videoData.snippet.description;
        completeText += videoData.snippet.title + videoData.snippet.description; 
    })

    const mostUsedWords = getMostUsedWords(completeText);
    const responseVideoData = {
        items: videoInfo.data.items,
        mostUsedWords
    }
   

    return res.send(responseVideoData);
}


module.exports = {
    searchQuery
}
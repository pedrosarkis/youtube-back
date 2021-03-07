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
   
    const fiveMostUsedWordsCount = Object.entries(wordsFrequence).sort((a, b) => b[1] - a[1]).slice(0, 5).map(word => word[0]);
    return fiveMostUsedWordsCount;
}

const convertYouTubeDurations = (duration)  => {
    const time_extractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
    const extracted = time_extractor.exec(duration);
    const hours = parseInt(extracted[1], 10) || 0;
    const minutes = parseInt(extracted[2], 10) || 0;
    const seconds = parseInt(extracted[3], 10) || 0;
    return (hours * 3600 ) + (minutes * 60 ) + (seconds );
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
        videoInfo.data.items[index].contentDetails.duration = convertYouTubeDurations(videoInfo.data.items[index].contentDetails.duration);
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
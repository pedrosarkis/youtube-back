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
    return (hours * 3600 ) + (minutes * 60 ) + (seconds);
}


const searchQuery = async (req, res) => {
    const {q} = req.body;
    const videos = await youtubeService.search(q);

    const videoIds = videos.map(({id: {videoId}}) => {
        return videoId;
    }).join(',');

    const videoInfo = await youtubeService.video(videoIds);

    let completeText = '';

    videos.forEach(({ snippet: {thumbnails, title, description}}, index) => {
        const videoInformation = videoInfo[index];

        videoInformation.thumbNail = thumbnails;
        videoInformation.title = title;
        videoInformation.description = description;
        completeText += title + description; 
        videoInformation.contentDetails.duration = convertYouTubeDurations(videoInformation.contentDetails.duration);
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
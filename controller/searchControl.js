'use strict';
const youtubeService = require('../utils/youtubeService');

const searchQuery = async (req, res) => {
    const {q} = req.body;
    const videos = await youtubeService.search(q);
    const videoInfo = videos.data.items.map(video => {
        return {
            videoId: video.id.videoId,
            thumb: video.snippet.thumbnails.medium,
            videoTitle: video.snippet.title
        }
    })
    return res.json(videoInfo);
}

module.exports = {
    searchQuery
}
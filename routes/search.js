const express = require('express');
const youtubeService = require('../utils/youtubeService');
const searchControl = require('../controller/searchControl')

const router = express.Router();

router.post('/search', searchControl.searchQuery);


router.post('/video', async (req, res) => {
    const {q} = req.body;
    const videos = await youtubeService.video(q);
})

module.exports = router;

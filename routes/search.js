const express = require('express');
const youtubeService = require('../utils/youtubeService');
const searchControl = require('../controller/searchControl')
//const {eminemMock} = require('../mock/eminemSearch');
const {eminemMock} = require('../mock/eminemMock');

const router = express.Router();

router.post('/search', searchControl.searchQuery);

router.post('/searchMock', (req, res) => {
    res.json(eminemMock);
})


router.post('/video', async (req, res) => {
    const {q} = req.body;
    const videos = await youtubeService.video(q);
    res.json(videos);
})

module.exports = router;

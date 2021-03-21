const express = require('express');
const searchControl = require('../controller/searchControl')

const fs = require('fs');
const path = require('path');

const eminemMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../mock/eminemMock.json')));

const router = express.Router();

router.post('/search', searchControl.searchQuery);

router.post('/searchMock', (req, res) => {
    res.json(eminemMock);
})

module.exports = router;

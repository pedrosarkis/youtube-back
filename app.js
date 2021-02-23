const express = require("express");
const app = express();
require('dotenv').config()

const bodyparser = require('body-parser');
const youtubeRoutes = require('./routes/search');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/', youtubeRoutes);


app.listen('8080');

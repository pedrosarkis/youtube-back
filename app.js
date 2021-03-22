const app = require("express")();

require('dotenv').config()
const cors = require('cors');

const port = process.env.PORT || 8080;
app.use(cors());
const bodyparser = require('body-parser');
const youtubeRoutes = require('./routes/search');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/', youtubeRoutes);


app.listen(port);

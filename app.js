require('dotenv').config();

// web.js
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { router } = require('./routes/router');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../metasearch_knowledgegraph/build')));

app.use('/', router);

app.listen(8080, function () {
    console.log('listening on 8080')
});

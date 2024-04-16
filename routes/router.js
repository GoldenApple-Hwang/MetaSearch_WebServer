// routes/router.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fileUploadRouter = require('./fileUpload');
const getGraphData = require('./graphData');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

// 파일 업로드 라우터를 '/upload' 경로에 매핑합니다.
router.use('/upload', fileUploadRouter);

router.get('/api/graphData/:dbName', getGraphData);

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

module.exports = { router };

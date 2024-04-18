// routes/router.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fileUploadRouter = require('./fileUpload');
const getGraphData = require('./graphData');
const circleToSearch = require('./circleToSearch');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

// 파일 업로드 라우터를 '/upload' 경로에 매핑합니다.
router.use('/upload', fileUploadRouter);

//그래프 데이터를 가저옴
router.get('/api/graphData/:dbName', getGraphData);

//안드로이드에서 circleToSearch 된 값을 받아서 그래프에서 검색
router.post('/android/circleToSearch', circleToSearch);

//AI Server에서 import할 .csv파일을 받아서 "주소" 에 저장
//router.post('/aiserver/uploadcsv', );

router.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

module.exports = router;

// routes/router.js
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fileUploadRouter from './fileUpload.js';
import getGraphData from './graphData.js';
import circleToSearch from './circleToSearch.js';
import csvUploadRouter from './csvUpload.js'
const router = Router();

// __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 로깅 미들웨어
router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

router.get('/', function (req, res) {
  res.sendFile(join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

// 파일 업로드 라우터를 '/android/uploadimg' 경로에 매핑합니다.
router.use('/android/uploadimg', fileUploadRouter);

//그래프 데이터를 가저옴
router.get('/api/graphData/:dbName', getGraphData);

//안드로이드에서 circleToSearch 된 값을 받아서 그래프에서 검색
router.use('/android/circleToSearch', circleToSearch);

//AI Server에서 import할 .csv파일을 받아서 "C:\Users\hwang\.Neo4jDesktop\relate-data\dbmss\dbms-03774803-1a7b-4c49-bbce-e4aeb8c59827\import" 에 저장
router.use('/aiserver/uploadcsv', csvUploadRouter);

router.get('*', function (req, res) {
  res.sendFile(join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

export default router;

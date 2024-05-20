// routes/router.js
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import imageUploadRouter from './imageUpload.js';
import getGraphData from './graphData.js';
import circleToSearch from './circleToSearch.js';
import csvUploadRouter from './csvUpload.js'
import sendCsvFile from './sendCsvFile.js'
import nlqSearch from './nlqSerach.js'
import getPeopleFrequency from './peopleFrequencyData.js';
import personSearch from './personSearch.js'
import changePersonName from './changePersonName.js'
import entityTripleData from './entityTripleData.js'

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
router.use('/android/uploadimg', imageUploadRouter);

//그래프 데이터를 가저옴
router.get('/api/graphData/:dbName', getGraphData);

//안드로이드에서 circleToSearch 된 값을 받아서 그래프에서 검색
router.use('/android/circleToSearch', circleToSearch);

//AI Server에서 import할 .csv파일을 받아서 "C:\Users\hwang\.Neo4jDesktop\relate-data\dbmss\dbms-03774803-1a7b-4c49-bbce-e4aeb8c59827\import" 에 저장
router.use('/aiserver/uploadcsv', csvUploadRouter);

//AI Server에서 dbName과 함께 요청이 들어오면 다시 해당 이름의 csv 파일을 보내줌
router.use('/neo4jserver/csv', sendCsvFile)

//안드로이드에서 DB이름과 자연어 검색 쿼리를 받아 결과(사진 이름)을 반환
router.use('/nlqsearch', nlqSearch)

//버블차트에 인물 빈도를 시각화 하기 위해 그레프에서 데이터를 가져옴
router.use('/api/peopleFrequency', getPeopleFrequency)

//인물 검색 - 동그라미 클릭해서 인물검색하는 것
router.use('/personsearch', personSearch)

//변경 전 이름, 변경 후 이름, dbName이 들어오면 그래프에서 해당 이름을 변경
router.use('/changename', changePersonName)

//특정 entity 값과 연결된 그래프를 보여주기 위해 그래프에서 데이터를 가져옴
router.use('/graph/entitytripledata', entityTripleData);

//인물관련 그래프만 보여주기
// router.use('/graph', )

router.get('*', function (req, res) {
  res.sendFile(join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

export default router;

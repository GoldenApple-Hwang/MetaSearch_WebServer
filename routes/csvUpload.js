// routes/csvUpload.js
import { Router } from 'express';
import csvUpload from '../middlewares/csvUploadMiddleware.js'; // CSV 업로드를 위한 미들웨어
import validateCsvFile from '../services/csvUploadService.js'; // 파일 유효성 검사 서비스
import neo4jModel from "../models/neo4jModel.js"; // 전체 모듈을 가져옴
import { basename, extname } from 'path'; // 파일 이름 처리를 위해 필요

const { loadCsvToNeo4j } = neo4jModel; // 구조 분해 할당을 사용해서 필요한 함수만 선택
const router = Router();

// '/csv/upload' 경로에서 CSV 파일 업로드를 처리
router.post('/', csvUpload.single('csvfile'), async (req, res, next) => {
  try {
    validateCsvFile(req.file); // 파일 유효성 검사
    const fileName = basename(req.file.filename, extname(req.file.filename)); // 파일 이름 추출
    console.log(`Uploading and processing file: ${fileName}`);
    await loadCsvToNeo4j(fileName); // 파일 이름을 데이터베이스 이름으로 사용하여 Neo4j로 데이터 로드
    res.send(`CSV file uploaded and loaded into Neo4j ${fileName} database successfully`);
    //res.send('CSV file uploaded successfully');
  } catch (error) {
    console.error(`Error during CSV upload and processing: ${error}`);
    res.status(400).send(error.message);
  }
});

export default router;

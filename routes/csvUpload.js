// routes/csvUpload.js
import { Router } from 'express';
import csvUpload from '../middlewares/csvUploadMiddleware.js'; // CSV 업로드를 위한 미들웨어
import validateCsvFile from '../services/csvUploadService.js'; // 파일 유효성 검사 서비스
const router = Router();

// '/csv/upload' 경로에서 CSV 파일 업로드를 처리
router.post('/', csvUpload.single('csvfile'), (req, res, next) => {
  try {
    validateCsvFile(req.file); // 파일 유효성 검사
    res.send('CSV file uploaded successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;

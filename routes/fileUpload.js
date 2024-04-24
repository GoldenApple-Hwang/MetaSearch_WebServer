// routes/fileUpload.js
import { Router } from 'express';
import { upload } from '../middlewares/fileUpload';
import { validateFile } from '../services/fileService';
const router = Router();

// 이제 이 라우터는 '/android/uploadimg'로 매핑될 때 루트 경로 '/'에서 작동합니다.
router.post('/', upload.single('image'), (req, res, next) => {
  try {
    validateFile(req.file);
    res.send('File uploaded successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;

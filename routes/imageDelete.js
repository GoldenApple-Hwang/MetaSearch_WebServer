import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer 설정
const upload = multer();

router.post("/", upload.none(), async (req, res) => {
  const dbName = req.body.dbName;
  const deleteImageName = req.body.deleteImage;

  if (!dbName || !deleteImageName) {
    return res.status(400).send({ message: "Missing required parameters: dbName or deleteImage" });
  }

  // 이미지가 저장된 경로 생성
  const imagePath = path.join(__dirname, `../public/images/${dbName}`, deleteImageName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 파일이 존재하지 않음
        console.error(`File ${deleteImageName} does not exist:`, err);
        return res.status(404).send({ message: "Image not found", error: err.message });
      }
      // 기타 에러
      console.error(`Error deleting file ${deleteImageName}:`, err);
      return res.status(500).send({ message: "Error deleting image", error: err.message });
    }
    console.log(`File ${deleteImageName} deleted successfully`);
    res.status(200).send({ message: `Image ${deleteImageName} deleted successfully` });
  });
});

export default router;

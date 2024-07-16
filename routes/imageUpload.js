// routes/imageUpload.js
import { Router } from "express";
import upload, { processImage } from "../middlewares/imageUploadMiddleware.js";
//import validateImage from "../services/imageService.js";
const router = Router();

// 이제 이 라우터는 '/android/uploadimg'로 매핑될 때 루트 경로 '/'에서 작동합니다.
router.post("/", upload.fields([{ name: 'image' }]), processImage, (req, res, next) => {
  try {
    const dbName = req.query.dbName;
    console.log(`1 image upload dbName ${dbName}`);
    if (!dbName) {
      throw new Error("Database name ('source') is not provided.");
    }

    if (!req.files || !req.files['image'] || req.files['image'].length === 0) {
      console.log("No file uploaded.");
      return res.status(400).send("No file uploaded.");
    }

    // 파일 배열에서 첫 번째 이미지 파일을 가져옵니다.
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    if (!imageFile) {
      throw new Error("No image file uploaded.");
    }
    //validateImage(imageFile);
    res.send("images uploaded successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
export default router;

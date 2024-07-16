// middlewares/imageUploadMiddleware.js
import multer from "multer";
import { extname, basename } from "path";
import fs from "fs";
import sharp from "sharp";

// multer 디스크 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dbName = req.query.dbName;
      const path = `C:/Users/hwang/Documents/erica/Github/MetaSearch_WebServer/public/images/${dbName}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      cb(null, path);
    },
    filename: function (req, file, cb) {
      // '+'를 공백으로 변환 후 디코딩 적용
      let filename = file.originalname.replace(/\+/g, ' ');
      filename = decodeURIComponent(filename);
      const extension = extname(filename);
      filename = basename(filename, extension) + extension;
      cb(null, filename);
    }
  });
  

const upload = multer({ storage: storage });

export const processImage = async (req, res, next) => {
    if (req.files && req.files.image && req.files.image.length > 0) {
      const imageFile = req.files.image[0];
      const dbName = req.query.dbName;
      const path = `C:/Users/hwang/Documents/erica/Github/MetaSearch_WebServer/public/images/${dbName}`;
      
      // 폴더 존재 여부 확인 및 생성
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
  
      const decodedFileName = decodeURIComponent(imageFile.originalname);
      const extension = extname(decodedFileName);
      const filename = basename(decodedFileName, extension) + extension;
      const outputPath = `${path}/${filename}`;
      const tempOutputPath = `${path}/temp_${filename}`; // 임시 파일 경로
  
      try {
        await sharp(`${path}/${filename}`)
          .rotate() // EXIF 데이터에 따라 이미지 회전 적용
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(tempOutputPath); // 임시 파일에 저장
  
        // 임시 파일을 원본 파일로 대체
        fs.renameSync(tempOutputPath, outputPath);
  
        req.processedImagePath = outputPath;
        next();
      } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).send("Failed to process image");
        if (fs.existsSync(tempOutputPath)) {
          fs.unlinkSync(tempOutputPath); // 실패 시 임시 파일 삭제
        }
        return;
      }
    } else {
      console.error("No image file uploaded.");
      res.status(400).send("No image file uploaded.");
      return;
    }
  };
    

export default upload;

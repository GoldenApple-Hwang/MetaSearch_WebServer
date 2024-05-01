// middlewares/imageUploadMiddleware.js
import multer from 'multer';
import { extname, basename } from 'path';
import fs from 'fs';
import sharp from 'sharp';

// multer 메모리 스토리지 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const processImage = async (req, res, next) => {
    if (req.files && req.files.image && req.files.image.length > 0) { // 파일 배열 접근 수정
        const imageFile = req.files.image[0]; // 첫 번째 이미지 파일 사용
        const dbName = req.query.dbName;
        console.log(`Image upload dbName ${dbName}`);
        const path = `C:/Users/hwang/Documents/erica/Github/MetaSearch_WebServer/public/images/${dbName}`;

        // 폴더 존재 여부 확인 및 생성
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        // 원본 파일 이름을 URL 디코딩하여 사용
        const decodedFileName = decodeURIComponent(imageFile.originalname);
        const extension = extname(decodedFileName);
        const filename = basename(decodedFileName, extension) + extension;
        const outputPath = `${path}/${filename}`;

        // sharp로 이미지 처리
        try {
            await sharp(imageFile.buffer)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(outputPath);

            req.processedImagePath = outputPath;
            next();
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).send('Failed to process image');
            return; // 오류 발생 시 중단
        }
    } else {
        console.error('No image file uploaded.');
        res.status(400).send('No image file uploaded.');
        return; // 파일이 없을 경우 중단
    }
};

export default upload;

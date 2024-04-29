//middlewares/imageUploadMiddleware.js
import multer, { diskStorage } from 'multer';
import { extname, basename } from 'path';
import fs from 'fs';

// multer 디스크 스토리지 설정
const storage = diskStorage({
    destination: function (req, file, cb) {
        // URL 쿼리에서 dbName 읽기
        const dbName = req.query.dbName;
        console.log(`2 image upload dbName ${dbName}`);
        const path = `C:/Users/hwang/Documents/erica/Github/MetaSearch_WebServer/public/images/${dbName}`;
        
        // 폴더 존재 여부 확인 및 생성
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true }); // 'recursive: true' 옵션으로 하위 폴더까지 생성
        }

        cb(null, path)
    },
    filename: function (req, file, cb) {
        // 원본 파일 이름을 URL 디코딩하여 사용
        const decodedFileName = decodeURIComponent(file.originalname);
        const extension = extname(decodedFileName);
        const filename = basename(decodedFileName, extension) + extension;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

export default upload;

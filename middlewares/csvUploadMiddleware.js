// middlewares/csvUploadMiddleware.js
import multer, { diskStorage } from 'multer';
import { extname, basename } from 'path';

// multer 디스크 스토리지 설정
const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/hwang/.Neo4jDesktop/relate-data/dbmss/dbms-03774803-1a7b-4c49-bbce-e4aeb8c59827/import/') // CSV 파일을 저장할 경로
    },
    filename: function (req, file, cb) {
        // 원본 파일 이름을 URL 디코딩하여 사용
        const decodedFileName = decodeURIComponent(file.originalname);
        const extension = extname(decodedFileName);
        const filename = basename(decodedFileName, extension) + extension; // 파일 이름에 업로드 시간을 추가하여 중복 방지
        cb(null, filename);
    }
});

const csvUpload = multer({ storage: storage });

export default csvUpload;

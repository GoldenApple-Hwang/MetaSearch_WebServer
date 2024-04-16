const multer = require('multer');
const path = require('path');

// multer 디스크 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/hwang/Documents/erica/Github/MetaSearch_WebServer/public/images')
    },
    filename: function (req, file, cb) {
        // 원본 파일 이름을 URL 디코딩하여 사용
        const decodedFileName = decodeURIComponent(file.originalname);
        const extension = path.extname(decodedFileName);
        const filename = path.basename(decodedFileName, extension) + extension;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };

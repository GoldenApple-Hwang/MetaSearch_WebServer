const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/hwang/Documents/erica/Github/MetaSearch_WebServer/public/images')
  },
  filename: function (req, file, cb) {
    console.log('Original filename:', file.originalname); // 원본 파일 이름 로깅
    console.log('MIME type:', file.mimetype); // MIME 타입 로깅

    // URL 디코딩을 추가하여 파일 이름에서 한글이 깨지지 않도록 처리
    const decodedFileName = decodeURIComponent(file.originalname);

    let extension = path.extname(decodedFileName);
    if (!extension) { // 확장자가 없는 경우
      switch (file.mimetype) {
        case 'image/jpeg':
          extension = '.jpeg';
          break;
        case 'image/png':
          extension = '.png';
          break;
        case 'image/jpg':
          extension = '.jpg';
          break;
        case 'image/heic':
          extension = '.heic';
          break;
        default:
          extension = ''; // 알 수 없는 경우 확장자를 추가하지 않음
          break;
      }
    }
    const filename = path.basename(decodedFileName, extension) + extension;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = { upload };

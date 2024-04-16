// routes/fileUpload.js
const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/fileUpload');
const { validateFile } = require('../services/fileService');

// 이제 이 라우터는 '/upload'로 매핑될 때 루트 경로 '/'에서 작동합니다.
router.post('/', upload.single('image'), (req, res, next) => {
  try {
    validateFile(req.file);
    res.send('File uploaded successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

// routes/router.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { upload } = require('../middlewares/fileUpload');
const { getGraphData } = require('./graphData');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

router.post('/upload', upload.single('image'), function (req, res, next) {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    
    // MIME 타입과 확장자 검사
    const extension = file.originalname.split('.').pop();
    const mimeType = file.mimetype;
    if (
      (mimeType === 'image/jpeg' && extension !== 'jpg' && extension !== 'jpeg') ||
      (mimeType === 'image/png' && extension !== 'png') ||
      (mimeType === 'image/heic' && extension !== 'heic')
    ) {
      return res.status(400).send('File extension does not match MIME type.');
    }
  
    res.send('File uploaded successfully');
  });

router.get('/api/graphData/:dbName', getGraphData);

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../metasearch_knowledgegraph/build/index.html'));
});

module.exports = { router };

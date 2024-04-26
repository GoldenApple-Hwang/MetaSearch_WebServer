// config.js 파일 import
import './config.js';

import express from 'express';
import cors from 'cors';
import { json, static as expressStatic } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import router from './routes/router.js';


const app = express();

// __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 미들웨어 설정
app.use(cors());
app.use(json());

// 정적 파일 디렉토리 설정
app.use(expressStatic(join(__dirname, 'public'))); // public 폴더 내의 파일들을 정적 파일로 제공
app.use(expressStatic(join(__dirname, '../metasearch_knowledgegraph/build')));

// 라우터 설정
app.use('/', router);

// 서버 리스닝
app.listen(8080, () => {
    console.log('Listening on 8080');
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

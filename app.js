import dotenv from 'dotenv';
dotenv.config();

import express, { json, static as expressStatic } from 'express';
const app = express();
import { join } from 'path';
import cors from 'cors';
import router from './routes/router';

app.use(cors());
app.use(json());
app.use(expressStatic(join(__dirname, '../metasearch_knowledgegraph/build')));

app.use('/', router);

app.listen(8080, function () {
    console.log('listening on 8080')
});

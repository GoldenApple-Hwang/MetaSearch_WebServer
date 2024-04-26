//routes/sendCsvFile.js
import { Router } from "express";
import sendCsvFile from "../services/sendCsvFileService.js"; // CSV 업로드를 위한 미들웨어

const router = Router();

// '/neo4jserver/csv' 경로에 대한 POST 요청 처리
router.post("/", async (req, res) => {
  try {
    const dbName = req.body.dbName; // 요청 바디에서 dbName 추출
    console.log(`POST request to /neo4jserver/csv with ${dbName} `);

    const filePath = await sendCsvFile(dbName);
    res.sendFile(filePath); // 응답으로 csv 파일을 반환

  } catch (error) {
    console.log(`Error sending file: ${error.message}`);
    res.status(404).send({ message: error.message });
  }
});

export default router;

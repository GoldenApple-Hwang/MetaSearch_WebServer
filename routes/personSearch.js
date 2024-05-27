// routes/personSearch.js
import { Router } from "express";
import fetchPhotosByPersonName from "../services/personSearchService.js";
import neo4jModel from "../models/neo4jModel.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { dbName } = req.body;
    const dbExists = await neo4jModel.checkDatabaseExists(dbName); // 데이터베이스 존재 여부 확인
    if (!dbExists) {
      console.log(`${dbName} 이 이름을 가진 db없음`);
      return res.status(400).send({ message: "이미지 분석이 완료되지 않았습니다" });
    }
    
    const { personName } = req.body;
    const data = await fetchPhotosByPersonName(dbName, personName);
    res.json(data);
  } catch (error) {
    console.error(
      `Failed to retrieve data for ${req.params.dbName}: ${error.message}`
    );
    res.status(500).send("Server Error: Unable to retrieve data");
  }
});

export default router;

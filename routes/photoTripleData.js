import { Router } from "express";
import fetchTriplesAsStringService from "../services/photoTripleDataService.js";
import neo4jModel from "../models/neo4jModel.js";

const router = Router();

router.get("/:dbName/:photoName", async (req, res) => {
  try {
    const { dbName } = req.params;
    const dbExists = await neo4jModel.checkDatabaseExists(dbName); // 데이터베이스 존재 여부 확인
    if (!dbExists) {
      console.log(`${dbName} 이 이름을 가진 db없음`);
      return res.status(400).send({ message: "이미지 분석이 완료되지 않았습니다" });
    }
    
    const { photoName } = req.params;
    const data = await fetchTriplesAsStringService(dbName, photoName);
    if (data) {
      res.json(data); // 클라이언트에게 JSON 데이터 전송
    } else {
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.error(`Failed to retrieve data for ${req.params.photoName}: ${error.message}`);
    res.status(500).send("Server Error: Unable to retrieve and export data");
  }
});

export default router;

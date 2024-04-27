import { Router } from "express";
import executeQuery from "../services/nqlSearchService.js";

const router = Router();

router.post("/", async (req, res) => {
  const dbName = req.body.dbName; // 요청 바디에서 dbName 추출
  const query = req.body.query; // 요청 바디에서 query 추출
  try {
    const results = await executeQuery(dbName, query); // 서비스 함수를 호출하여 결과 받기
    console.log(query);
    console.log(results);
    res.json(results); // 결과를 JSON 형태로 클라이언트에게 전송
  } catch (error) {
    console.error(`Error in router while executing query: ${error}`);
    res
      .status(500)
      .send({ message: "Error executing query", error: error.message });
  }
});

export default router;

// routes/changePersonName.js
import { Router } from "express";
import changePersonName from "../services/changePersonNameService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { dbName, oldName, newName } = req.body;
    const result = await changePersonName(dbName, oldName, newName);
    res.status(200).json(result);  // HTTP 200 상태 코드와 함께 결과 반환
  } catch (error) {
    console.error(`Failed to update entity name: ${error.message}`);
    res.status(500).send("Server Error: Unable to update entity name");  // 에러 처리
  }
});

export default router;

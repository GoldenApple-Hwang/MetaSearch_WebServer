// routes/deleteEntity.js
import { Router } from "express";
import neo4jModel from "../models/neo4jModel.js";

const router = Router();

router.post("/", async (req, res) => {
    const dbName = req.body.dbName;
    const entityName = req.body.entityName;
    try {
      const dbExists = await neo4jModel.checkDatabaseExists(dbName);
      if (!dbExists) {
        return res.status(400).send({ message: "이미지 분석이 완료되지 않았습니다" });
      }
  
      await neo4jModel.deleteEntityByName(dbName, entityName);
      res.send({ message: `Entity ${entityName} deleted successfully` });
    } catch (error) {
      console.error(`Error in router while deleting entity: ${error}`);
      res
        .status(500)
        .send({ message: "Error deleting entity", error: error.message });
    }
  });

export default router;
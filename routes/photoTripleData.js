import { Router } from "express";
import fetchTriplesAsStringService from "../services/photoTripleDataService.js";

const router = Router();

router.get("/:dbName/:photoName", async (req, res) => {
  try {
    const { dbName, photoName } = req.params;
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

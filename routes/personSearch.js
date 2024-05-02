// routes/personSearch.js
import { Router } from "express";
import fetchPhotosByPersonName from "../services/personSearchService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { dbName } = req.body;
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

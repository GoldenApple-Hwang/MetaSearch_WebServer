// routes/graphData.js
import { Router } from 'express';
import { fetchGraphData } from '../services/graphDataService';
const router = Router();

router.get('/api/graphData/:dbName', async (req, res) => {
  try {
    const { dbName } = req.params;
    console.log(`/api/graphData/:dbName: ${dbName}`)
    const data = await fetchGraphData(dbName);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;

// routes/peopleFrequencyData.js
import { Router } from 'express';
import fetchPeopleFrequencyData from '../services/peopleFrequencyDataService.js';

const router = Router();

router.get('/:dbName', async (req, res) => {
  try {
    const { dbName } = req.params;
    const data = await fetchPeopleFrequencyData(dbName);
    res.json(data);
  } catch (error) {
    console.error(`Failed to retrieve data for ${req.params.dbName}: ${error.message}`);
    res.status(500).send('Server Error: Unable to retrieve data');
  }
});

export default router;

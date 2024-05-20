// routes/peopleFrequencyData.js
import { Router } from 'express';
import { fetchPeopleFrequencyData, fetchSpecificPeopleFrequencyData } from '../services/peopleFrequencyDataService.js';

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

router.post('/', async (req, res) => {
  try {
    const { dbName, personNames } = req.body;
    const data = await fetchSpecificPeopleFrequencyData(dbName, personNames);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(`Failed to retrieve data for ${dbName}, ${personNames.join(', ')}: ${error.message}`);
    res.status(500).send('Server Error: Unable to retrieve data');
  }
});

export default router;

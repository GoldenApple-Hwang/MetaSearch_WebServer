// routes/propertyTripleData.js
import { Router } from 'express';
import fetchEntityTripleData from '../services/entityTripleDataService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { dbName, entityName } = req.body;
    const data = await fetchEntityTripleData(dbName, entityName);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(`Failed to retrieve data for ${dbName}, ${entityName}: ${error.message}`);
    res.status(500).send('Server Error: Unable to retrieve data');
  }
});

export default router;

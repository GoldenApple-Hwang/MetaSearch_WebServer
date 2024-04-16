// routes/graphData.js
const express = require('express');
const router = express.Router();
const { fetchGraphData } = require('../services/graphDataService');

router.get('/api/graphData/:dbName', async (req, res) => {
  try {
    const { dbName } = req.params;
    const data = await fetchGraphData(dbName);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

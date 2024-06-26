import neo4jModel from '../models/neo4jModel.js';

async function fetchPeopleFrequencyData(dbName) {
  try {
    const frequencyData = await neo4jModel.getPeopleFrequency(dbName);
    return frequencyData;
  } catch (error) {
    console.error(`Error fetching people frequency data: ${error.message}`);
    throw new Error('Failed to fetch people frequency data');
  }
}

async function fetchSpecificPeopleFrequencyData(dbName, personNames) {
  try {
    const frequencyData = await neo4jModel.fetchSpecificPeopleFrequency(dbName, personNames);
    return { frequencies: frequencyData };
  } catch (error) {
    console.error(`Error fetching people frequency data: ${error.message}`);
    throw new Error('Failed to fetch people frequency data');
  }
}


export { fetchPeopleFrequencyData, fetchSpecificPeopleFrequencyData };

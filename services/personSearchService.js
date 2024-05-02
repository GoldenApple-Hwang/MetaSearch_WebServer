import neo4jModel from '../models/neo4jModel.js';

async function fetchPhotosByPersonName(dbName, personName) {
  try {
    const photoNames = await neo4jModel.findPhotosByPersonName(dbName, personName);
    return photoNames;
  } catch (error) {
    console.error(`Error fetching photos for person: ${error.message}`);
    throw new Error('Failed to fetch photos');
  }
}

export default fetchPhotosByPersonName;

import neo4jModel from '../models/neo4jModel.js';

async function fetchTriplesAsStringService(dbName, photoName) {
  try {
    const triplesData = await neo4jModel.fetchTriplesAsString(dbName, photoName);
    return { triple: triplesData };  // 검색된 데이터를 JSON 형식으로 반환
  } catch (error) {
    console.error(`Error fetching triples for ${photoName}: ${error.message}`);
    throw new Error('Failed to fetch triples');  // 오류 메시지를 더 명확하게
  }
}

export default fetchTriplesAsStringService;

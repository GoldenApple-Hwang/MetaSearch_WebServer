// changeEntityNameService.js
import neo4jModel from '../models/neo4jModel.js';

async function changePersonName(dbName, oldName, newName) {
  try {
    await neo4jModel.updateEntityName(dbName, oldName, newName);
    return { message: "Entity name successfully updated." };  // 성공 메시지 반환
  } catch (error) {
    console.error(`Error updating entity name: ${error.message}`);
    throw new Error('Failed to update entity name');
  }
}

export default changePersonName;

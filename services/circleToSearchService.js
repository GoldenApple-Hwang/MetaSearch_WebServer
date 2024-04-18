// services/circleToSearchService.js
const { session, driver } = require("../models/neo4jModel");

async function searchPhotos(properties, dbName) {
  const dbSession = session({ database: dbName });
  let commonPhotos = [];
  let individualPhotos = {};

  try {
    // 각 엔티티에 연결된 사진 찾기
    for (let prop of properties) {
      let queryIndividual = `
      MATCH (photo)-[]->(person {name: $prop}) RETURN DISTINCT photo.name AS PhotoName
      `;
      let resultIndividual = await dbSession.run(queryIndividual, {
        prop: prop,
      });
      individualPhotos[prop] = resultIndividual.records.map((record) =>
        record.get("PhotoName")
      );
    }

    // 공통으로 연결된 사진 찾기
    if (properties.length > 1) {
      let queryCommon = `
      MATCH (e2:Entity)
      WHERE e2.name IN $properties
      WITH e2
      MATCH (photo:Entity)-[r]->(e2)
      WITH photo, COUNT(DISTINCT e2) AS relatedCount
      WHERE relatedCount = SIZE($properties)
      RETURN DISTINCT photo.name AS PhotoName     
      `;
      let resultCommon = await dbSession.run(queryCommon, {
        properties: properties,
      });
      commonPhotos = resultCommon.records.map((record) =>
        record.get("PhotoName")
      );
    }

  } finally {
    await dbSession.close();
  }

  return { commonPhotos, individualPhotos };
}

process.on("exit", () => {
  driver.close();
});

module.exports = { searchPhotos };

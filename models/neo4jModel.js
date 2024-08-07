// models/neo4jModel.js
import neo4j from "neo4j-driver";

const neo4jAddress = process.env.NEO4J_ADDRESS;
const dbUserName = process.env.NEO4J_USER;
const dbPassword = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
  neo4jAddress,
  neo4j.auth.basic(dbUserName, dbPassword)
);

function session(options) {
  return driver.session(options);
}

//데이터베이스의 존재 여부를 확인하는 함수
async function checkDatabaseExists(dbName) {
  const systemSession = driver.session({ database: "system" });
  try {
    let result = await systemSession.run(`SHOW DATABASES`);
    const databases = result.records.map((record) => record.get("name"));
    return databases.includes(dbName);
  } catch (error) {
    console.error("Error checking database existence:", error);
    throw error;
  } finally {
    await systemSession.close();
  }
}

//데이터베이스가 없으면 해당 db를 생성하는 함수
async function createDatabaseIfNotExists(dbName) {
  const systemSession = driver.session({ database: "system" }); // Neo4j 데이터베이스 관리 시스템(DBMS)의 관리 작업을 수행하는 데 사용되는 특별한 데이터베이스
  try {
    // 데이터베이스 존재 여부 확인
    let result = await systemSession.run(`SHOW DATABASES`);
    const databases = result.records.map((record) => record.get("name"));
    if (!databases.includes(dbName)) {
      // 데이터베이스가 존재하지 않으면 생성
      await systemSession.run(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created`);
      //해당 db에 대한 세션을 열어 인덱스 생성
      const session = driver.session({ database: dbName });
      try {
        // 인덱스 생성
        await session.run(`CREATE INDEX FOR (e:Entity) ON (e.name)`);
        console.log(`Index for ${dbName} on 'name' created`);
      } catch (indexError) {
        console.error("Error creating index:", indexError);
      } finally {
        await session.close();
      }
    } else {
      // 데이터베이스가 이미 존재하는 경우
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error("Error in database creation/check:", error);
  } finally {
    await systemSession.close();
  }
}

//데이터베이스에서 그래프를 삭제하는 함수
async function clearDatabase(dbName) {
  const session = driver.session({ database: dbName });
  try {
    await session.run("MATCH (n) DETACH DELETE n");
    console.log(`All data in ${dbName} has been cleared.`);
  } catch (error) {
    console.error(`Error clearing data in ${dbName}:`, error);
  } finally {
    await session.close();
  }
}

//db에 csv 파일을 그래프형태로 로드하는 함수
async function loadCsvToNeo4j(dbName) {
  await createDatabaseIfNotExists(dbName); //데이터베이스가 존재하지 않으면 먼저 데이터베이스를 만든다
  await clearDatabase(dbName); // 트리플 삭제를 반영하기 위해 먼저 데이터베이스를 비움
  const session = driver.session({ database: dbName });

  try {
    // CSV 파일 로드 및 데이터 처리. 노드, 관계 모두 중복되지 않도록.
    const result = await session.run(
      `CALL apoc.periodic.iterate(
        "LOAD CSV WITH HEADERS FROM 'file:///${dbName}.csv' AS row RETURN row",
        "MERGE (e1:Entity {name: row.Entity1})
         MERGE (e2:Entity {name: row.Entity2})
         WITH e1, e2, row
         CALL apoc.merge.relationship(e1, row.Relationship, {}, {}, e2, {})
         YIELD rel
         RETURN e1, rel, e2",
        {batchSize:500, parallel:false}
      )`
    );
    console.log(`${dbName} loaded to Neo4j ${dbName} database successfully`);
  } catch (error) {
    console.error(`Error loading data to Neo4j ${dbName}:`, error);
  } finally {
    await session.close();
  }
}

// 자연어 쿼리를 실행하는 함수
async function executeQuery(dbName, query) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(query);
    console.log(`Query executed successfully on ${dbName}`);
    return result; // 실행 결과 반환
  } catch (error) {
    console.error(`Error executing query on ${dbName}:`, error);
    throw error; // 에러 발생 시, 이를 호출한 곳에서 처리할 수 있도록 예외를 던짐
  } finally {
    await session.close();
  }
}

//그래프 내의 전체 인물들의 빈도수를 쿼리하는 함수
async function getPeopleFrequency(dbName) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      "MATCH (e1:Entity)-[r:인물]->(e2:Entity) " +
        "RETURN e2.name AS Entity, COUNT(r) AS Frequency " +
        "ORDER BY Frequency DESC"
    );
    console.log(`People frequency data retrieved successfully from ${dbName}`);
    return result.records.map((record) => ({
      entity: record.get("Entity"),
      frequency: record.get("Frequency").low,
    }));
  } catch (error) {
    console.error(
      `Error retrieving people frequency data from ${dbName}:`,
      error
    );
    throw error;
  } finally {
    await session.close();
  }
}

//그래프에서 인물 이름으로 사진을 찾는 함수
async function findPhotosByPersonName(dbName, personName) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      "MATCH (photo:Entity)-[:인물]->(person:Entity) " +
        "WHERE person.name = $personName " +
        "RETURN photo.name AS photos",
      { personName: personName }
    );
    console.log(`Photos retrieved successfully for person ${personName}`);
    return result.records.map((record) => record.get("photos"));
  } catch (error) {
    console.error(`Error retrieving photos for person ${personName}:`, error);
    throw error;
  } finally {
    await session.close();
  }
}

//그래프의 엔티티 이름을 변경하는 함수 
async function updateEntityName(dbName, oldName, newName) {
  const session = driver.session({ database: dbName });
  try {
    await session.run(
      "MATCH (e:Entity {name: $oldName}) " + "SET e.name = $newName",
      { oldName: oldName, newName: newName }
    );
    console.log(
      `Entity name updated successfully from ${oldName} to ${newName}`
    );
  } catch (error) {
    console.error(
      `Error updating entity name from ${oldName} to ${newName}:`,
      error
    );
    throw error;
  } finally {
    await session.close();
  }
}

// 특정 엔티티와 관련된 트리플 데이터를 쿼리하는 함수
async function fetchEntityTripleData(dbName, entityName) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      `MATCH (n:Entity {name: $entityName})-[r]-(m)
           RETURN n, r, m`,
      { entityName: entityName }
    );
    return result.records;
  } catch (error) {
    throw new Error(`Error fetching data for ${entityName}: ${error}`);
  } finally {
    await session.close();
  }
}

// 특정 인물 노드의 빈도수를 쿼리하는 함수
async function fetchSpecificPeopleFrequency(dbName, personNames) {
  const session = driver.session({ database: dbName });
  try {
    const query = `
      UNWIND $personNames AS personName
      MATCH (photo:Entity)-[:인물]->(person:Entity {name: personName})
      RETURN person.name AS Entity, COUNT(photo) AS Frequency
      ORDER BY Frequency DESC
    `;
    const result = await session.run(query, { personNames });
    return result.records.map(record => ({
      personName: record.get("Entity"),
      frequency: record.get("Frequency").low  // Neo4j integer to JavaScript number
    }));
  } catch (error) {
    console.error(`Error retrieving specific people frequency data from ${dbName}:`, error);
    throw error;
  } finally {
    await session.close();
  }
}

// 특정 엔티티에 대한 트리플 정보를 리턴하는 함수 (사진 설명에 사용하기 위해)
async function fetchTriplesAsString(dbName, photoName) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      "MATCH (photo:Entity {name: $photoName})-[r]->(related) " +
      "RETURN photo.name AS Photo, type(r) AS Relationship, related.name AS RelatedEntity " +
      "ORDER BY type(r), related.name",
      { photoName }
    );
    const textData = result.records.map(record => 
      `${record.get('Photo')},${record.get('Relationship')},${record.get('RelatedEntity')}`
    ).join('\n');
    return textData; // 문자열 데이터 리턴
  } catch (error) {
    console.error('Error fetching triples:', error);
    throw error;
  } finally {
    await session.close();
  }
}

async function fetchOneHopNodesData(dbName, nodeLabel) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      `MATCH (entity:Entity {name: $nodeLabel}), path=(entity)-[*..1]-(connectedNode)
       RETURN path`,
      { nodeLabel: nodeLabel }
    );
    console.log(result);
    const segments = []; // 모든 세그먼트를 저장할 단일 배열 생성
    result.records.forEach((record) => {
      const path = record.get("path");
      path.segments.forEach((segment) => {
        segments.push({
          id: segment.relationship.identity.low,
          source: segment.relationship.start.low,
          type: segment.relationship.type,
          target: segment.relationship.end.low,
        });
      });
    });
    return segments; // 평탄화된 세그먼트 배열 반환
  } catch (error) {
    console.error(`Error fetching one hop nodes data from ${dbName}:`, error);
    throw error;
  } finally {
    await session.close();
  }
}

// 특정 엔티티를 삭제하는 함수
async function deleteEntityByName(dbName, entityName) {
  const session = driver.session({ database: dbName });
  try {
    await session.run(
      "MATCH (e:Entity {name: $name}) DETACH DELETE e",
      { name: entityName }
    );
    console.log(`Entity with name ${entityName} deleted from ${dbName}`);
  } catch (error) {
    console.error(`Error deleting entity from ${dbName}:`, error);
    throw error;
  } finally {
    await session.close();
  }
}

export default {
  session,
  driver,
  checkDatabaseExists,
  loadCsvToNeo4j,
  executeQuery,
  getPeopleFrequency,
  findPhotosByPersonName,
  fetchOneHopNodesData,
  updateEntityName,
  fetchEntityTripleData,
  fetchSpecificPeopleFrequency,
  fetchTriplesAsString,
  deleteEntityByName
};

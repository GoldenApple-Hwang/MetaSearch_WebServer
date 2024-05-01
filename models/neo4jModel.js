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
        {batchSize:1000, parallel:true}
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

async function getPeopleFrequency(dbName) {
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      "MATCH (e1:Entity)-[r:인물]->(e2:Entity) " +
      "RETURN e2.name AS Entity, COUNT(r) AS Frequency " +
      "ORDER BY Frequency DESC"
    );
    console.log(`People frequency data retrieved successfully from ${dbName}`);
    return result.records.map(record => ({
      entity: record.get('Entity'),
      frequency: record.get('Frequency')
    }));
  } catch (error) {
    console.error(`Error retrieving people frequency data from ${dbName}:`, error);
    throw error;
  } finally {
    await session.close();
  }
}

export default { session, driver, loadCsvToNeo4j, executeQuery, getPeopleFrequency };

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
  const systemSession = driver.session({ database: 'system' }); // Neo4j 데이터베이스 관리 시스템(DBMS)의 관리 작업을 수행하는 데 사용되는 특별한 데이터베이스
  try {
      // 데이터베이스 존재 여부 확인
      let result = await systemSession.run(`SHOW DATABASES`);
      const databases = result.records.map(record => record.get('name'));
      if (!databases.includes(dbName)) {
          // 데이터베이스가 존재하지 않으면 생성
          await systemSession.run(`CREATE DATABASE ${dbName}`);
          console.log(`Database ${dbName} created`);
      }
  } catch (error) {
      console.error('Error in database creation/check:', error);
  } finally {
      await systemSession.close();
  }
}

async function loadCsvToNeo4j(dbName) {
  await createDatabaseIfNotExists(dbName);
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run(
      `LOAD CSV WITH HEADERS FROM 'file:///${dbName}.csv' AS row
                MERGE (e1:Entity {name: row.Entity1})
                MERGE (e2:Entity {name: row.Entity2})
                WITH e1, e2, row
                CALL apoc.create.relationship(e1, row.Relationship, {}, e2) YIELD rel
                RETURN e1, rel, e2`
    );
    console.log(`${dbName} loaded to Neo4j ${dbName} database successfully`);
  } catch (error) {
    console.error(`Error loading data to Neo4j ${dbName}:`, error);
  } finally {
    await session.close();
  }
}

export default { session, driver, loadCsvToNeo4j };

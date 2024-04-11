const express = require('express')
const app = express()
const path = require('path')

app.listen(8080, function () {
  console.log('listening on 8080')
})

app.use(express.json());
var cors = require('cors'); //npm install cors --save
app.use(cors());

app.use(express.static(path.join(__dirname, '../metasearch_knowledgegraph/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../metasearch_knowledgegraph/build/index.html'))
})

//neo4j에서 데이터 가져오기
const neo4j = require('neo4j-driver'); //npm install --save neo4j-driver

// Neo4j 데이터베이스 설정
const neo4jAddress = "bolt://113.198.85.4:80";
const dbUserName = "neo4j";
const dbPassword = "12345678";
//const dbName = "youjeong";

// Neo4j 데이터베이스 설정
const driver = neo4j.driver(
  neo4jAddress,
  neo4j.auth.basic(dbUserName, dbPassword)
);

// 데이터를 불러오는 API 엔드포인트
app.get('/api/graphData/:dbName', async (req, res) => {
  const dbName = req.params.dbName; // URL에서 dbName 추출
  console.log(dbName);
  if (!dbName) {
    return res.status(400).send("dbName is required");
  }
  const session = driver.session({ database: dbName });
  try {
    const result = await session.run("MATCH (n)-[r]->(m) RETURN n, r, m");
    const nodesMap = new Map(); // 중복 노드 방지를 위한 Map
    const links = [];

    result.records.forEach((record) => {
      const n = record.get("n");
      const r = record.get("r");
      const m = record.get("m");

      // nodes 배열에 노드 정보 추가
      // Map을 사용하여 중복된 노드를 추가하지 않도록 한다.
      if (!nodesMap.has(n.identity.low)) {
        nodesMap.set(n.identity.low, {
          id: n.identity.low,
          label: n.properties.name,
          group: 0,
        });
      }

      if (!nodesMap.has(m.identity.low)) {
        nodesMap.set(m.identity.low, {
          id: m.identity.low,
          label: m.properties.name,
          group: 1,
        });
      }

      // links 배열에 관계 정보 추가
      links.push({
        source: r.end.low, //.toNumber(),
        target: r.start.low, //.toNumber(),
        type: r.type,
      });
    });

    const nodes = Array.from(nodesMap.values());
    res.json({ nodes, links });
  } catch (error) {
    console.error("Error fetching data from Neo4j", error);
    res.status(500).send("Error fetching data from Neo4j");
  } finally {
    await session.close();
  }
}); 

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../metasearch_knowledgegraph/build/index.html'));
});

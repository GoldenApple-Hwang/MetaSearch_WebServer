import neo4j from '../models/neo4jModel.js';

async function fetchGraphData(dbName) {
  const session = neo4j.session({ database: dbName });
  try {
    const result = await session.run("MATCH (n)-[r]->(m) RETURN n, r, m");
    return getGraphData(result);
  } finally {
    await session.close();
  }
};

function getGraphData(result) {
    const nodesMap = new Map();
    const links = [];
  
    result.records.forEach(record => {
      const n = record.get("n");
      const r = record.get("r");
      const m = record.get("m");
  
      // Map을 사용하여 노드 중복을 방지하고, 각 노드에 대한 정보를 저장
      if (!nodesMap.has(n.identity.low)) {
        nodesMap.set(n.identity.low, {
          id: n.identity.low,
          label: n.properties.name,
          group: 0, // 혹은 노드 속성에 따라 다른 그룹 할당
          properties: n.properties // 추가 속성 포함시킬 수 있음
        });
      }
  
      if (!nodesMap.has(m.identity.low)) {
        nodesMap.set(m.identity.low, {
          id: m.identity.low,
          label: m.properties.name,
          group: 1, // 혹은 노드 속성에 따라 다른 그룹 할당
          properties: m.properties // 추가 속성 포함시킬 수 있음
        });
      }
  
      // 노드 간의 관계를 링크 배열에 추가
      links.push({
        id: r.identity.low,
        source: n.identity.low, // 시작 노드
        target: m.identity.low, // 종료 노드
        type: r.type, // 관계 유형
        properties: r.properties // 관계의 추가 속성이 있을 경우 포함
      });
    });
  
    // Map에서 노드 데이터 배열로 변환
    const nodes = Array.from(nodesMap.values());
  
    // 최종적으로 노드와 링크의 리스트를 반환
    return { nodes, links };
  }

export default fetchGraphData;
  
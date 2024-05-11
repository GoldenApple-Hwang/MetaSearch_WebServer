import neo4jModel from "../models/neo4jModel.js";

async function fetchEntityTripleData(dbName, entityName) {
  try {
    // 비동기 함수 호출에는 await을 사용
    const records = await neo4jModel.fetchEntityTripleData(dbName, entityName);

    const nodesMap = new Map();
    const links = [];

    records.forEach((record) => {
      const n = record.get("n");
      const r = record.get("r");
      const m = record.get("m");

      // identity를 문자열로 변환
      const nIdentityStr = n.properties.name.toString();
      const mIdentityStr = m.properties.name.toString();

      // 점이 포함되어 있으면 group을 0으로, 아니면 1로 설정
      const nGroup = nIdentityStr.includes(".") ? 0 : 1;
      const mGroup = mIdentityStr.includes(".") ? 0 : 1;

      // 노드 중복 체크 및 노드 정보 저장
      if (!nodesMap.has(n.identity.low)) {
        nodesMap.set(n.identity.low, {
          id: n.identity.low,
          label: n.properties.name,
          group: nGroup, // 혹은 노드 속성에 따라 다른 그룹 할당
        });
      }

      if (!nodesMap.has(m.identity.low)) {
        nodesMap.set(m.identity.low, {
          id: m.identity.low,
          label: m.properties.name,
          group: mGroup, // 혹은 노드 속성에 따라 다른 그룹 할당
        });
      }

      // 노드 간의 관계를 링크 배열에 추가
      links.push({
        id: r.identity.low,
        source: n.identity.low, // 시작 노드
        target: m.identity.low, // 종료 노드
        type: r.type, // 관계 유형
      });
    });

    // Map에서 배열로 변환하여 노드 리스트 생성
    const nodes = Array.from(nodesMap.values());
    return { nodes, links };
  } catch (error) {
    console.error(`Service error: ${error.message}`);
    throw new Error("Failed to fetch entity triple data");
  }
}

export default fetchEntityTripleData;

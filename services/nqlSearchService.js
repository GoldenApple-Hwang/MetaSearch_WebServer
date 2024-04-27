// services/nqlqueryService.js
import neo4jModel from "../models/neo4jModel.js"; // 모델에서 필요한 함수 불러오기

// DB 이름과 쿼리를 매개변수로 받아 실행하고 결과를 반환하는 함수
async function executeQuery(dbName, query) {
    try {
        const result = await neo4jModel.executeQuery(dbName, query); // 모델의 쿼리 실행 함수 호출
        // 결과를 객체 배열로 변환하여 반환
        const photoNames = result.records.map(record => record.get('PhotoName'));
        return { PhotoName: photoNames }; // 모든 사진 이름을 배열로 반환
    } catch (error) {
        console.error(`Error executing query in service layer: ${error}`);
        throw error; // 에러 발생 시, 호출한 곳에서 처리할 수 있도록 예외를 던짐
    }
}

export default executeQuery;

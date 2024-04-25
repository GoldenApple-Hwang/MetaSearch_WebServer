// services/sendCsvFileService.js
import fs from 'fs';
import path from 'path';

// CSV 파일이 저장된 디렉토리 경로 설정
const csvDirectoryPath = 'C:/Users/hwang/.Neo4jDesktop/relate-data/dbmss/dbms-03774803-1a7b-4c49-bbce-e4aeb8c59827/import';

// dbName을 이용해 해당 CSV 파일을 찾아 보내주는 함수
async function sendCsvFile(dbName) {
  const filePath = path.join(csvDirectoryPath, `${dbName}.csv`);

  try {
    // 파일 존재 여부 확인
    await fs.promises.access(filePath, fs.constants.F_OK);
    // 파일 경로 반환
    return filePath;
  } catch (error) {
    // 파일이 없으면 오류 메시지와 함께 에러 객체 반환
    throw new Error('CSV file not found.');
  }
}

export default sendCsvFile;

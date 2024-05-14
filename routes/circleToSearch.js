// routes/circleToSearch.js
import { Router } from "express";
import searchPhotos from "../services/circleToSearchService.js";
const router = Router();

// '/android/circleToSearch' 경로에 대한 POST 요청 처리
router.post("/", async (req, res) => {
  try {
    const { dbName } = req.body; // 요청 바디에서 dbName 추출
    const { properties } = req.body; // 요청 바디에서 properties 추출
    console.log(
      `POST request to /android/circleToSearch/${dbName} with properties: ${properties}`
    );

    const photos = await searchPhotos(properties, dbName);

    // 공통된 사진과 개별 사진이 모두 비어있는 경우
    if (photos.commonPhotos.length === 0 && Object.keys(photos.individualPhotos).length === 0) {
      return res.status(200).json({ message: "No photos found for the given properties." });
    }

    console.log(photos)
    res.json({ photos }); // 응답으로 사진 이름들을 JSON 형태로 반환
  } catch (error) {
    console.error("Error processing search request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

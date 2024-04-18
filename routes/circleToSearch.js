// routes/circleToSearch.js
const express = require("express");
const router = express.Router();
const { searchPhotos } = require("../services/circleToSearchService");

// '/android/circleToSearch' 경로에 대한 POST 요청 처리
router.post("/android/circleToSearch", async (req, res) => {
  try {
    const { dbName } = req.body; // 요청 바디에서 dbName 추출
    const { properties } = req.body; // 요청 바디에서 properties 추출
    console.log(
      `POST request to /android/circleToSearch/${dbName} with properties: ${properties}`
    );

    const photos = await searchPhotos(properties, dbName);
    res.json({ photos }); // 응답으로 사진 이름들을 JSON 형태로 반환
  } catch (error) {
    console.error("Error processing search request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

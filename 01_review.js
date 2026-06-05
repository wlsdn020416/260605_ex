// 환경변수 불러오기
const dotenv = require("dotenv");
dotenv.config();
// require("dotenv").config()

// 의존성
const express = require("express");

// 서버 세팅
const PORT = process.env.PORT ?? 3000; // 기본값
const app = express();

app.listen(PORT, () => {
  console.log(`${PORT}에서 Listen 중`);
});

// npx nodemon 01_review.js
// 현재 터미널에 01_review.js가 있어야함 & 현재 터미널에 package.json이 있어야함
// npm run 01

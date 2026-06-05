// 환경변수
const dotenv = require("dotenv");
dotenv.config();

// 의존성
const express = require("express");
// Provider
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatGroq } = require("@langchain/groq");
const { ChatOpenAI } = require("@langchain/openai");
// Core
const { PromptTemplate } = require("@langchain/core/prompts");
const { HumanMessage } = require("@langchain/core/messages");

// 서버 구동
const PORT = process.env.PORT_03 ?? 3000;
const app = express();

// 미들웨어
app.use(express.json());

// 엔드포인트
app.post("/chat", async (req, res) => {
  console.log("[요청 해석]");
  const { provider, modelName, ask } = req.body;
  let model;
  switch (provider) {
    case "google-genai":
      model = await useGoogleGenAI(modelName);
      break;
    case "groq":
      model = await useGroq(modelName);
      break;
    case "nim":
      model = await useNim(modelName);
      break;
    default:
      throw new Error("지원하지 않는 Provider");
  }

  console.log("[프롬프트 포맷팅]");

  const promptTemplate = PromptTemplate.fromTemplate(
    "당신은 MBTI가 {mbti}인 {job}입니다. 본인의 성격과 직업적 특징에 맞춰 뒤에 질문에 대답해주세요. {ask}",
  );
  const formattedPrompt = await promptTemplate.format({
    mbti: "ESFP",
    ask: ask,
    job: "취업준비생",
  });

  console.log("[모델 호출]");

  const response = await model.invoke([new HumanMessage(formattedPrompt)]);

  console.log("[결과 정리]");

  console.log(response.text);

  console.log("[응답 전송]");

  res.json({
    answer: response.text,
  });
});

// 커스텀 함수
async function useGoogleGenAI(model) {
  // [Model]
  // gemini-3.1-flash-lite
  // gemma-4-26b-a4b-it // moe
  // gemma-4-31b-it // dense
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model,
    temperature: 0.7,
    maxOutputTokens: 512,
  });
}

async function useGroq(model) {
  // [Model]
  // openai/gpt-oss-20b // 빠름
  // openai/gpt-oss-120b // 생각 깊음
  // qwen/qwen3-32b // 추론형 모델 (thinking)
  // meta-llama/llama-4-scout-17b-16e-instruct
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model,
    temperature: 0.7,
    maxOutputTokens: 512,
  });
}

async function useNim(model) {
  // [Model]
  // deepseek-ai/deepseek-v4-flash
  // deepseek-ai/deepseek-v4-pro
  // google/gemma-4-31b-it
  // nvidia/nemotron-4-340b-instruct
  return new ChatOpenAI({
    apiKey: process.env.NIM_API_KEY,
    configuration: {
      baseURL: "https://integrate.api.nvidia.com/v1",
    },
    model,
    temperature: 0.7,
    maxOutputTokens: 512,
  });
}

// 리스너
app.listen(PORT, () => {
  console.log(`${PORT}에서 Listen 중`);
});

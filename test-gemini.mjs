import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("❌ GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash"
});

try {
  const result = await model.generateContent("Say exactly: Gemini is working!");
  const response = await result.response;

  console.log("✅ GEMINI IS WORKING!");
  console.log(response.text());
} catch (error) {
  console.log("❌ GEMINI ERROR:");
  console.log(error.message);
}
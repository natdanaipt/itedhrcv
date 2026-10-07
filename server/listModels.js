import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
  const response = await ai.models.list();
  
  if (response.pageInternal) {
    response.pageInternal.forEach(m => console.log(m.name));
  } else if (response.models) {
    response.models.forEach(m => console.log(m.name));
  } else {
    console.log(Object.keys(response));
  }
}

listModels().catch(console.error);

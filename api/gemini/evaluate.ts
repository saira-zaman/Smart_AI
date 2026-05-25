import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const EVALUATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    feedback: { type: Type.STRING },
    score: { type: Type.NUMBER },
    improvedAnswer: { type: Type.STRING }
  },
  required: ["feedback", "score"]
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set. Add it in Vercel Environment Variables.' });
    return;
  }

  const { question, userAnswer, persona } = req.body || {};
  if (!question || !userAnswer) {
    res.status(400).json({ error: 'Missing question or userAnswer' });
    return;
  }

  const prompt = `
    As a ${persona}, evaluate this interview answer.
    Question: ${question}
    Answer: ${userAnswer}

    Score from 1-10 and provide honest feedback.
    Also suggest an improved version of the answer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: EVALUATION_SCHEMA as any,
      },
    });

    const data = response.text ? JSON.parse(response.text) : { feedback: "", score: 0 };
    res.status(200).json(data);
  } catch (err: any) {
    console.error('evaluate error', err);
    res.status(500).json({ error: String(err) });
  }
}

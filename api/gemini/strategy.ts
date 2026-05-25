import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const STRATEGY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          task: { type: Type.STRING },
          priority: { type: Type.STRING }
        }
      }
    }
  }
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { resumeText, jobDescription } = req.body || {};
  if (!resumeText || !jobDescription) {
    res.status(400).json({ error: 'Missing resumeText or jobDescription' });
    return;
  }

  const prompt = `
    Create a 30-day career strategy for a candidate to land this role.
    Resume: ${resumeText}
    Target Job: ${jobDescription}

    Provide specific, actionable tasks with priority levels.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: STRATEGY_SCHEMA as any,
      },
    });

    const data = response.text ? JSON.parse(response.text) : { plan: [] };
    res.status(200).json(data);
  } catch (err: any) {
    console.error('strategy error', err);
    res.status(500).json({ error: String(err) });
  }
}

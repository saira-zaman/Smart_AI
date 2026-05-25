import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const IMPROVEMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    boostedProbability: { type: Type.NUMBER },
    improvedResume: { type: Type.STRING, description: "Markdown formatted optimized resume." },
    coverLetter: { type: Type.STRING },
    outreachMessages: {
      type: Type.OBJECT,
      properties: {
        linkedin: { type: Type.STRING },
        email: { type: Type.STRING }
      }
    }
  },
  required: ["boostedProbability", "improvedResume", "coverLetter"]
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

  const { resumeText, jobDescription, analysis } = req.body || {};
  if (!resumeText || !jobDescription) {
    res.status(400).json({ error: 'Missing resumeText or jobDescription' });
    return;
  }

  const prompt = `
    Based on the following analysis and job description, rewrite the resume to maximize selection probability.
    Job Description: ${jobDescription}
    Original Resume: ${resumeText}
    Previous Analysis: ${JSON.stringify(analysis)}

    Use the Google XYZ formula for bullet points. Optimize for ATS.
    Also generate a cover letter and outreach messages.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: IMPROVEMENT_SCHEMA as any,
      },
    });

    const data = response.text ? JSON.parse(response.text) : {};
    res.status(200).json(data);
  } catch (err: any) {
    console.error('fixAndApply error', err);
    res.status(500).json({ error: String(err) });
  }
}

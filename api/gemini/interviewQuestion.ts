import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const INTERVIEW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    context: { type: Type.STRING, description: "Why this question is being asked by this persona." }
  },
  required: ["question", "context"]
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

  const { persona, jobDescription, resumeText } = req.body || {};
  if (!persona || !jobDescription) {
    res.status(400).json({ error: 'Missing persona or jobDescription' });
    return;
  }

  const prompt = `
    You are a ${persona} interviewing a candidate for this role.
    Job: ${jobDescription}
    Resume: ${resumeText || "Not provided"}

    Ask a challenging, role-specific interview question that would be asked by someone with the persona "${persona}".
    Make it behavior-based or technical depending on the role.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: INTERVIEW_SCHEMA as any,
      },
    });

    const data = response.text ? JSON.parse(response.text) : { question: "", context: "" };
    res.status(200).json(data);
  } catch (err: any) {
    console.error('interviewQuestion error', err);
    res.status(500).json({ error: String(err) });
  }
}

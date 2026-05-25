import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Proficient"] }
        }
      },
      description: "Extracted technical and soft skills with estimated proficiency levels."
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          metrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Measurable impacts found." },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vague points or lack of impact." }
        }
      }
    },
    rejectionIntelligence: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Brutally honest reasons why a recruiter might reject this resume for the target role."
    },
    selectionProbability: {
      type: Type.NUMBER,
      description: "Chance of selection (0-100)."
    },
    missingSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          daysToLearn: { type: Type.NUMBER },
          roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  },
  required: ["skills", "rejectionIntelligence", "selectionProbability", "missingSkills"]
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

  const { resumeText, jobDescription, interests } = req.body || {};
  if (!resumeText || !jobDescription) {
    res.status(400).json({ error: 'Missing resumeText or jobDescription' });
    return;
  }

  const prompt = `
    Analyze this resume for a candidate interested in "${(interests || []).join(", ")}".
    Target Job Description: ${jobDescription}
    Resume Content: ${resumeText}

    Provide a brutally honest recruiter-style analysis.
    Identify missing skills and estimate time to learn them.
    Calculate a realistic selection probability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA as any,
      },
    });

    const data = response.text ? JSON.parse(response.text) : {};
    res.status(200).json(data);
  } catch (err: any) {
    console.error('analyze error', err);
    res.status(500).json({ error: String(err) });
  }
}

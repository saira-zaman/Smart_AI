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
    },
    rejectionIntelligence: { type: Type.ARRAY, items: { type: Type.STRING } },
    selectionProbability: { type: Type.NUMBER },
    missingSkills: { type: Type.ARRAY }
  },
  required: ["skills", "rejectionIntelligence", "selectionProbability", "missingSkills"],
};

const IMPROVEMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    boostedProbability: { type: Type.NUMBER },
    improvedResume: { type: Type.STRING },
    coverLetter: { type: Type.STRING },
  },
  required: ["boostedProbability", "improvedResume", "coverLetter"],
};

const INTERVIEW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    context: { type: Type.STRING }
  },
  required: ["question", "context"],
};

const EVALUATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    feedback: { type: Type.STRING },
    score: { type: Type.NUMBER },
    improvedAnswer: { type: Type.STRING }
  },
  required: ["feedback", "score", "improvedAnswer"],
};

const STRATEGY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    plan: { type: Type.ARRAY }
  }
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const body = req.body || (await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => data += chunk);
    req.on('end', () => resolve(JSON.parse(data || '{}')));
  }));

  const { action } = body;

  try {
    if (action === 'analyze') {
      const { resumeText, jobDescription, interests } = body;
      const prompt = `Analyze this resume for a candidate interested in "${(interests || []).join(', ')}".\nTarget Job Description: ${jobDescription}\nResume Content: ${resumeText}\nProvide a brutally honest recruiter-style analysis. Identify missing skills and estimate time to learn them. Calculate a realistic selection probability.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: ANALYSIS_SCHEMA as any }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    if (action === 'improve') {
      const { resumeText, jobDescription, analysis } = body;
      const prompt = `Based on the following analysis and job description, rewrite the resume to maximize selection probability. Job Description: ${jobDescription} Original Resume: ${resumeText} Previous Analysis: ${JSON.stringify(analysis)} Use the Google XYZ formula for bullet points. Optimize for ATS. Also generate a cover letter and outreach messages.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: IMPROVEMENT_SCHEMA as any }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    if (action === 'interview') {
      const { persona, jobDescription, resumeText } = body;
      const prompt = `Act as a "${persona}" interviewer. Based on this job description: ${jobDescription} And this candidate's resume: ${resumeText} Ask ONE dynamic, high-stakes interview question.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: INTERVIEW_SCHEMA as any }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    if (action === 'evaluate') {
      const { question, answer, persona } = body;
      const prompt = `Evaluate the candidate's answer to the question: "${question}" The candidate's answer: "${answer}" The interviewer persona is: "${persona}" Provide constructive feedback and a score (0-100), and a significantly improved version of the answer.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: EVALUATION_SCHEMA as any }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    if (action === 'strategy') {
      const { resumeText, jobDescription } = body;
      const prompt = `Based on this job description: ${jobDescription} And this candidate's resume: ${resumeText} Generate a 60-day strategic roadmap to land this job or a similar role. Include daily tasks and priorities.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: STRATEGY_SCHEMA as any }
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    return res.status(400).send('Unknown action');
  } catch (err: any) {
    console.error('Gemini API error', err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

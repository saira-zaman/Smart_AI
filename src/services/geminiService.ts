import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const ANALYSIS_SCHEMA = {
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

export const IMPROVEMENT_SCHEMA = {
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

export const STRATEGY_SCHEMA = {
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

export async function analyzeResume(resumeText: string, jobDescription: string, interests: string[]) {
  const prompt = `
    Analyze this resume for a candidate interested in "${interests.join(", ")}".
    Target Job Description: ${jobDescription}
    Resume Content: ${resumeText}
    
    Provide a brutally honest recruiter-style analysis.
    Identify missing skills and estimate time to learn them.
    Calculate a realistic selection probability.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function fixAndApply(resumeText: string, jobDescription: string, analysis: any) {
  const prompt = `
    Based on the following analysis and job description, rewrite the resume to maximize selection probability.
    Job Description: ${jobDescription}
    Original Resume: ${resumeText}
    Previous Analysis: ${JSON.stringify(analysis)}
    
    Use the Google XYZ formula for bullet points. Optimize for ATS.
    Also generate a cover letter and outreach messages.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: IMPROVEMENT_SCHEMA as any,
    },
  });

  return JSON.parse(response.text || "{}");
}

export const INTERVIEW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    context: { type: Type.STRING, description: "Why this question is being asked by this persona." }
  },
  required: ["question", "context"]
};

export const EVALUATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    feedback: { type: Type.STRING },
    score: { type: Type.NUMBER },
    improvedAnswer: { type: Type.STRING }
  },
  required: ["feedback", "score", "improvedAnswer"]
};

export async function getInterviewQuestion(persona: string, jobDescription: string, resumeText: string) {
  const prompt = `
    Act as a "${persona}" interviewer.
    Based on this job description: ${jobDescription}
    And this candidate's resume: ${resumeText}
    Ask ONE dynamic, high-stakes interview question.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: INTERVIEW_SCHEMA as any,
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function evaluateAnswer(question: string, answer: string, persona: string) {
  const prompt = `
    Evaluate the candidate's answer to the question: "${question}"
    The candidate's answer: "${answer}"
    The interviewer persona is: "${persona}"
    Provide constructive feedback and a score (0-100), and a significantly improved version of the answer.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: EVALUATION_SCHEMA as any,
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function getCareerStrategy(resumeText: string, jobDescription: string) {
  const prompt = `
    Based on this job description: ${jobDescription}
    And this candidate's resume: ${resumeText}
    Generate a 60-day strategic roadmap to land this job or a similar role.
    Include daily tasks and priorities.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: STRATEGY_SCHEMA as any,
    },
  });

  return JSON.parse(response.text || "{}");
}

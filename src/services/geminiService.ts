// Client-side wrapper: forward requests to a secure server endpoint.
// The server (e.g. Vercel functions) will hold the real GEMINI_API_KEY.

async function post(action: string, payload: any) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload })
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;

    try {
      const parsed = JSON.parse(text);
      message = parsed.error || parsed.message || text;
    } catch {
      // Keep the raw response text when the server did not return JSON.
    }

    if (message.includes('PERMISSION_DENIED') || message.includes('denied access')) {
      throw new Error('Gemini API access denied. Check the GEMINI_API_KEY, API project permissions, and GEMINI_MODEL in Vercel.');
    }

    throw new Error(`API error: ${res.status} ${message}`);
  }

  return res.json();
}

export async function analyzeResume(resumeText: string, jobDescription: string, interests: string[]) {
  return post('analyze', { resumeText, jobDescription, interests });
}

export async function fixAndApply(resumeText: string, jobDescription: string, analysis: any) {
  return post('improve', { resumeText, jobDescription, analysis });
}

export async function getInterviewQuestion(persona: string, jobDescription: string, resumeText: string) {
  return post('interview', { persona, jobDescription, resumeText });
}

export async function evaluateAnswer(question: string, answer: string, persona: string) {
  return post('evaluate', { question, answer, persona });
}

export async function getCareerStrategy(resumeText: string, jobDescription: string) {
  return post('strategy', { resumeText, jobDescription });
}

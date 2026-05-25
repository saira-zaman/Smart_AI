export async function analyzeResume(resumeText: string, jobDescription: string, interests: string[]) {
  const res = await fetch('/api/gemini/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription, interests })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to call analyze API');
  }
  return res.json();
}

export async function fixAndApply(resumeText: string, jobDescription: string, analysis: any) {
  const res = await fetch('/api/gemini/fixAndApply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription, analysis })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to call fixAndApply API');
  }
  return res.json();
}

export async function getCareerStrategy(resumeText: string, jobDescription: string) {
  const res = await fetch('/api/gemini/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to call strategy API');
  }
  return res.json();
}

export async function getInterviewQuestion(persona: string, jobDescription: string, resumeText: string) {
  const res = await fetch('/api/gemini/interviewQuestion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, jobDescription, resumeText })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to call interviewQuestion API');
  }
  return res.json();
}

export async function evaluateAnswer(question: string, userAnswer: string, persona: string) {
  const res = await fetch('/api/gemini/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, userAnswer, persona })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to call evaluate API');
  }
  return res.json();
}

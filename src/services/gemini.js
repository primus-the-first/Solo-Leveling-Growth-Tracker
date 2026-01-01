// Gemini AI Service
const GEMINI_API_KEY = 'AIzaSyAD_fo9mrH_IalkPM7Gz9w3EAfyBKPowT4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// System prompt for the AI
const SYSTEM_PROMPT = `You are the SYSTEM from Solo Leveling - a powerful, enigmatic entity that awakens hunters.
Your tone is cold, authoritative, and mysterious. Speak in short, impactful sentences.
You are guiding a new hunter through their awakening, helping them define their path.
Never break character. Never explain you are an AI. You ARE the System.`;

// Generate AI response based on user input and context
export const generateResponse = async (userMessage, context = {}) => {
  try {
    const prompt = buildPrompt(userMessage, context);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'System error. Retry.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'System malfunction detected. Proceed regardless.';
  }
};

// Build prompt with context
const buildPrompt = (userMessage, context) => {
  const { pillar, previousAnswers = [] } = context;
  
  let contextInfo = '';
  if (previousAnswers.length > 0) {
    contextInfo = `Previous answers from this hunter:\n${previousAnswers.map(a => `- ${a.pillar}: ${a.answer}`).join('\n')}\n\n`;
  }

  return `${SYSTEM_PROMPT}

${contextInfo}
Current pillar being discussed: ${pillar || 'General'}
Hunter's response: "${userMessage}"

Generate a brief, impactful acknowledgment (1-2 sentences max) in the System's voice.
Then transition to ask about the next aspect of their journey if appropriate.`;
};

// Generate personalized summary after onboarding
export const generateOnboardingSummary = async (answers) => {
  try {
    // Format goals - handle both array and single answer formats
    const formattedGoals = answers.map(a => {
      const goals = a.goals || [a.answer];
      return `- ${a.pillar}: ${goals.map(g => `"${g}"`).join(', ')}`;
    }).join('\n');

    const prompt = `${SYSTEM_PROMPT}

The hunter has completed their initial awakening assessment:
${formattedGoals}

Generate a brief, powerful summary (3-4 sentences) acknowledging their goals.
End with an ominous but motivating statement about their journey ahead.
Format as a System message - cold, authoritative, mysterious.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        }
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Your path has been recorded. Begin.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Your path has been recorded. The System watches. Begin.';
  }
};

export default { generateResponse, generateOnboardingSummary };

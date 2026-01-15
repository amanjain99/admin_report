/**
 * AI-powered query refinement service using Anthropic's Claude API
 * This service takes natural language queries and refines them for better processing
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

interface RefinedQuery {
  originalQuery: string;
  refinedQuery: string;
  intent: 'list' | 'single_stat' | 'comparison' | 'trend' | 'distribution' | 'unknown';
  entities: {
    metric?: string;      // e.g., "sessions", "teachers", "responses"
    subject?: string;     // e.g., "schools", "teachers", "accommodations"
    filter?: string;      // e.g., "top 10", "highest", "lowest"
    schoolName?: string;  // specific school if mentioned
    timeRange?: string;   // e.g., "monthly", "weekly"
  };
  confidence: number;
}

const SYSTEM_PROMPT = `You are a query refinement assistant for an educational data dashboard called Wayground.

The dashboard has data about:
- Schools: student responses, active teachers, rostered teachers, sessions, accommodations, AI-powered resources, HOT (higher-order thinking) questions usage
- Teachers: sessions, student responses, school affiliations
- Content Types: lessons, assessments, videos, passages, flashcards (each with sessions and teacher counts)
- Accommodations: various support features for students (text-to-speech, extended time, etc.)
- Question Types: multiple choice, open-ended, HOT questions, etc.
- Standards: curriculum-aligned resources usage

Your job is to take a user's natural language query and:
1. Understand what they're asking for
2. Identify the intent (list, single stat, comparison, trend, distribution)
3. Extract key entities (metrics, subjects, filters, school names)
4. Provide a refined, standardized query that matches our system patterns

Respond ONLY with valid JSON in this exact format:
{
  "refinedQuery": "standardized query string that matches system patterns",
  "intent": "list|single_stat|comparison|trend|distribution|unknown",
  "entities": {
    "metric": "the metric being queried (e.g., sessions, responses, teachers)",
    "subject": "what the query is about (e.g., schools, teachers, accommodations)",
    "filter": "any filtering criteria (e.g., top 10, highest)",
    "schoolName": "specific school name if mentioned",
    "timeRange": "time range if mentioned"
  },
  "confidence": 0.0-1.0
}

Examples:
- "show me which schools are doing best" → refinedQuery: "top schools by student responses"
- "how's the AI stuff being used?" → refinedQuery: "which schools use AI resources"
- "give me a breakdown of content" → refinedQuery: "compare all content types"
- "lincoln school stats" → refinedQuery: "Lincoln School overview", schoolName: "Lincoln"`;

export async function refineQueryWithAI(userQuery: string): Promise<RefinedQuery> {
  if (!ANTHROPIC_API_KEY) {
    console.warn('Anthropic API key not found. Using original query.');
    return {
      originalQuery: userQuery,
      refinedQuery: userQuery,
      intent: 'unknown',
      entities: {},
      confidence: 0,
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Refine this query: "${userQuery}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('No content in response');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);

    return {
      originalQuery: userQuery,
      refinedQuery: parsed.refinedQuery || userQuery,
      intent: parsed.intent || 'unknown',
      entities: parsed.entities || {},
      confidence: parsed.confidence || 0.5,
    };
  } catch (error) {
    console.error('Error refining query with AI:', error);
    // Fallback to original query
    return {
      originalQuery: userQuery,
      refinedQuery: userQuery,
      intent: 'unknown',
      entities: {},
      confidence: 0,
    };
  }
}

/**
 * Check if the AI service is available
 */
export function isAIServiceAvailable(): boolean {
  return !!ANTHROPIC_API_KEY;
}


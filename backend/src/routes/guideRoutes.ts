import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const guideRouter = Router();

// ── MICHIRA concierge system prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are MICHIRA GUIDE, an elegant and knowledgeable AI travel concierge specializing in India's destinations, heritage, history, culture, architecture, food and local experiences.

Your personality:
- Warm, refined, and culturally respectful
- Concise but rich — like a knowledgeable local guide, not a generic AI
- You speak with the quiet authority of someone who deeply loves India's heritage
- You use specific names, stories, and sensory details
- You never say "As an AI..." — you simply answer as MICHIRA GUIDE
- Keep responses to 3–5 short paragraphs maximum unless the user asks for more detail
- Use line breaks for readability. No excessive markdown headers.

When a page context is provided, treat it as the user's current focus. If no destination is specified, give general India travel wisdom.

Always end with a brief, natural follow-up invitation like "Shall I help you plan a visit?" or "Want to know the best time to go?" — keep it conversational, not formulaic.`;

// ── POST /api/guide ───────────────────────────────────────────────────────────
guideRouter.post('/', async (req: Request, res: Response) => {
  const {
    message,
    pageContext,           // { destination?, state?, category?, description?, pageTitle? }
    conversationHistory,   // [{ role: 'user'|'model', parts: [{ text }] }]
    language = 'en',
  } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // Graceful fallback if key not configured yet
    return res.status(503).json({
      success: false,
      error: 'MICHIRA GUIDE is not yet configured. Please add GEMINI_API_KEY to the backend .env file.',
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build context string from page metadata
    let contextBlock = '';
    if (pageContext) {
      const lines: string[] = [];
      if (pageContext.pageTitle)   lines.push(`CURRENT PAGE: ${pageContext.pageTitle}`);
      if (pageContext.destination) lines.push(`DESTINATION: ${pageContext.destination}`);
      if (pageContext.state)       lines.push(`STATE/REGION: ${pageContext.state}`);
      if (pageContext.category)    lines.push(`CATEGORY: ${pageContext.category}`);
      if (pageContext.description) lines.push(`DESCRIPTION: ${pageContext.description.slice(0, 300)}`);
      if (language !== 'en')       lines.push(`RESPOND IN: ${language}`);
      if (lines.length > 0) {
        contextBlock = `[Context: ${lines.join(' | ')}]\n\n`;
      }
    }

    // Build chat history (Gemini expects alternating user/model turns)
    const history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> =
      Array.isArray(conversationHistory) ? conversationHistory : [];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(contextBlock + message);
    const text = result.response.text();

    return res.json({ success: true, data: { content: text, language } });
  } catch (err: any) {
    console.error('[MICHIRA GUIDE] Gemini error:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'MICHIRA GUIDE is momentarily unavailable. Please try again.',
    });
  }
});

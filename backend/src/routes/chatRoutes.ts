import { Router } from 'express';
import { pool } from '../config/db.js';
import { getDestinationIntelligence } from '../services/reviewPipeline.js';

export const chatRouter = Router();

function formatProblem(problem: any): string {
  const evidence = problem.mention_count ? ` (${problem.mention_count} mentions)` : '';
  return `- ${problem.name}${evidence}${problem.description ? ` — ${problem.description}` : ''}`;
}

function formatAttraction(attraction: any): string {
  const mentions = attraction.mention_count ? `, ${attraction.mention_count} positive mentions` : '';
  return `- ${attraction.attraction_name}${mentions}`;
}

chatRouter.post('/', async (req, res) => {
  try {
    const { message, language = 'en', destination_slug } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const destinationKey = String(destination_slug || '').trim();
    const destinationResult = destinationKey
      ? await pool.query('SELECT * FROM destinations WHERE slug = $1 OR name ILIKE $1 LIMIT 1', [destinationKey])
      : { rows: [] };
    const destination = destinationResult.rows[0];
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Select a supported destination first.' });
    }

    const intelligence = await getDestinationIntelligence(destination.id);
    const total = intelligence?.summary_metrics?.total_reviews_analyzed || 0;
    const problems = intelligence?.recurring_problems || [];
    const attractions = intelligence?.emerging_attractions || [];
    const services = intelligence?.service_quality || [];
    const sentiment = intelligence?.sentiment;
    const text = String(message).toLowerCase();
    const asksProblems = /problem|complaint|issue|समस्या|तक्रार|பிரச்சனை|ఫిర్యాద/.test(text);
    const asksEmerging = /emerging|hidden|gem|new|अनमोल|नवे|छिपे|नवीन/.test(text);
    const asksService = /service|staff|food|clean|सफाई|सेवा|सेव/.test(text);

    let content: string;
    if (!total) {
      content = `There are no analyzed tourist reviews for **${destination.name}** yet. Fetch live Google Maps reviews from the review intelligence page to generate evidence-based guidance.`;
    } else if (asksProblems) {
      content = `Review-derived issues for **${destination.name}** (${total} analyzed reviews):\n\n${problems.length ? problems.slice(0, 5).map(formatProblem).join('\n') : 'No recurring problems have sufficient evidence.'}`;
    } else if (asksEmerging) {
      content = `Review-derived emerging signals for **${destination.name}**:\n\n${attractions.length ? attractions.slice(0, 5).map(formatAttraction).join('\n') : 'No emerging attraction signal has sufficient evidence. Historical growth is not available unless stored snapshots support it.'}`;
    } else if (asksService) {
      const serviceLines = services.filter((item: any) => item.score !== null && item.score !== undefined).slice(0, 8)
        .map((item: any) => `- ${item.category}: ${item.score}/100`).join('\n');
      content = `Review-derived service signals for **${destination.name}**:\n\n${serviceLines || 'Insufficient review evidence for service-quality scoring.'}`;
    } else {
      const rating = sentiment?.average_rating ?? 'insufficient data';
      const positive = sentiment?.positive_pct;
      const sentimentLine = positive === null || positive === undefined ? 'Sentiment percentages are unavailable.' : `${positive}% positive sentiment.`;
      content = `Welcome to MICHIRA's evidence-based intelligence for **${destination.name}**.\n\n${total} tourist reviews have been analyzed. Average rating: ${rating}. ${sentimentLine}\n\nAsk about recurring problems, emerging attractions, or service quality to explore the stored review evidence.`;
    }

    res.json({
      success: true,
      data: {
        role: 'assistant',
        content,
        language,
        destination: destination.name,
        quickSuggestions: ['Show recurring problems', 'Show emerging attractions', 'Show service quality'],
      },
    });
  } catch (error: any) {
    console.error('[Chat Error]', error);
    res.status(500).json({ success: false, error: 'Unable to answer from review intelligence right now.' });
  }
});

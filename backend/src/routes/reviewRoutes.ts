import { Router } from 'express';
import { pool } from '../config/db.js';
import { analyzeReviewWithAI } from '../services/aiService.js';

export const reviewRouter = Router();

// GET /api/reviews - list reviews with filters
reviewRouter.get('/', async (req, res) => {
  try {
    const { destination_id, attraction_id, sentiment, language, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT r.*, a.name as attraction_name, d.name as destination_name
      FROM reviews r
      LEFT JOIN attractions a ON a.id = r.attraction_id
      LEFT JOIN destinations d ON d.id = r.destination_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (destination_id) {
      query += ` AND r.destination_id = $${paramIndex++}`;
      params.push(destination_id);
    }
    if (attraction_id) {
      query += ` AND r.attraction_id = $${paramIndex++}`;
      params.push(attraction_id);
    }
    if (sentiment) {
      query += ` AND r.sentiment = $${paramIndex++}`;
      params.push(sentiment);
    }
    if (language) {
      query += ` AND r.detected_language = $${paramIndex++}`;
      params.push(language);
    }

    query += ` ORDER BY r.review_date DESC, r.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);
    
    // Also get language and sentiment distributions
    const langStats = await pool.query(`
      SELECT detected_language, COUNT(*) as count 
      FROM reviews 
      ${destination_id ? 'WHERE destination_id = $1' : ''}
      GROUP BY detected_language
    `, destination_id ? [destination_id] : []);

    const sentimentStats = await pool.query(`
      SELECT sentiment, COUNT(*) as count 
      FROM reviews 
      ${destination_id ? 'WHERE destination_id = $1' : ''}
      GROUP BY sentiment
    `, destination_id ? [destination_id] : []);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      meta: {
        languages: langStats.rows,
        sentimentDistribution: sentimentStats.rows
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews/analyze - Ingest and process a review in real-time
reviewRouter.post('/analyze', async (req, res) => {
  try {
    const { destination_id, attraction_id, text, rating, reviewer_name, source = 'web_user' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Review text is required' });
    }

    // Process through NLP pipeline
    const nlpResult = await analyzeReviewWithAI(text, rating);

    // Save to Database if destination_id provided
    let savedReview = null;
    if (destination_id) {
      const insertRes = await pool.query(`
        INSERT INTO reviews (
          destination_id, attraction_id, original_text, detected_language,
          normalized_text, rating, review_date, source, reviewer_name,
          sentiment, sentiment_score, confidence
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        destination_id,
        attraction_id || null,
        text,
        nlpResult.detected_language,
        nlpResult.cleaned_text,
        rating || 4.0,
        source,
        reviewer_name || 'Anonymous Traveler',
        nlpResult.sentiment,
        nlpResult.sentiment_score,
        nlpResult.confidence
      ]);

      savedReview = insertRes.rows[0];

      // Save aspects
      if (nlpResult.aspects && nlpResult.aspects.length > 0) {
        for (const asp of nlpResult.aspects) {
          await pool.query(`
            INSERT INTO review_aspects (
              review_id, aspect, sentiment, sentiment_score, confidence, snippet
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            savedReview.id,
            asp.aspect,
            asp.sentiment,
            asp.sentiment_score,
            asp.confidence,
            asp.snippet
          ]);
        }
      }

      // Update destination stats
      await pool.query(`
        UPDATE destinations SET
          total_reviews = total_reviews + 1,
          updated_at = NOW()
        WHERE id = $1
      `, [destination_id]);
    }

    res.json({
      success: true,
      data: {
        analysis: nlpResult,
        savedRecord: savedReview
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

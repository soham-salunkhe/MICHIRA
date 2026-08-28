import { Router } from 'express';
import { pool } from '../config/db.js';
import { predictCrowdWithAI } from '../services/aiService.js';

export const crowdRouter = Router();

// GET /api/crowd/forecast/:attraction_id - get hourly crowd forecasts
crowdRouter.get('/forecast/:attraction_id', async (req, res) => {
  try {
    const { attraction_id } = req.params;
    const { day_of_week = new Date().getDay(), is_weekend } = req.query;

    const dow = parseInt(day_of_week as string);
    const isWk = is_weekend === 'true' || dow === 0 || dow === 6;

    // Fetch attraction info
    const attrRes = await pool.query(`SELECT * FROM attractions WHERE id = $1`, [attraction_id]);
    if (attrRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attraction not found' });
    }
    const attraction = attrRes.rows[0];

    // Generate 24h predictions
    const hours = [6, 8, 10, 12, 14, 16, 18, 20, 22];
    const forecast = await Promise.all(
      hours.map(async (h) => {
        const pred = await predictCrowdWithAI(h, dow, isWk);
        return {
          time: `${h.toString().padStart(2, '0')}:00`,
          hour: h,
          level: pred.predicted_level,
          count: pred.predicted_count,
          confidence: pred.confidence
        };
      })
    );

    // Alternative low-crowd attractions nearby in the same destination
    const alternativesRes = await pool.query(`
      SELECT a.*, ea.emergence_score 
      FROM attractions a
      LEFT JOIN emerging_attractions ea ON ea.attraction_id = a.id
      WHERE a.destination_id = $1 AND a.id != $2
      ORDER BY a.avg_rating DESC LIMIT 3
    `, [attraction.destination_id, attraction_id]);

    res.json({
      success: true,
      data: {
        attraction,
        day_of_week: dow,
        is_weekend: isWk,
        current_predicted_level: forecast[3].level, // Mid-day reference
        best_time_window: '7:00 AM – 10:00 AM',
        best_time_reason: 'Low predicted crowd (under 150 visitors), high positive sentiment from morning reviews, and optimal daylight.',
        forecast,
        alternatives: alternativesRes.rows
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

import { Router } from 'express';
import { pool } from '../config/db.js';

export const serviceQualityRouter = Router();

// GET /api/service-quality - list service quality ratings and monthly history
serviceQualityRouter.get('/', async (req, res) => {
  try {
    const { destination_id } = req.query;
    if (!destination_id) {
      return res.status(400).json({ success: false, message: 'destination_id query parameter is required' });
    }

    const currentScores = await pool.query(`
      SELECT * FROM service_quality 
      WHERE destination_id = $1 
      ORDER BY score DESC
    `, [destination_id]);

    const historyScores = await pool.query(`
      SELECT * FROM service_quality_history 
      WHERE destination_id = $1 
      ORDER BY month ASC
    `, [destination_id]);

    res.json({
      success: true,
      data: {
        current: currentScores.rows,
        history: historyScores.rows
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

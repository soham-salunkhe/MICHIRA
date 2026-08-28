import { Router } from 'express';
import { pool } from '../config/db.js';

export const sustainabilityRouter = Router();

// GET /api/sustainability - get sustainability scores and recommendations
sustainabilityRouter.get('/:destination_id', async (req, res) => {
  try {
    const { destination_id } = req.params;
    const result = await pool.query(`
      SELECT s.*, d.name as destination_name
      FROM sustainability_scores s
      JOIN destinations d ON d.id = s.destination_id
      WHERE s.destination_id = $1
      LIMIT 1
    `, [destination_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sustainability data not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

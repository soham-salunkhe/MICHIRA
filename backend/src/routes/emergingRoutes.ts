import { Router } from 'express';
import { pool } from '../config/db.js';

export const emergingRouter = Router();

// GET /api/emerging - list emerging attractions across all destinations or by destination
emergingRouter.get('/', async (req, res) => {
  try {
    const { destination_id } = req.query;
    let query = `
      SELECT ea.*, a.name as attraction_name, a.type, a.image_url, a.avg_rating, a.latitude, a.longitude, d.name as destination_name
      FROM emerging_attractions ea
      JOIN attractions a ON a.id = ea.attraction_id
      JOIN destinations d ON d.id = ea.destination_id
    `;
    const params: any[] = [];

    if (destination_id) {
      query += ` WHERE ea.destination_id = $1`;
      params.push(destination_id);
    }

    query += ` ORDER BY ea.emergence_score DESC`;

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

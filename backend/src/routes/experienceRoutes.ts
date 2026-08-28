import { Router } from 'express';
import { pool } from '../config/db.js';

export const experienceRouter = Router();

// GET /api/experiences - list local artisan and cultural experiences
experienceRouter.get('/', async (req, res) => {
  try {
    const { destination_id, category } = req.query;
    let query = `
      SELECT le.*, d.name as destination_name
      FROM local_experiences le
      JOIN destinations d ON d.id = le.destination_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let idx = 1;

    if (destination_id) {
      query += ` AND le.destination_id = $${idx++}`;
      params.push(destination_id);
    }
    if (category) {
      query += ` AND le.category = $${idx++}`;
      params.push(category);
    }

    query += ` ORDER BY le.avg_rating DESC`;

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

import { Router } from 'express';
import { pool } from '../config/db.js';

export const problemRouter = Router();

// GET /api/problems - list recurring problems
problemRouter.get('/', async (req, res) => {
  try {
    const { destination_id } = req.query;
    let query = `
      SELECT p.*, d.name as destination_name
      FROM problem_clusters p
      JOIN destinations d ON d.id = p.destination_id
    `;
    const params: any[] = [];

    if (destination_id) {
      query += ` WHERE p.destination_id = $1`;
      params.push(destination_id);
    }

    query += ` ORDER BY p.mention_count DESC`;

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

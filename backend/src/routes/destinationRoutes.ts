import { Router } from 'express';
import { pool } from '../config/db.js';

export const destinationRouter = Router();

// GET /api/destinations - list all destinations or search
destinationRouter.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT d.*, 
        (SELECT COUNT(*) FROM attractions WHERE destination_id = d.id) as attraction_count
      FROM destinations d
    `;
    const params: any[] = [];

    if (search && typeof search === 'string') {
      query += ` WHERE d.name ILIKE $1 OR d.state ILIKE $1 OR d.description ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY d.intelligence_score DESC`;

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/destinations/:slug - destination intelligence details
destinationRouter.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const destResult = await pool.query(`SELECT * FROM destinations WHERE slug = $1 OR id::text = $1`, [slug]);
    
    if (destResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const destination = destResult.rows[0];
    const destId = destination.id;

    // Fetch related intelligence data in parallel
    const [
      attractionsRes,
      problemsRes,
      serviceQualityRes,
      emergingRes,
      sustainabilityRes,
      timelineRes,
      experiencesRes
    ] = await Promise.all([
      pool.query(`SELECT * FROM attractions WHERE destination_id = $1 ORDER BY avg_rating DESC`, [destId]),
      pool.query(`SELECT * FROM problem_clusters WHERE destination_id = $1 ORDER BY mention_count DESC`, [destId]),
      pool.query(`SELECT * FROM service_quality WHERE destination_id = $1 ORDER BY score DESC`, [destId]),
      pool.query(`
        SELECT ea.*, a.name as attraction_name, a.type, a.image_url, a.avg_rating 
        FROM emerging_attractions ea
        JOIN attractions a ON a.id = ea.attraction_id
        WHERE ea.destination_id = $1
        ORDER BY ea.emergence_score DESC
      `, [destId]),
      pool.query(`SELECT * FROM sustainability_scores WHERE destination_id = $1 LIMIT 1`, [destId]),
      pool.query(`SELECT * FROM sentiment_timeline WHERE destination_id = $1 ORDER BY period ASC`, [destId]),
      pool.query(`SELECT * FROM local_experiences WHERE destination_id = $1 ORDER BY avg_rating DESC`, [destId])
    ]);

    res.json({
      success: true,
      data: {
        destination,
        attractions: attractionsRes.rows,
        problems: problemsRes.rows,
        serviceQuality: serviceQualityRes.rows,
        emergingAttractions: emergingRes.rows,
        sustainability: sustainabilityRes.rows[0] || null,
        sentimentTimeline: timelineRes.rows,
        experiences: experiencesRes.rows
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

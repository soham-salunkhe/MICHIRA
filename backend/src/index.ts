import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { destinationRouter } from './routes/destinationRoutes.js';
import { reviewRouter } from './routes/reviewRoutes.js';
import { problemRouter } from './routes/problemRoutes.js';
import { emergingRouter } from './routes/emergingRoutes.js';
import { serviceQualityRouter } from './routes/serviceQualityRoutes.js';
import { crowdRouter } from './routes/crowdRoutes.js';
import { itineraryRouter } from './routes/itineraryRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { experienceRouter } from './routes/experienceRoutes.js';
import { sustainabilityRouter } from './routes/sustainabilityRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { guideRouter } from './routes/guideRoutes.js';
import { touristReviewRouter } from './routes/touristReviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/destinations', destinationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/problems', problemRouter);
app.use('/api/emerging', emergingRouter);
app.use('/api/service-quality', serviceQualityRouter);
app.use('/api/crowd', crowdRouter);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/chat', chatRouter);
app.use('/api/experiences', experienceRouter);
app.use('/api/sustainability', sustainabilityRouter);
app.use('/api/admin', adminRouter);
app.use('/api/guide', guideRouter);
app.use('/api/tourist-review-analysis', touristReviewRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'yatraai-backend-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

import { seedAllDestinations } from './config/seedDestinations.js';

app.listen(PORT, async () => {
  console.log(`🚀 YatraAI Backend Server running on http://localhost:${PORT}`);
  try {
    await seedAllDestinations();
    console.log('✓ All India destinations dataset synchronized');
  } catch (err) {
    console.warn('Destination seed note:', err);
  }
});

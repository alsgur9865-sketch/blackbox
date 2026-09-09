import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const configured = process.env.FRONTEND_URL;
      if (origin === configured || origin === 'http://localhost:5173' || url.hostname.endsWith('.vercel.app')) return callback(null, true);
    } catch {}
    return callback(null, false);
  }
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'blackbox-api', version: '7.0.0' }));
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', notFound);
app.use(errorHandler);

export default app;

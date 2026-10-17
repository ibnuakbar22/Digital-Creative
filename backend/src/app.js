import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import router from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';
import { LOCAL_UPLOAD_DIR } from './services/storageService.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: config.frontendOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
  app.use(express.json({ limit: '100kb' }));
  app.use('/uploads', express.static(LOCAL_UPLOAD_DIR)); // hanya terisi saat development tanpa Supabase
  app.use('/api', router);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp();

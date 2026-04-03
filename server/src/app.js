import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:4200'
    })
  );
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);

  return app;
}

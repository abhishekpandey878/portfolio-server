import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';

export function createApp() {
  const app = express();
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = path.dirname(currentFilePath);
  const clientDistPath = path.resolve(currentDirPath, '../../client/dist/portfolio-client');
  const clientIndexPath = path.join(clientDistPath, 'index.html');

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

  if (existsSync(clientIndexPath)) {
    app.use(express.static(clientDistPath));

    app.get('*', (request, response, next) => {
      if (request.path.startsWith('/api/')) {
        next();
        return;
      }

      response.sendFile(clientIndexPath);
    });
  }

  return app;
}

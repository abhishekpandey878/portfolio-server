import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    ...configuredOrigins
  ]);
}

export function createApp() {
  const app = express();
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = path.dirname(currentFilePath);
  const clientDistPath = path.resolve(currentDirPath, '../../client/dist/portfolio-client');
  const clientIndexPath = path.join(clientDistPath, 'index.html');
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
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

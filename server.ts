import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes.ts';
import { connectMongoDB } from './server/config/db.ts';
import { dbStore } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize MongoDB Connection (Hybrid Mode)
  await connectMongoDB();
  await dbStore.syncFromMongo();

  // API request telemetry
  app.use((req, _res, next) => {
    if (req.url.startsWith('/api')) {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      console.log(`[${timestamp}] ${req.method} ${req.url}`);
    }
    next();
  });

  // REST API routes
  app.use('/api', apiRouter);

  // Development middleware vs static assets in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NAAC-QMS] Institutional Quality Portal running at http://localhost:${PORT}`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[NAAC-QMS] Gracefully terminating server...');
    server.close(() => {
      console.log('[NAAC-QMS] Server shutdown complete.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((err) => {
  console.error('[NAAC-QMS] Startup failed:', err);
  process.exit(1);
});

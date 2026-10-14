import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes.ts';
import { connectSupabase } from './server/config/supabase.ts';
import { dbStore } from './server/db.ts';

import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize Supabase Connection (Hybrid Mode)
  await connectSupabase();
  await dbStore.syncFromSupabase();

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
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
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

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[NAAC-QMS] Institutional Quality Portal running at http://localhost:${PORT}`);
  });

  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[NAAC-QMS] Error: Port ${PORT} already use me hai (EADDRINUSE).`);
      console.error(`Port free karne ke liye Windows terminal me run karein:`);
      console.error(`  npx kill-port ${PORT}\n`);
    } else {
      console.error('[NAAC-QMS] Server error:', err);
    }
    process.exit(1);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[NAAC-QMS] Gracefully terminating server...');
    httpServer.close(() => {
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

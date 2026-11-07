import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env, with fallback to root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import app from './app.js';
import prisma from './services/prisma.service.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Tikakaran HMIS Backend Server Running`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚙️  Environment: ${NODE_ENV}`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Server Error] Port ${PORT} is currently in use.`);
    console.error(`💡 Running 'npm run dev' will automatically free port ${PORT} before starting.`);
    process.exit(1);
  } else {
    console.error('[Server Error]', err.message || err);
    process.exit(1);
  }
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('[Prisma] Database connections closed.');
    } catch (e) {
      console.error('[Prisma] Error disconnecting:', e.message);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;


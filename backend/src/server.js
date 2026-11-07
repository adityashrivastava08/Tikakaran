import 'dotenv/config';
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


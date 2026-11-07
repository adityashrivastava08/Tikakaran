import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { sendError } from './utils/response.util.js';

const app = express();

// 1. CORS Configuration (matches frontend origin)
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || origin === allowedOrigin || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. API Routes mounting
app.use('/api', routes);

// 4. Root welcome check
app.get('/', (req, res) => {
  res.json({
    name: 'Tikakaran Register - HMIS Reminder REST API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 5. 404 Route Handler
app.use((req, res) => {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
});

// 6. Centralized Error Handler Middleware
app.use(errorHandler);

export default app;


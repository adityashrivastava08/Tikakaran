import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { sendError } from './utils/response.util.js';

const app = express();

// 1. CORS Configuration (supports local dev origins & Vite ports)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman) or any localhost port in development
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
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


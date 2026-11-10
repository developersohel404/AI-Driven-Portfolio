import cors from 'cors';
import { env } from './env';

const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'].filter(
  Boolean
);

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Same-origin (server-to-server) অথবা allowed origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

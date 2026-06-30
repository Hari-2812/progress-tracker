import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';

const app = express();
app.use(compression());
app.set('trust proxy', 1); app.use(helmet({ crossOriginResourcePolicy: false })); app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173' })); app.use(express.json({ limit: '20kb' })); app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }), authRoutes); app.use('/api/progress', progressRoutes); app.use('/api/tasks', taskRoutes); app.use('/api/users', userRoutes); app.use('/api/checklist', checklistRoutes); app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
if (process.env.NODE_ENV === 'production') { const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'); app.use(express.static(root)); app.get('/{*splat}', (_req, res) => res.sendFile(path.join(root, 'index.html'))); }
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => { console.error(err); if (err.code === 11000) return res.status(409).json({ message: 'This record already exists' }); res.status(err.status || 500).json({ message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message }); });
export default app;

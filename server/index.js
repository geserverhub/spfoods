import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import registrationRoutes from './routes/registrations.js';
import trackingRoutes from './routes/tracking.js';
import departmentRoutes from './routes/departments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/departments', departmentRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ SP FOODS API server running at http://localhost:${PORT}`);
});

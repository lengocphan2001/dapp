import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import usersRoutes from './routes/users';
import analyticsRoutes from './routes/analytics';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/admin/users', authenticateToken, usersRoutes);
app.use('/api/admin/analytics', authenticateToken, analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Admin API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Admin API server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`👥 Users: http://localhost:${PORT}/api/admin/users`);
  console.log(`📈 Analytics: http://localhost:${PORT}/api/admin/analytics`);
}); 
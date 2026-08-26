import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', (req, res, next) => {
	if (mongoose.connection.readyState !== 1) {
		return res.status(503).json({ message: 'Database unavailable. Start MongoDB or check MONGODB_URI.' });
	}
	next();
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(errorHandler);
const port = process.env.PORT || 5000;
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	connectDB()
		.then(() => app.listen(port, () => console.log(`API running on port ${port}`)))
		.catch((error) => { console.error(error.message); process.exit(1); });
}

export default app;

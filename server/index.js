import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { securityMiddleware } from './middleware/auth.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import hearingRequestsRoutes from './routes/hearingRequests.js';
import documentsRoutes from './routes/documents.js';
import companiesRoutes from './routes/companies.js';
import locationsRoutes from './routes/locations.js';
import roomsRoutes from './routes/rooms.js';
import holidaysRoutes from './routes/holidays.js';
import signaturesRoutes from './routes/signatures.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Security middleware
app.use(securityMiddleware);

// Static files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hearing-requests', hearingRequestsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/holidays', holidaysRoutes);
app.use('/api/signatures', signaturesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
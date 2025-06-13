import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
// Database
import connectDB from './config/database.js';
connectDB();
// Routes
import routes from './routes.js';
// Error
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(routes);

app.use(errorHandler);

export default app;

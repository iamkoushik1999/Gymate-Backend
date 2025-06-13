import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Gymate API Docs',
      version: '1.0.0',
      description: 'API Docs',
    },
    server: [
      {
        url: 'gymate-backend.onrender.com/api/v1',
      },
    ],
  },
  apis: [path.join(__dirname, './swagger.yaml')],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app;

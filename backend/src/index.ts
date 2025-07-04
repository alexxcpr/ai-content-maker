import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

// Import rute
import userRoutes from './routes/user';
import contentRoutes from './routes/content';

// Configurare variabile de mediu
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-content-maker';

// Middleware de bază
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // limită de 100 cereri per IP
  message: 'Prea multe cereri de la această adresă IP, vă rugăm încercați mai târziu.'
});

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 oră
  max: 10, // maxim 10 generări pe oră per IP
  message: 'Ați atins limita de generări. Vă rugăm încercați mai târziu.'
});

app.use('/api/', limiter);
app.use('/api/content/generate', generateLimiter);

// Rute
app.get('/', (req, res) => {
  res.json({
    message: 'AI Content Maker API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      content: '/api/content'
    }
  });
});

app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);

// Error handler middleware (trebuie să fie ultimul)
app.use(errorHandler);

// Conectare la MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectat la MongoDB');
    
    // Pornire server
    app.listen(PORT, () => {
      console.log(`🚀 Server pornit pe portul ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Eroare la conectarea cu MongoDB:', error);
    process.exit(1);
  });

// Gestionare erori necaptate
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  // În producție, ai putea vrea să închizi serverul aici
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app; 
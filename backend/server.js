import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// MongoDB connection & auto-seeding of initial test users
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      const col = mongoose.connection.collection('users');
      await col.updateOne(
        { phone: '9876543210' },
        {
          $set: {
            name: 'Ramesh Patil',
            phone: '9876543210',
            password: 'ramesh123',
            village: 'Athani',
            language: 'kn',
          }
        },
        { upsert: true }
      );
      await col.updateOne(
        { phone: '9123456789' },
        {
          $set: {
            name: 'Suresh Kulkarni',
            phone: '9123456789',
            password: 'suresh123',
            village: 'Bagalkot',
            language: 'en',
          }
        },
        { upsert: true }
      );
    } catch (seedErr) {
      console.warn('Auto-seed check notice:', seedErr.message);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Serve frontend in production (if dist exists)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

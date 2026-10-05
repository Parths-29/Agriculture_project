import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('users');
  await col.deleteMany({ phone: { $in: ['9876543210', '9123456789'] } });
  await col.insertOne({
    name: 'Ramesh Patil',
    phone: '9876543210',
    password: 'ramesh123',
    village: 'Athani',
    language: 'kn',
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  });
  await col.insertOne({
    name: 'Suresh Kulkarni',
    phone: '9123456789',
    password: 'suresh123',
    village: 'Bagalkot',
    language: 'en',
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  });
  console.log('Seeded mock users into MongoDB successfully');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

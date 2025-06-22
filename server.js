import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'todoapp');
    console.log('MongoDB connected');

    // Set db in req AFTER connection is ready
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Import and use routes after DB connection
    const todoRoutes = (await import('./routes/todoRoutes.js')).default;
    const taskRoutes = (await import('./routes/taskRoutes.js')).default;
    const exportRoutes = (await import('./routes/exportRoutes.js')).default;

    app.use('/api/todos', todoRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/export', exportRoutes);

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Setup cron reminder (now db is ready)
    setInterval(async () => {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const tasks = await db.collection('tasks').find({
        completed: false,
        maxEndDate: { $gte: now, $lte: in24h }
      }).toArray();

      tasks.forEach(task => {
        console.log(`⏰ Reminder: Task "${task.title}" is due by ${new Date(task.maxEndDate).toLocaleString()}`);
      });
    }, process.env.REMINDER_INTERVAL_MS ? parseInt(process.env.REMINDER_INTERVAL_MS) : 60000);

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

connectDB();

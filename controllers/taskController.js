import { ObjectId } from 'mongodb';
import { z } from 'zod';

// CREATE TASK -- SCHEMA USING ZOD
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  maxEndDate: z.string().min(1, 'Max end date is required'),
});

export const createTask = async (req, res) => {
  try {
    const parseResult = taskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { title, type, maxEndDate } = parseResult.data;

    const newTask = {
      title,
      type,
      maxEndDate: new Date(maxEndDate),
      completed: false,
    };

    await req.db.collection('tasks').insertOne(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
};

// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await req.db.collection('tasks').find({}).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const parseResult = taskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { title, type, maxEndDate } = parseResult.data;
    const { id } = req.params;

    const result = await req.db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, type, maxEndDate: new Date(maxEndDate) } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
};

// TOGGLE COMPLETE
export const toggleTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await req.db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: !!completed } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: `Task marked as ${completed ? 'complete' : 'incomplete'}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle task', details: err.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await req.db.collection('tasks').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
};

import { ObjectId } from 'mongodb';
import { z } from 'zod';

// CREATE TODO -- SCHEMA USING ZOD
const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
});

// CREATE TODO
export const createTodo = async (req, res) => {
  try {
    const parseResult = todoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { title, notes = '' } = parseResult.data;

    const newTodo = {
      title,
      notes,
      completed: false,
    };

    await req.db.collection('todos').insertOne(newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo', details: err.message });
  }
};

// GET ALL TODOS
export const getTodos = async (req, res) => {
  try {
    const todos = await req.db.collection('todos').find({}).toArray();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos', details: err.message });
  }
};

// UPDATE TODO
export const updateTodo = async (req, res) => {
  try {
    const parseResult = todoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { title, notes = '' } = parseResult.data;
    const { id } = req.params;

    const result = await req.db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, notes } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo', details: err.message });
  }
};

// MARK COMPLETE / INCOMPLETE
export const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await req.db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: !!completed } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: `Todo marked as ${completed ? 'complete' : 'incomplete'}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle todo', details: err.message });
  }
};

// DELETE TODO
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await req.db.collection('todos').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo', details: err.message });
  }
};

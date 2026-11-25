import { Router } from 'express';
import { Board } from '../models/Board.js';
import { List } from '../models/List.js';
import { Card } from '../models/Card.js';
import { requireAuth } from '../middleware/auth.js';

const boardRouter:Router = Router()

boardRouter.use(requireAuth);

// GET /api/boards - Get all boards for logged-in user
boardRouter.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch boards' });
  }
});

// GET /api/boards/:id - Get single board
boardRouter.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch board' });
  }
});

// POST /api/boards - Create board
boardRouter.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Board name is required' });
    }

    const board = await Board.create({
      name: name.trim(),
      owner: req.userId,
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: 'Could not create board' });
  }
});

// DELETE /api/boards/:id - Delete board + cascade delete lists & cards
boardRouter.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const lists = await List.find({ board: board._id });
    const listIds = lists.map((l) => l._id);

    await Card.deleteMany({ list: { $in: listIds } });
    await List.deleteMany({ board: board._id });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Could not delete board' });
  }
});

export default boardRouter
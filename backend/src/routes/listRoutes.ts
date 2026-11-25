import { Router } from 'express';
import { List } from '../models/List.js';
import { Card } from '../models/Card.js';
import { requireAuth } from '../middleware/auth.js';

export const listRouter:Router = Router();

listRouter.use(requireAuth);

// GET /api/lists?boardId=... - Fetch all lists for a board with their cards
listRouter.get('/', async (req, res) => {
  try {
    const { boardId } = req.query;

    if (typeof boardId !== 'string') {
      return res.status(400).json({ error: 'boardId is required' });
    }

    const lists = await List.find({ board: boardId }).sort({ order: 1 });

    const listsWithCards = await Promise.all(
      lists.map(async (list) => {
        const cards = await Card.find({ list: list._id }).sort({ order: 1 });
        return {
          ...list.toObject(),
          cards,
        };
      })
    );

    res.json(listsWithCards);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch lists' });
  }
});

// POST /api/lists - Create a new list at the end of the board
listRouter.post('/', async (req, res) => {
  try {
    const { name, boardId } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({ error: 'Name and boardId are required' });
    }

    const count = await List.countDocuments({ board: boardId });

    const list = await List.create({
      name,
      board: boardId,
      order: count,
    });

    res.status(201).json({
      ...list.toObject(),
      cards: [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not create list' });
  }
});

// DELETE /api/lists/:id - Delete a list and all cards inside it
listRouter.delete('/:id', async (req, res) => {
  try {
    await Card.deleteMany({ list: req.params.id });
    await List.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Could not delete list' });
  }
});
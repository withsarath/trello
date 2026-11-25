import { Router } from 'express';
import { Card } from '../models/Card.js';
import { requireAuth } from '../middleware/auth.js';

export const cardRouter:Router = Router();

cardRouter.use(requireAuth);

// POST /api/cards - Create a new card at the bottom of a list
cardRouter.post('/', async (req, res) => {
  try {
    const { title, listId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ error: 'Title and listId are required' });
    }

    const count = await Card.countDocuments({ list: listId });

    const card = await Card.create({
      title,
      list: listId,
      order: count,
      description: '',
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Could not create card' });
  }
});

// PATCH /api/cards/:id - Partial update (fields, labels, or moving across lists)
cardRouter.patch('/:id', async (req, res) => {
  try {
    const { title, description, dueDate, listId, list, order, labels } = req.body;

    const updates: Record<string, unknown> = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (order !== undefined) updates.order = order;
    if (labels !== undefined) updates.labels = labels;

    // Support either `list` or `listId` from frontend payloads
    const targetList = list ?? listId;
    if (targetList !== undefined) updates.list = targetList;

    const card = await Card.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Could not update card' });
  }
});

// DELETE /api/cards/:id - Delete a single card
cardRouter.delete('/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Could not delete card' });
  }
});
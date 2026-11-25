import { useState } from 'react';
import { api } from '../api/axios';
import type { CardType, ListType } from '../types';
import { LABELS, type LabelId } from '../constants';

interface Props {
  card: CardType;
  lists: ListType[];
  onClose: () => void;
  onSaved: () => void;
}

export function CardModal({ card, lists, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.slice(0, 10) : '');
  const [labels, setLabels] = useState<LabelId[]>(card.labels || []);

  const currentList = lists.find((list) =>
    list.cards.some((c) => c._id === card._id)
  );
  const [listId, setListId] = useState(currentList?._id || '');

  function toggleLabel(id: LabelId) {
    setLabels((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function handleSave() {
    const payload: Record<string, unknown> = {
      title,
      description,
      dueDate: dueDate || null,
      labels,
    };

    if (listId && listId !== currentList?._id) {
      const destinationList = lists.find((l) => l._id === listId);
      payload.list = listId;
      payload.order = destinationList ? destinationList.cards.length : 0;
    }

    await api.patch(`/cards/${card._id}`, payload);
    onSaved();
  }

  async function handleDelete() {
    await api.delete(`/cards/${card._id}`);
    onSaved();
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-ink/20 bg-paper p-6 shadow-xl space-y-5">
        {/* Header: Title + Close */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-xl font-bold bg-transparent border-b border-ink/20 pb-1 focus:outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-sm border border-ink/20 hover:bg-ink/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Move List Dropdown */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            List
          </p>
          <select
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-white text-sm focus:outline-none focus:border-ink"
          >
            {lists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        {/* Labels Toggle */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            Labels
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LABELS) as LabelId[]).map((id) => {
              const active = labels.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleLabel(id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                    LABELS[id].color
                  } ${
                    active
                      ? 'ring-2 ring-ink scale-105'
                      : 'opacity-55 hover:opacity-90'
                  }`}
                >
                  {LABELS[id].name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            Description
          </p>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a detailed description..."
            className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-white text-sm focus:outline-none focus:border-ink"
          />
        </div>

        {/* Due Date */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            Due Date
          </p>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink/20 bg-white text-sm focus:outline-none focus:border-ink"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-ink/15">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-700 bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-ink text-paper hover:opacity-90 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
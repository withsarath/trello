import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";
import type { BoardType, CardType, ListType } from "../types";
import { LABELS, type LabelId } from "../constants";
import { CardModal } from "../components/CardModal";

export function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [lists, setLists] = useState<ListType[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Add new list state
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  // Add new card per list state
  const [addingCardListId, setAddingCardListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  // Filter & Drag-and-Drop states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLabel, setFilterLabel] = useState<LabelId | "all">("all");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  async function fetchBoardData() {
    if (!boardId) return;
    try {
      const [boardRes, listsRes] = await Promise.all([
        api.get(`/boards/${boardId}`),
        api.get(`/lists?boardId=${boardId}`),
      ]);
      setBoard(boardRes.data);
      setLists(listsRes.data);
    } catch (err) {
      console.error("Failed to load board", err);
    }
  }

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  async function handleCreateList(e: FormEvent) {
    e.preventDefault();
    if (!newListName.trim() || !boardId) return;
    await api.post("/lists", { name: newListName.trim(), boardId });
    setNewListName("");
    setIsAddingList(false);
    fetchBoardData();
  }

  async function handleDeleteList(listId: string) {
    if (!confirm("Delete this list and all its cards?")) return;
    await api.delete(`/lists/${listId}`);
    fetchBoardData();
  }

  async function handleCreateCard(e: FormEvent, listId: string) {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    await api.post("/cards", { title: newCardTitle.trim(), listId });
    setNewCardTitle("");
    setAddingCardListId(null);
    fetchBoardData();
  }

  async function handleDropCard(targetListId: string) {
    if (!draggedCardId) return;
    const targetList = lists.find((l) => l._id === targetListId);
    await api.patch(`/cards/${draggedCardId}`, {
      list: targetListId,
      order: targetList ? targetList.cards.length : 0,
    });
    setDraggedCardId(null);
    fetchBoardData();
  }

  return (
    <div className="h-screen flex flex-col p-6 overflow-hidden">
      {/* Top Board Header + Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-ink/15">
        <h1 className="text-2xl font-bold tracking-tight">
          {board?.name || "Board"}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter cards..."
            className="px-3 py-1.5 text-sm rounded-lg border border-ink/20 bg-white focus:outline-none focus:border-ink"
          />
          <select
            value={filterLabel}
            onChange={(e) => setFilterLabel(e.target.value as LabelId | "all")}
            className="px-3 py-1.5 text-sm rounded-lg border border-ink/20 bg-white focus:outline-none focus:border-ink"
          >
            <option value="all">All Labels</option>
            {(Object.keys(LABELS) as LabelId[]).map((id) => (
              <option key={id} value={id}>
                {LABELS[id].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Columns Container */}
      <div className="flex-1 flex items-start gap-4 overflow-x-auto pb-4">
        {lists.map((list) => {
          const visibleCards = list.cards.filter((card) => {
            const matchesText = card.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            const matchesLabel =
              filterLabel === "all" || card.labels?.includes(filterLabel);
            return matchesText && matchesLabel;
          });

          return (
            <div
              key={list._id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropCard(list._id)}
              className="w-72 shrink-0 rounded-xl border border-ink/15 bg-white/75 p-3.5 shadow-xs flex flex-col max-h-full"
            >
              {/* List Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="font-semibold text-sm">{list.name}</h2>
                <button
                  type="button"
                  onClick={() => handleDeleteList(list._id)}
                  className="text-xs text-ink/45 hover:text-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </div>

              {/* Cards Stack */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-0.5">
                {visibleCards.map((card) => (
                  <div
                    key={card._id}
                    draggable
                    onDragStart={() => setDraggedCardId(card._id)}
                    onClick={() => setSelectedCard(card)}
                    className="rounded-lg border border-ink/15 bg-paper p-3 shadow-2xs hover:border-ink/40 transition cursor-pointer space-y-2"
                  >
                    {/* Label Dots */}
                    {card.labels && card.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {card.labels.map((labelId) => (
                          <span
                            key={labelId}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${LABELS[labelId]?.color}`}
                          >
                            {LABELS[labelId]?.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm font-medium text-ink">{card.title}</p>

                    {card.dueDate && (
                      <p className="text-[11px] text-ink/60">
                        Due: {card.dueDate.slice(0, 10)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Card Footer */}
              <div className="mt-3 pt-2 border-t border-ink/10">
                {addingCardListId === list._id ? (
                  <form
                    onSubmit={(e) => handleCreateCard(e, list._id)}
                    className="space-y-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Card title..."
                      className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-ink/25 bg-white focus:outline-none focus:border-ink"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 text-xs rounded-lg bg-ink text-paper font-medium cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingCardListId(null);
                          setNewCardTitle("");
                        }}
                        className="px-2 py-1 text-xs rounded-lg border border-ink/20 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingCardListId(list._id);
                      setNewCardTitle("");
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-ink/65 hover:bg-ink/10 hover:text-ink transition cursor-pointer"
                  >
                    + Add a card
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New List Column */}
        <div className="w-72 shrink-0">
          {isAddingList ? (
            <form
              onSubmit={handleCreateList}
              className="rounded-xl border border-ink/20 bg-white/85 p-3.5 space-y-2"
            >
              <input
                autoFocus
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name..."
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-ink/25 bg-paper focus:outline-none focus:border-ink"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs rounded-lg bg-ink text-paper font-medium cursor-pointer"
                >
                  Add list
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListName("");
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg border border-ink/20 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingList(true)}
              className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-ink/25 bg-white/40 hover:bg-white/75 text-sm font-medium text-ink/75 transition cursor-pointer"
            >
              + Add another list
            </button>
          )}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          lists={lists}
          onClose={() => setSelectedCard(null)}
          onSaved={() => {
            setSelectedCard(null);
            fetchBoardData();
          }}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import type { BoardType } from '../types';

export function BoardListPage() {
  const [boards, setBoards] = useState<BoardType[]>([]);

  async function fetchBoards() {
    try {
      const response = await api.get('/boards');
      setBoards(response.data);
    } catch (err) {
      console.error('Failed to fetch boards', err);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  async function handleDeleteBoard(id: string) {
    if (!confirm('Delete this board?')) return;
    try {
      await api.delete(`/boards/${id}`);
      fetchBoards();
    } catch (err) {
      console.error('Failed to delete board', err);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Boards</h1>
        <p className="text-sm text-ink/60 mt-1">
          Pick a board from the sidebar or create a new one.
        </p>
      </div>

      {boards.length === 0 ? (
        <div className="border border-dashed border-ink/25 rounded-xl p-12 text-center bg-white/40">
          <p className="text-ink/60">No boards yet — create one from your sidebar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board._id}
              className="group relative flex flex-col justify-between rounded-xl border border-ink/15 bg-white/75 p-5 shadow-xs hover:border-ink/40 transition"
            >
              <Link
                to={`/boards/${board._id}`}
                className="text-lg font-semibold text-ink hover:underline block mb-6"
              >
                {board.name}
              </Link>

              <div className="flex items-center justify-between pt-3 border-t border-ink/10">
                <Link
                  to={`/boards/${board._id}`}
                  className="text-xs font-medium text-ink/70 hover:text-ink"
                >
                  Open board →
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteBoard(board._id)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
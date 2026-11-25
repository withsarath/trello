import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { BoardType } from "../types";

export function Sidebar() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const { user, logout } = useAuth();
  const { boardId } = useParams();
  const navigate = useNavigate();

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
  }, [boardId]);

  async function handleCreateBoard(e: FormEvent) {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      const response = await api.post('/boards', { name: newBoardName.trim() });
      setNewBoardName('');
      setIsAdding(false);
      await fetchBoards();
      navigate(`/boards/${response.data._id}`);
    } catch (err) {
      console.error('Failed to create board', err);
    }
  }

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } shrink-0 border-r border-ink/15 bg-paper flex flex-col justify-between min-h-screen p-4 transition-all`}
    >
      <div>
        {/* Top Brand + Collapse Button */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <Link to="/boards" className="text-xl font-bold tracking-tight">
              Boardwalk
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="px-2 py-1 text-sm rounded border border-ink/20 hover:bg-ink/5 cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        {/* Boards List */}
        {!collapsed && (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-ink/50 px-2 mb-2">
              Your Boards
            </p>

            {boards.map((board) => (
              <Link
                key={board._id}
                to={`/boards/${board._id}`}
                className={`block px-3 py-2 rounded-lg text-sm truncate transition ${
                  boardId === board._id
                    ? 'bg-ink text-paper font-medium'
                    : 'hover:bg-ink/10 text-ink'
                }`}
              >
                {board.name}
              </Link>
            ))}

            {/* Inline New Board Form / Button (from 02:23:46) */}
            <div className="pt-2">
              {isAdding ? (
                <form onSubmit={handleCreateBoard} className="space-y-2">
                  <input
                    autoFocus
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    onBlur={() => {
                      if (!newBoardName.trim()) {
                        setIsAdding(false);
                      }
                    }}
                    placeholder="Board name..."
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-ink/30 bg-white focus:outline-none focus:border-ink"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs rounded bg-ink text-paper font-medium cursor-pointer"
                    >
                      Add Board
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setNewBoardName('');
                      }}
                      className="px-2 py-1 text-xs rounded border border-ink/20 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink/70 hover:bg-ink/10 hover:text-ink transition cursor-pointer"
                >
                  + New board
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Info + Logout */}
      <div className="border-t border-ink/15 pt-4 space-y-2">
        {!collapsed && user && (
          <p className="text-xs text-ink/60 truncate px-1">{user.username}</p>
        )}
        <button
          type="button"
          onClick={logout}
          className="w-full px-3 py-2 rounded-lg text-sm text-left text-red-700 hover:bg-red-500/10 transition cursor-pointer"
        >
          {collapsed ? '⎋' : 'Log out'}
        </button>
      </div>
    </aside>
  );
}
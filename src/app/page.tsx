'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Board {
  _id: string;
  name: string;
  createdAt: string;
}

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await fetch('/api/boards');
      if (res.ok) {
        const data = await res.json();
        setBoards(data);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBoard(null);
    setBoardName('');
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, board: Board) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingBoard(board);
    setBoardName(board.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    if (editingBoard) {
      // Update
      try {
        const res = await fetch(`/api/boards/${editingBoard._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: boardName }),
        });

        if (res.ok) {
          const updatedBoard = await res.json();
          setBoards(boards.map(b => b._id === updatedBoard._id ? updatedBoard : b));
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error updating board:', error);
      }
    } else {
      // Create
      try {
        const res = await fetch('/api/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: boardName }),
        });

        if (res.ok) {
          const newBoard = await res.json();
          setBoards([newBoard, ...boards]);
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error creating board:', error);
      }
    }
  };

  const deleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this board?')) return;

    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBoards(boards.filter(b => b._id !== boardId));
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-base-200 to-base-300">
      <main className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10 justify-center">
          <div className="p-3 bg-primary/10 rounded-xl">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-4xl font-extrabold text-base-content tracking-tight">My Boards</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-dots loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Create New Board Button */}
            <div 
              onClick={openCreateModal}
              className="card bg-base-100/50 hover:bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/50 flex flex-col items-center justify-center min-h-[140px] group backdrop-blur-sm"
            >
               <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors mb-2">
                 <span className="text-2xl text-primary">+</span>
               </div>
               <h2 className="card-title text-sm text-base-content/70 group-hover:text-primary transition-colors">Create New Board</h2>
            </div>

            {/* Board List */}
            {boards.map((board) => (
              <Link 
                key={board._id} 
                href={`/boards/${board._id}`} 
                className="card bg-base-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[140px] relative group overflow-hidden"
              >
                {/* Color Bar */}
                <div className="h-2 bg-gradient-to-r from-primary to-secondary w-full absolute top-0 left-0" />
                
                <div className="card-body p-5">
                  <h2 className="card-title text-lg break-words pr-6 leading-snug text-base-content">{board.name}</h2>
                  <div className="mt-auto pt-2 text-xs text-base-content/40 font-medium uppercase tracking-wider">
                    Board
                  </div>
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 scale-100 sm:group-hover:scale-100 sm:translate-x-2 sm:group-hover:translate-x-0">
                   <button 
                    onClick={(e) => openEditModal(e, board)}
                    className="btn btn-circle btn-xs btn-ghost bg-base-100/80 hover:bg-base-200 shadow-sm border border-base-200"
                    title="Edit Board Name"
                  >
                    <span className="text-base-content/70 text-xs">✎</span>
                  </button>
                  <button 
                    onClick={(e) => deleteBoard(e, board._id)}
                    className="btn btn-circle btn-xs btn-ghost bg-base-100/80 hover:bg-red-50 hover:text-red-500 shadow-sm border border-base-200"
                    title="Delete Board"
                  >
                    <span className="font-bold text-xs">✕</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create/Edit Board Modal */}
        {isModalOpen && (
          <dialog className="modal modal-open backdrop-blur-sm">
            <div className="modal-box shadow-2xl border border-base-200 p-0 overflow-hidden">
              <div className="bg-base-200/50 p-4 border-b border-base-200 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span>{editingBoard ? '✏️' : '✨'}</span>
                  {editingBoard ? 'Edit Board' : 'Create Board'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">✕</button>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="form-control w-full">
                    <label className="label pt-0">
                      <span className="label-text font-semibold uppercase text-xs tracking-wider text-base-content/70">Board Name</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Project Alpha" 
                      className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={boardName}
                      onChange={(e) => setBoardName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="modal-action mt-8">
                    <button 
                      type="button" 
                      className="btn btn-ghost" 
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary px-8"
                      disabled={!boardName.trim()}
                    >
                      {editingBoard ? 'Save Changes' : 'Create Board'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-backdrop bg-base-300/50" onClick={() => setIsModalOpen(false)}></div>
          </dialog>
        )}
      </main>
    </div>
  );
}

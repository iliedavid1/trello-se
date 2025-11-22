'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Card {
  _id: string;
  title: string;
  description: string;
  listId: string;
}

interface List {
  _id: string;
  name: string;
  cards: Card[];
}

interface Board {
  _id: string;
  name: string;
}

export default function BoardDetail() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for creating/editing list
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [editingList, setEditingList] = useState<List | null>(null);

  // State for card modal (view/edit/create)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<Partial<Card> | null>(null);
  const [activeListId, setActiveListId] = useState<string | null>(null); // For creating new card
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');

  const fetchBoardData = useCallback(async () => {
    try {
      const [boardRes, listsRes] = await Promise.all([
        fetch(`/api/boards/${boardId}`),
        fetch(`/api/boards/${boardId}/lists`)
      ]);

      if (boardRes.ok) {
        setBoard(await boardRes.json());
      } else {
        router.push('/'); // Redirect if board not found
        return;
      }

      if (listsRes.ok) {
        setLists(await listsRes.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, router]);

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId, fetchBoardData]);

  // --- List Operations ---

  const openCreateListModal = () => {
    setEditingList(null);
    setListName('');
    setIsListModalOpen(true);
  };

  const openEditListModal = (list: List) => {
    setEditingList(list);
    setListName(list.name);
    setIsListModalOpen(true);
  };

  const handleListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    if (editingList) {
      // Update List
      try {
        const res = await fetch(`/api/lists/${editingList._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: listName }),
        });
        if (res.ok) {
          await fetchBoardData(); // Refresh all to be safe or update optimistic
          setIsListModalOpen(false);
        }
      } catch (error) {
        console.error('Error updating list:', error);
      }
    } else {
      // Create List
      try {
        const res = await fetch(`/api/boards/${boardId}/lists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: listName }),
        });
        if (res.ok) {
          await fetchBoardData();
          setIsListModalOpen(false);
        }
      } catch (error) {
        console.error('Error creating list:', error);
      }
    }
  };

  const deleteList = async (listId: string) => {
    if (!confirm('Are you sure? This will delete all cards in the list.')) return;
    try {
      const res = await fetch(`/api/lists/${listId}`, { method: 'DELETE' });
      if (res.ok) {
        setLists(lists.filter(l => l._id !== listId));
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  // --- Card Operations ---

  const openCreateCardModal = (listId: string) => {
    setActiveCard(null);
    setActiveListId(listId);
    setCardTitle('');
    setCardDesc('');
    setIsCardModalOpen(true);
  };

  const openCardDetail = (card: Card) => {
    setActiveCard(card);
    setCardTitle(card.title);
    setCardDesc(card.description || '');
    setIsCardModalOpen(true);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    if (activeCard && activeCard._id) {
      // Update Card
      try {
        const res = await fetch(`/api/cards/${activeCard._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: cardTitle, description: cardDesc }),
        });
        if (res.ok) {
          await fetchBoardData();
          setIsCardModalOpen(false);
        }
      } catch (error) {
        console.error('Error updating card:', error);
      }
    } else if (activeListId) {
      // Create Card
      try {
        const res = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            title: cardTitle, 
            description: cardDesc,
            listId: activeListId
          }),
        });
        if (res.ok) {
          await fetchBoardData();
          setIsCardModalOpen(false);
        }
      } catch (error) {
        console.error('Error creating card:', error);
      }
    }
  };

  const deleteCard = async () => {
    if (!activeCard?._id || !confirm('Delete this card?')) return;
    try {
      const res = await fetch(`/api/cards/${activeCard._id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchBoardData();
        setIsCardModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };


  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (!board) return <div>Board not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-blue-600 overflow-x-auto">
      {/* Board Header Bar */}
      <div className="bg-black/20 p-4 text-white flex items-center gap-4 backdrop-blur-sm sticky left-0">
        <Link href="/" className="btn btn-ghost btn-sm text-white hover:bg-white/20 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <div className="h-6 w-px bg-white/20 mx-2"></div>
        <h1 className="text-xl font-bold">{board.name}</h1>
      </div>

      {/* Board Canvas */}
      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex items-start gap-6 h-full">
          
          {/* Lists */}
          {lists.map((list) => (
            <div key={list._id} className="w-72 flex-shrink-0 bg-[#f1f2f4] rounded-xl shadow-lg flex flex-col max-h-[calc(100vh-140px)] text-slate-800">
              {/* List Header */}
              <div className="p-3 flex justify-between items-center font-semibold text-sm px-4 pt-4">
                <h3>{list.name}</h3>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle hover:bg-gray-300">•••</div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-40">
                    <li><a onClick={() => openEditListModal(list)}>Edit Title</a></li>
                    <li><a onClick={() => deleteList(list._id)} className="text-error">Delete List</a></li>
                  </ul>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-2">
                {list.cards?.map((card) => (
                  <div 
                    key={card._id} 
                    onClick={() => openCardDetail(card)}
                    className="card bg-white shadow-sm hover:shadow-md cursor-pointer p-3 text-sm transition border border-gray-200 group relative"
                  >
                    <div className="font-medium text-slate-700">{card.title}</div>
                    {card.description && <div className="text-xs text-slate-500 mt-1 truncate">≡</div>}
                  </div>
                ))}
              </div>

              {/* Add Card Button */}
              <div className="p-2">
                <button 
                  onClick={() => openCreateCardModal(list._id)}
                  className="btn btn-ghost btn-sm btn-block justify-start text-slate-600 hover:bg-gray-300"
                >
                  + Add a card
                </button>
              </div>
            </div>
          ))}

          {/* Add List Button */}
          <div className="w-72 flex-shrink-0">
            <button 
              onClick={openCreateListModal}
              className="btn btn-block bg-white/20 hover:bg-white/30 border-none text-white justify-start h-auto py-3 backdrop-blur-sm shadow-lg"
            >
              + Add another list
            </button>
          </div>

        </div>
      </div>

      {/* List Modal */}
      {isListModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {editingList ? 'Edit List' : 'Add List'}
            </h3>
            <form onSubmit={handleListSubmit}>
              <div className="form-control w-full mt-4">
                <input 
                  type="text" 
                  placeholder="List title" 
                  className="input input-bordered w-full" 
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsListModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsListModalOpen(false)}></div>
        </dialog>
      )}

      {/* Card Modal */}
      {isCardModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl p-0 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-base-200 px-6 py-4 flex justify-between items-center border-b border-base-300">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="text-xl">🗃️</span> 
                {activeCard?._id ? 'Edit Card' : 'Create Card'}
              </h3>
              <button onClick={() => setIsCardModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleCardSubmit} className="flex flex-col gap-6">
                
                {/* Title Input */}
                <div className="form-control w-full">
                  <div className="flex items-center gap-2 mb-2 text-base-content/70">
                    <span className="font-semibold uppercase text-xs tracking-wider">Title</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Card title" 
                    className="input input-bordered w-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="form-control w-full">
                  <div className="flex items-center gap-2 mb-2 text-base-content/70">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <span className="font-semibold uppercase text-xs tracking-wider">Description</span>
                  </div>
                  <textarea 
                    className="textarea textarea-bordered h-40 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 bg-base-100" 
                    placeholder="Add a more detailed description..."
                    value={cardDesc}
                    onChange={(e) => setCardDesc(e.target.value)}
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-200">
                  {activeCard?._id ? (
                    <button 
                      type="button" 
                      onClick={deleteCard} 
                      className="btn btn-error btn-outline btn-sm gap-2"
                    >
                      🗑️ Delete Card
                    </button>
                  ) : (
                    <div></div> /* Spacer */
                  )}
                  
                  <div className="flex gap-2">
                    <button type="button" className="btn" onClick={() => setIsCardModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-8">Save</button>
                  </div>
                </div>

              </form>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsCardModalOpen(false)}></div>
        </dialog>
      )}

    </div>
  );
}

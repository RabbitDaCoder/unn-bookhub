import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Book } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Settings, 
  Bookmark, 
  Search,
  BookOpen,
  Download,
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Reader() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(120);
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;

    const fetchBook = async () => {
      try {
        const bookDoc = await getDoc(doc(db, 'books', id));
        if (bookDoc.exists()) {
          const bookData = { id: bookDoc.id, ...bookDoc.data() } as Book;
          
          // Check if user has access (purchased or borrowed)
          const borrowsQ = query(
            collection(db, 'borrowRecords'),
            where('userId', '==', user.uid),
            where('bookId', '==', id),
            where('status', '==', 'ACTIVE')
          );
          const borrowsSnap = await getDocs(borrowsQ);
          const hasAccess = !borrowsSnap.empty;

          if (!hasAccess && user.role !== 'ADMIN') {
            setError('You do not have access to this book. Please borrow or purchase it first.');
          } else {
            setBook(bookData);
          }
        } else {
          setError('Book not found.');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Failed to load book.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, user]);

  if (loading) {
    return (
      <div className="h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Loading Reader...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="h-screen bg-bg-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] text-center space-y-6">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold">{error || 'Access Denied'}</h1>
            <p className="text-sm opacity-60">Please ensure you have an active borrow or purchase for this book.</p>
          </div>
          <Link 
            to={`/books/${id}`} 
            className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-light transition-all"
          >
            Go to Book Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden text-white">
      {/* Reader Header */}
      <header className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-10 bg-white/10 rounded overflow-hidden border border-white/20">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm font-bold truncate max-w-[200px]">{book.title}</h1>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">{book.authorName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="flex items-center bg-white/10 rounded-xl p-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 flex items-center space-x-2 text-xs font-bold">
              <input 
                type="number" 
                value={page}
                onChange={(e) => setPage(Math.min(totalPages, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-12 bg-transparent text-center focus:outline-none focus:bg-white/10 rounded"
              />
              <span className="opacity-40">/</span>
              <span className="opacity-40">{totalPages}</span>
            </div>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 space-y-8 z-40 overflow-y-auto"
            >
              <div className="space-y-4">
                <h2 className="text-lg font-display font-bold">Table of Contents</h2>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button 
                      key={i}
                      onClick={() => setPage(i * 10)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl text-sm transition-all",
                        page >= i * 10 && page < (i + 1) * 10 ? "bg-primary text-white" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className="font-bold">Chapter {i}</div>
                      <div className="text-[10px] opacity-60">Page {i * 10}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-display font-bold">Bookmarks</h2>
                <div className="bg-white/5 p-4 rounded-2xl text-center text-xs opacity-40">
                  No bookmarks yet.
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Reader Area */}
        <main className="flex-1 bg-bg-dark overflow-auto p-4 md:p-12 flex justify-center custom-scrollbar">
          <div 
            className="bg-white shadow-2xl relative"
            style={{ 
              width: `${600 * (zoom / 100)}px`, 
              height: `${800 * (zoom / 100)}px`,
              transition: 'all 0.3s ease-out'
            }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] rotate-[-45deg] select-none">
              <div className="text-center">
                <div className="text-6xl font-bold uppercase tracking-[1em]">UNN BOOKHUB</div>
                <div className="text-2xl font-bold mt-4">{user.fullName} • {user.email}</div>
              </div>
            </div>

            {/* Page Content (Simulated) */}
            <div className="p-12 text-text-dark space-y-8">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{book.title}</div>
                <div className="text-[10px] font-bold opacity-40">Page {page}</div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold">Chapter {Math.ceil(page / 10)}</h2>
                <div className="space-y-4 text-lg leading-relaxed font-serif opacity-80">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                  </p>
                </div>
              </div>
            </div>

            {/* Page Controls Overlay */}
            <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </main>

        {/* Right Info Panel (Desktop) */}
        <aside className="hidden xl:block w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold">Book Info</h2>
            <div className="bg-white/5 p-6 rounded-2xl space-y-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <div className="font-bold">{book.title}</div>
                <div className="text-xs opacity-60">{book.authorName}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold">Reading Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-xl font-bold">{Math.round((page / totalPages) * 100)}%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Progress</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <div className="text-xl font-bold">12m</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Session</div>
              </div>
            </div>
          </div>

          <div className="bg-primary/20 border border-primary/30 p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <div className="text-xs font-bold uppercase tracking-widest">Secure Access</div>
            </div>
            <p className="text-[10px] opacity-60 leading-relaxed">
              This book is protected by UNN BookHub Digital Rights Management. Unauthorized distribution is prohibited.
            </p>
          </div>
        </aside>
      </div>

      {/* Reader Footer */}
      <footer className="h-12 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>Borrow expires in 12 days</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
          <span>{user.fullName}</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>UNN Digital Wing</span>
        </div>
      </footer>
    </div>
  );
}

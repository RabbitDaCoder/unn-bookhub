import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Book, BorrowRecord } from '../types';
import { useAuthStore, useUIStore } from '../store/useStore';
import { Library as LibraryIcon, BookOpen, Clock, Star, Search, Filter, ArrowRight, ChevronRight, PlayCircle, Lock } from 'lucide-react';
import MusicPlayer from '../components/MusicPlayer';
import { cn, formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [myBorrows, setMyBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { isDarkMode } = useUIStore();

  useEffect(() => {
    const fetchLibraryData = async () => {
      setLoading(true);
      try {
        // Fetch borrowable books
        const booksQ = query(
          collection(db, 'books'),
          where('isELibraryAvailable', '==', true),
          limit(12)
        );
        const booksSnap = await getDocs(booksQ);
        setBooks(booksSnap.docs.map(d => ({ id: d.id, ...d.data() } as Book)));

        // Fetch popular books
        const popularQ = query(
          collection(db, 'books'),
          where('isELibraryAvailable', '==', true),
          orderBy('averageRating', 'desc'),
          limit(6)
        );
        const popularSnap = await getDocs(popularQ);
        setPopularBooks(popularSnap.docs.map(d => ({ id: d.id, ...d.data() } as Book)));

        // Fetch user borrows if logged in
        if (user) {
          const borrowsQ = query(
            collection(db, 'borrowRecords'),
            where('userId', '==', user.uid),
            where('status', '==', 'ACTIVE')
          );
          const borrowsSnap = await getDocs(borrowsQ);
          setMyBorrows(borrowsSnap.docs.map(d => ({ id: d.id, ...d.data() } as BorrowRecord)));
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [user]);

  return (
    <div className="bg-bg-dark text-white min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-dark" />
          <div className="absolute inset-0 bg-black/40" />
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Library Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Particles (Simplified) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div 
              key={i}
              animate={{ 
                y: [-20, 20, -20],
                x: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ repeat: Infinity, duration: 5 + i, delay: i }}
              className="absolute w-2 h-2 bg-secondary rounded-full blur-sm"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
          >
            <img src="https://upload.wikimedia.org/wikipedia/en/5/5e/University_of_Nigeria_Nsukka_logo.png" alt="UNN Logo" className="h-8 w-8" referrerPolicy="no-referrer" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Nnamdi Azikiwe Library</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight"
          >
            The <span className="text-secondary italic">Digital Wing</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Immerse yourself in academic excellence. Borrow digital textbooks, read research journals, and study with curated ambient music.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="Search the digital archives..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-secondary transition-all backdrop-blur-md"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Active Borrows */}
        {user && myBorrows.length > 0 && (
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">Currently Reading</h2>
                <p className="text-white/40">You have {myBorrows.length} active digital borrowings.</p>
              </div>
              <Link to="/library/my-books" className="text-secondary font-bold flex items-center space-x-1 hover:text-white transition-colors">
                <span>My Library</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myBorrows.map(borrow => (
                <div key={borrow.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center space-x-6 hover:bg-white/10 transition-all group">
                  <div className="w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shrink-0">
                    <img src={`https://picsum.photos/seed/${borrow.bookId}/300/400`} alt="Book" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      <span>Expires in {Math.ceil((new Date(borrow.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days</span>
                    </div>
                    <h3 className="font-bold text-lg line-clamp-1">Academic Resource</h3>
                    <Link 
                      to={`/library/read/${borrow.bookId}`}
                      className="inline-flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Continue Reading</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available Books Grid */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold">Digital Archives</h2>
              <p className="text-white/40">Browse textbooks available for instant digital borrowing.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {books.map(book => (
              <Link 
                key={book.id} 
                to={`/book/${book.id}`}
                className="group space-y-4"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Borrow From</p>
                    <p className="text-lg font-display font-bold">{formatCurrency(book.borrowPrice1Day || 0)}</p>
                    <div className="bg-white text-bg-dark px-4 py-1 rounded-full text-[10px] font-bold">VIEW DETAILS</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm line-clamp-1 group-hover:text-secondary transition-colors">{book.title}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{book.courseCode}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Section */}
        <section className="bg-white/5 rounded-[3rem] p-12 space-y-12 border border-white/10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-display font-bold">Popular This Week</h2>
            <p className="text-white/40 max-w-lg mx-auto">The most borrowed digital resources by UNN students this semester.</p>
          </div>

          <div className="flex space-x-8 overflow-x-auto pb-8 scrollbar-hide">
            {popularBooks.map(book => (
              <div key={book.id} className="min-w-[320px] bg-bg-dark border border-white/10 rounded-3xl p-6 flex flex-col space-y-6 group cursor-pointer hover:border-secondary transition-all">
                <div className="aspect-video rounded-2xl overflow-hidden relative">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-secondary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{book.averageRating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-white/60 line-clamp-2">{book.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-xs text-white/40">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.totalPages} Pages</span>
                  </div>
                  <button className="text-secondary font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Borrow</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Library Info */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24 border-t border-white/10">
          <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold leading-tight">
              A Legacy of <span className="text-secondary italic">Knowledge</span>, <br />
              Now in Your Pocket.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              The Nnamdi Azikiwe Library has been the heart of UNN's academic life for decades. Our Digital Wing ensures that every student, regardless of location, has access to the same world-class resources.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-3xl font-display font-bold text-secondary">24/7</p>
                <p className="text-xs uppercase tracking-widest opacity-40 font-bold">Instant Access</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-display font-bold text-secondary">100%</p>
                <p className="text-xs uppercase tracking-widest opacity-40 font-bold">Digital Sync</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1000" 
                alt="Library Interior" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-secondary p-8 rounded-3xl shadow-2xl max-w-[240px] space-y-4">
              <Lock className="w-10 h-10 text-white" />
              <p className="text-sm font-bold text-white leading-relaxed">
                Secure, encrypted access for all verified UNN students and staff.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Book, Author, Review } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { useCartStore, useUIStore, useAuthStore } from '../store/useStore';
import { ShoppingCart, Library, Star, ChevronRight, ArrowLeft, Share2, Heart, Clock, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowDuration, setBorrowDuration] = useState(7);
  const { addItem } = useCartStore();
  const { isDarkMode } = useUIStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const bookSnap = await getDoc(doc(db, 'books', id));
        if (bookSnap.exists()) {
          const bookData = { id: bookSnap.id, ...bookSnap.data() } as Book;
          setBook(bookData);

          // Fetch Author
          const authorSnap = await getDoc(doc(db, 'authors', bookData.authorId));
          if (authorSnap.exists()) {
            setAuthor({ id: authorSnap.id, ...authorSnap.data() } as Author);
          }

          // Fetch Related Books
          const relatedQ = query(
            collection(db, 'books'),
            where('department', '==', bookData.department),
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQ);
          setRelatedBooks(relatedSnap.docs.filter(d => d.id !== id).map(d => ({ id: d.id, ...d.data() } as Book)));

          // Fetch Reviews
          const reviewsQ = query(
            collection(db, 'reviews'),
            where('bookId', '==', id),
            limit(5)
          );
          const reviewsSnap = await getDocs(reviewsQ);
          setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[3/4] bg-white/10 rounded-3xl" />
          <div className="space-y-8">
            <div className="h-12 bg-white/10 rounded w-3/4" />
            <div className="h-6 bg-white/10 rounded w-1/2" />
            <div className="h-32 bg-white/10 rounded w-full" />
            <div className="h-16 bg-white/10 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-error mx-auto opacity-20" />
        <h2 className="text-3xl font-display font-bold">Book not found</h2>
        <button onClick={() => navigate('/bookshelf')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">
          Back to Bookshelf
        </button>
      </div>
    );
  }

  const borrowPrices: Record<number, number | undefined> = {
    1: book.borrowPrice1Day,
    3: book.borrowPrice3Days,
    7: book.borrowPrice7Days,
    14: book.borrowPrice14Days,
    30: book.borrowPrice30Days,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest opacity-60">
        <Link to="/bookshelf" className="hover:text-primary transition-colors">Bookshelf</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{book.faculty}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="truncate max-w-[200px]">{book.title}</span>
      </nav>

      {/* Main Detail Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Cover & Actions */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-border flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-primary">{book.uniqueBookId}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-border rounded-2xl font-bold hover:border-secondary transition-all shadow-sm">
              <Share2 className="w-5 h-5 text-secondary" />
              <span>Share</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-border rounded-2xl font-bold hover:border-error transition-all shadow-sm">
              <Heart className="w-5 h-5 text-error" />
              <span>Wishlist</span>
            </button>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{book.type}</span>
              <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{book.courseCode}</span>
              <span className="bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{book.level} Level</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{book.title}</h1>
            {book.subtitle && <p className="text-xl opacity-60 italic">{book.subtitle}</p>}
            
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1 text-secondary">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={cn("w-5 h-5", s <= Math.round(book.averageRating) ? "fill-current" : "opacity-20")} />
                ))}
              </div>
              <span className="text-sm font-bold opacity-60">({book.totalReviews} Reviews)</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
              <img src={author?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || '')}`} alt={author?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Written By</p>
              <Link to={`/author/${author?.id}`} className="text-xl font-display font-bold hover:text-primary transition-colors">{author?.name}</Link>
              <p className="text-xs opacity-60">{author?.specialization} • {author?.institution}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold border-b border-border pb-2">Description</h3>
            <p className="leading-relaxed opacity-80">{book.description}</p>
          </div>

          {/* Purchase Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buy Physical */}
            <div className="p-8 bg-primary text-white rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Purchase Textbook</p>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-display font-bold">{formatCurrency(book.price)}</span>
                  <span className="text-sm opacity-60 mb-1">/ Physical Copy</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Official UNN Departmental Copy</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Pick up from {book.department} store</span>
                </div>
              </div>
              <button 
                onClick={() => addItem(book)}
                disabled={book.stock <= 0}
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Borrow Digital */}
            {book.isELibraryAvailable && (
              <div className="p-8 bg-white border-2 border-primary rounded-3xl space-y-6 shadow-xl">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">E-Library Borrowing</p>
                  <div className="flex items-end space-x-2">
                    <span className="text-4xl font-display font-bold text-primary">{formatCurrency(borrowPrices[borrowDuration] || 0)}</span>
                    <span className="text-sm opacity-60 mb-1 text-text-dark">/ {borrowDuration} Days</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs font-bold opacity-60">Select Duration:</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 3, 7, 14, 30].map(d => (
                      <button 
                        key={d}
                        onClick={() => setBorrowDuration(d)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                          borrowDuration === d ? "bg-primary text-white" : "bg-bg-cream hover:bg-primary/10"
                        )}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg">
                  <Library className="w-5 h-5" />
                  <span>Borrow Digital</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Book Details Table */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-border">
        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold">Book Specifications</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <p className="opacity-60">ISBN</p>
            <p className="font-bold">{book.isbn || 'N/A'}</p>
            <p className="opacity-60">Edition</p>
            <p className="font-bold">{book.edition || '1st Edition'}</p>
            <p className="opacity-60">Published Year</p>
            <p className="font-bold">{book.publishedYear || 'N/A'}</p>
            <p className="opacity-60">Total Pages</p>
            <p className="font-bold">{book.totalPages || 'N/A'}</p>
            <p className="opacity-60">Language</p>
            <p className="font-bold">English</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold">Preview Pages</h3>
          <div className="aspect-video bg-bg-dark rounded-3xl flex items-center justify-center relative group overflow-hidden">
            <img src={book.coverImage} alt="Preview" className="w-full h-full object-cover opacity-30 blur-sm" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-white">
              <BookOpen className="w-12 h-12 text-secondary" />
              <p className="font-bold">First 10 Pages Available</p>
              <button className="bg-white text-primary px-6 py-2 rounded-full text-sm font-bold hover:bg-secondary hover:text-white transition-all">
                Open Preview Flipbook
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold">Student Reviews</h2>
            <p className="opacity-60">What your colleagues are saying about this material.</p>
          </div>
          <button className="text-primary font-bold hover:text-secondary transition-colors">Write a Review</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="p-8 bg-white border border-border rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {review.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">Verified Student</p>
                    <p className="text-[10px] opacity-60 uppercase">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-secondary">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-current" : "opacity-20")} />)}
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed italic">"{review.comment}"</p>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12 opacity-40">
              <p>No reviews yet for this book.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Books */}
      <section className="space-y-12">
        <h2 className="text-3xl font-display font-bold">Related Materials</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedBooks.map(b => (
            <Link key={b.id} to={`/book/${b.id}`} className="group space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-border">
                <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm line-clamp-1">{b.title}</h4>
                <p className="text-xs opacity-60">{formatCurrency(b.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

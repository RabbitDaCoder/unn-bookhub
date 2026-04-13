import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Book, Order, BorrowRecord } from '../types';
import { 
  Book as BookIcon, 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  User as UserIcon, 
  Settings, 
  LogOut,
  CreditCard,
  MessageSquare,
  Library,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, setUser } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeBorrows, setActiveBorrows] = useState<BorrowRecord[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const ordersSnap = await getDocs(ordersQuery);
        setRecentOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

        // Fetch active borrows
        const borrowsQuery = query(
          collection(db, 'borrows'),
          where('userId', '==', user.uid),
          where('status', '==', 'active'),
          limit(3)
        );
        const borrowsSnap = await getDocs(borrowsQuery);
        setActiveBorrows(borrowsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BorrowRecord)));

        // Fetch recommended books (same department)
        const booksQuery = query(
          collection(db, 'books'),
          where('department', '==', user.department),
          limit(4)
        );
        const booksSnap = await getDocs(booksQuery);
        setRecommendedBooks(booksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  const stats = [
    { label: 'Books Purchased', value: recentOrders.length, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Active Borrows', value: activeBorrows.length, icon: BookIcon, color: 'bg-green-500' },
    { label: 'Library Visits', value: 12, icon: Clock, color: 'bg-purple-500' },
    { label: 'Saved Items', value: user.wishlist.length, icon: Library, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Hello, {user.fullName.split(' ')[0]}</h1>
          <p className="text-sm opacity-60">{user.department} • {user.level} Level</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/profile" className="p-2 hover:bg-bg-cream rounded-full transition-colors">
            <Settings className="w-6 h-6 opacity-60" />
          </Link>
          <button 
            onClick={() => {
              setUser(null);
              navigate('/login');
            }}
            className="p-2 hover:bg-error/10 text-error rounded-full transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-40">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Borrows */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Active Borrows</h2>
              <Link to="/library" className="text-xs font-bold text-primary hover:underline flex items-center">
                Go to Library <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBorrows.length > 0 ? (
                activeBorrows.map(borrow => (
                  <div key={borrow.id} className="bg-bg-cream border border-border p-4 rounded-2xl flex items-center space-x-4">
                    <div className="w-12 h-16 bg-border rounded-lg overflow-hidden shrink-0">
                      <img src={borrow.bookCover} alt={borrow.bookTitle} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{borrow.bookTitle}</h3>
                      <p className="text-xs opacity-60">Due: {formatDate(borrow.dueDate)}</p>
                    </div>
                    <Link to={`/reader/${borrow.bookId}`} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-bg-cream/50 border border-dashed border-border p-8 rounded-2xl text-center">
                  <p className="text-sm opacity-40">No active borrows. Visit the E-Library to start reading.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recommended for You */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Recommended for {user.department}</h2>
              <Link to="/books" className="text-xs font-bold text-primary hover:underline flex items-center">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedBooks.map(book => (
                <Link key={book.id} to={`/books/${book.id}`} className="group space-y-2">
                  <div className="aspect-[3/4] bg-bg-cream rounded-xl overflow-hidden border border-border group-hover:shadow-lg transition-all">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-sm font-bold truncate">{book.title}</h3>
                  <p className="text-xs opacity-60">{formatCurrency(book.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Orders */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <div key={order.id} className="bg-white border border-border p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-bold opacity-40">#{order.id.slice(-6).toUpperCase()}</div>
                      <div className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                        order.status === 'completed' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {order.status}
                      </div>
                    </div>
                    <div className="font-bold">{formatCurrency(order.totalAmount)}</div>
                    <div className="text-[10px] opacity-40">{formatDate(order.createdAt)}</div>
                    <Link to={`/orders/${order.id}`} className="block text-center py-2 text-xs font-bold text-primary hover:bg-bg-cream rounded-lg transition-colors">
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-bg-cream/50 border border-dashed border-border p-8 rounded-2xl text-center">
                  <p className="text-sm opacity-40">No orders yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-primary text-white p-6 rounded-[2rem] shadow-xl shadow-primary/20 space-y-6">
            <h2 className="text-xl font-display font-bold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/complaints/new" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-colors">
                <MessageSquare className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
              </Link>
              <Link to="/verify-receipt" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-colors">
                <CreditCard className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verify</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

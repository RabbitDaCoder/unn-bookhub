import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { collection, query, getDocs, limit, orderBy, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Book, Order, User, Complaint } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { FACULTIES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Admin() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'orders' | 'users' | 'complaints'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const fetchAdminData = async () => {
      try {
        const booksSnap = await getDocs(query(collection(db, 'books'), orderBy('title', 'asc')));
        setBooks(booksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));

        const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10)));
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

        const usersSnap = await getDocs(query(collection(db, 'users'), limit(10)));
        setUsers(usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)));

        const complaintsSnap = await getDocs(query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(10)));
        setComplaints(complaintsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint)));

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-error mx-auto" />
          <h1 className="text-2xl font-display font-bold">Access Denied</h1>
          <p className="text-sm opacity-60">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(orders.reduce((acc, curr) => acc + curr.totalAmount, 0)), icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Books in Stock', value: books.length, icon: BookOpen, color: 'bg-purple-500' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'PENDING').length, icon: ShoppingBag, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-sm opacity-60">Management portal for UNN BookHub.</p>
        </div>
        <div className="flex items-center space-x-2 bg-bg-cream p-1 rounded-2xl border border-border">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'books', label: 'Books', icon: BookOpen },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'complaints', label: 'Complaints', icon: MessageSquare },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeTab === tab.id ? "bg-primary text-white shadow-lg" : "hover:bg-white opacity-60 hover:opacity-100"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-white border border-border p-6 rounded-3xl shadow-sm">
                  <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-40">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <section className="bg-white border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-primary hover:underline">View All</button>
                </div>
                <div className="divide-y divide-border">
                  {orders.map(order => (
                    <div key={order.id} className="p-4 flex items-center justify-between hover:bg-bg-cream transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-bg-cream rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 opacity-40" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">#{order.id.slice(-6).toUpperCase()}</div>
                          <div className="text-[10px] opacity-40">{formatDate(order.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatCurrency(order.totalAmount)}</div>
                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pending Complaints */}
              <section className="bg-white border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold">Pending Complaints</h2>
                  <button onClick={() => setActiveTab('complaints')} className="text-xs font-bold text-primary hover:underline">View All</button>
                </div>
                <div className="divide-y divide-border">
                  {complaints.filter(c => c.status !== 'resolved').map(complaint => (
                    <div key={complaint.id} className="p-4 flex items-center justify-between hover:bg-bg-cream transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold truncate max-w-[200px]">{complaint.subject}</div>
                          <div className="text-[10px] opacity-40">{complaint.userName} • {formatDate(complaint.createdAt)}</div>
                        </div>
                      </div>
                      <Link to={`/complaints/${complaint.id}`} className="p-2 hover:bg-bg-cream rounded-lg transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {activeTab === 'books' && (
          <motion.div 
            key="books"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Manage Inventory</h2>
              <button 
                onClick={() => {
                  setEditingBook(null);
                  setIsBookModalOpen(true);
                }}
                className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-xl shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book</span>
              </button>
            </div>

            <div className="bg-white border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-cream border-b border-border">
                    <th className="p-6 text-xs font-bold uppercase tracking-widest opacity-40">Book Details</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest opacity-40">Faculty/Dept</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest opacity-40">Price</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest opacity-40">Stock</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest opacity-40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {books.map(book => (
                    <tr key={book.id} className="hover:bg-bg-cream transition-colors">
                      <td className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-14 bg-bg-cream rounded-lg overflow-hidden border border-border">
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="font-bold truncate max-w-[200px]">{book.title}</div>
                            <div className="text-[10px] opacity-40">{book.authorName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-xs font-bold">{book.faculty}</div>
                        <div className="text-[10px] opacity-40">{book.department}</div>
                      </td>
                      <td className="p-6 font-bold">{formatCurrency(book.price)}</td>
                      <td className="p-6">
                        <div className={cn(
                          "text-xs font-bold",
                          book.stock < 10 ? "text-error" : "text-green-600"
                        )}>
                          {book.stock} units
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setEditingBook(book);
                              setIsBookModalOpen(true);
                            }}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Modal (Simplified) */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                <button onClick={() => setIsBookModalOpen(false)} className="p-2 hover:bg-bg-cream rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Book Title</label>
                    <input type="text" defaultValue={editingBook?.title} className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Author Name</label>
                    <input type="text" defaultValue={editingBook?.authorName} className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Price (NGN)</label>
                    <input type="number" defaultValue={editingBook?.price} className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Faculty</label>
                    <select className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary appearance-none">
                      {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Stock Quantity</label>
                    <input type="number" defaultValue={editingBook?.stock} className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20">
                      {editingBook ? 'Save Changes' : 'Add Book to Inventory'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { ShoppingBag, ChevronRight, Search, Filter, Calendar, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(ordersQuery);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="h-10 w-48 bg-bg-cream rounded-xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full bg-bg-cream rounded-[2rem] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">My Orders</h1>
          <p className="text-sm opacity-60">Track and manage your book purchases.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input 
              type="text" 
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bg-cream border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-all w-full md:w-64"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-bg-cream border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order, i) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 bg-bg-cream rounded-2xl flex items-center justify-center shrink-0">
                  <Package className="w-8 h-8 opacity-20" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Order #{order.id.slice(-6).toUpperCase()}</span>
                    <div className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                      order.status === 'completed' ? "bg-green-100 text-green-700" : 
                      order.status === 'pending' ? "bg-orange-100 text-orange-700" : "bg-error/10 text-error"
                    )}>
                      {order.status}
                    </div>
                  </div>
                  <h3 className="font-bold truncate">
                    {order.items.map(item => item.title).join(', ')}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs opacity-60">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{order.items.length} items</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:space-x-8">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{order.paymentStatus}</div>
                  </div>
                  <Link 
                    to={`/orders/${order.id}`}
                    className="p-3 bg-bg-cream hover:bg-primary hover:text-white rounded-xl transition-all group-hover:translate-x-1"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-cream/50 border border-dashed border-border p-20 rounded-[3rem] text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-8 h-8 opacity-20" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold">No orders found</h3>
            <p className="text-sm opacity-40">You haven't placed any orders yet or no orders match your search.</p>
          </div>
          <Link to="/books" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
            <span>Go to Bookshelf</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

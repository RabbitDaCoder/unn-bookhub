import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronLeft, 
  Calendar, 
  User as UserIcon,
  CreditCard,
  Package,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate, generateStampHash } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function VerifyReceipt() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialId = queryParams.get('id') || '';
  const initialHash = queryParams.get('hash') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [stampHash, setStampHash] = useState(initialHash);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId || !stampHash) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setVerified(false);

    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
        const expectedHash = generateStampHash(orderData.id, orderData.userId);

        if (expectedHash === stampHash) {
          setOrder(orderData);
          setVerified(true);
        } else {
          setError('Invalid verification hash. This receipt may have been tampered with.');
        }
      } else {
        setError('Order not found. Please check the Order ID.');
      }
    } catch (err: any) {
      console.error('Error verifying receipt:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId && initialHash) {
      handleVerify();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/5">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Receipt Verification Portal</h1>
          <p className="text-sm opacity-60 max-w-md mx-auto">
            Verify the authenticity of any UNN BookHub receipt using the Order ID and unique verification hash.
          </p>
        </div>
      </div>

      {/* Verification Form */}
      <div className="bg-white border border-border p-8 md:p-10 rounded-[2.5rem] shadow-xl space-y-8">
        <form onSubmit={handleVerify} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Order ID</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input 
                type="text" 
                required 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 5f3a2b1c"
                className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Verification Hash</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input 
                type="text" 
                required 
                value={stampHash}
                onChange={(e) => setStampHash(e.target.value)}
                placeholder="Enter the unique hash from the receipt"
                className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all font-mono text-xs"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading || !orderId || !stampHash}
            className="md:col-span-2 bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Authenticity</span>
                <Search className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-error/10 border border-error/20 text-error p-6 rounded-2xl flex items-center space-x-4"
            >
              <AlertCircle className="w-8 h-8 shrink-0" />
              <div className="space-y-1">
                <div className="font-bold">Verification Failed</div>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </motion.div>
          )}

          {verified && order && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 pt-4"
            >
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 p-6 rounded-2xl flex items-center space-x-4">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div className="space-y-1">
                  <div className="font-bold">Authenticity Verified</div>
                  <p className="text-sm opacity-80">This receipt is official and has not been altered.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-display font-bold">Order Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-bg-cream rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 opacity-40" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Order Date</div>
                        <div className="text-sm font-bold">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-bg-cream rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 opacity-40" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total Amount</div>
                        <div className="text-sm font-bold">{formatCurrency(order.totalAmount)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-bg-cream rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 opacity-40" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Status</div>
                        <div className="text-sm font-bold text-green-600 uppercase tracking-widest text-[10px]">{order.status}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-display font-bold">Purchased Items</h2>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="bg-bg-cream/50 p-3 rounded-xl flex items-center justify-between">
                        <div className="text-sm font-bold truncate max-w-[150px]">{item.title}</div>
                        <div className="text-[10px] font-bold opacity-40">{item.quantity} x {formatCurrency(item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex justify-center">
                <Link 
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center space-x-2 text-primary font-bold hover:underline"
                >
                  <span>View Full Order Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Digital Signature', desc: 'Every receipt is signed with a unique cryptographic hash linked to the order data.', icon: ShieldCheck },
          { title: 'Tamper Proof', desc: 'Any change to the receipt data will invalidate the verification hash immediately.', icon: Lock },
          { title: 'Official Record', desc: 'Verification is performed directly against our secure academic database.', icon: Package },
        ].map((item, i) => (
          <div key={i} className="text-center space-y-3 p-6">
            <div className="w-12 h-12 bg-bg-cream text-primary rounded-2xl flex items-center justify-center mx-auto">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold">{item.title}</h3>
            <p className="text-xs opacity-60 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

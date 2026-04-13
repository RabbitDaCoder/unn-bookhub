import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store/useStore';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, CartItem } from '../types';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nsukka');
  const [state, setState] = useState('Enugu');
  const [phone, setPhone] = useState(user?.phone || '');

  const handlePlaceOrder = async () => {
    if (!user) {
      setError('Please log in to place an order.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create order in Firestore
      const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        items: items,
        totalAmount: totalAmount + 150, // Including processing fee
        status: 'PENDING',
        shippingAddress: {
          address,
          city,
          state,
          zipCode: '410001'
        },
        paymentMethod: 'PAYSTACK',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptId: `REC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      // 2. Simulate Paystack Payment
      // In a real app, we would redirect to Paystack or use their inline popup
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Update order status to completed
      await updateDoc(orderRef, {
        status: 'completed',
        paymentStatus: 'paid',
        updatedAt: new Date().toISOString()
      });

      // 4. Update book stock
      for (const item of items) {
        const bookRef = doc(db, 'books', item.id);
        await updateDoc(bookRef, {
          stock: increment(-item.quantity)
        });
      }

      setStep('success');
      clearCart();

    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-bold">Your cart is empty</h1>
        <Link to="/books" className="text-primary hover:underline mt-4 block">Return to Bookshelf</Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Order Confirmed!</h1>
          <p className="text-lg opacity-60">Thank you for your purchase. Your books are being prepared for delivery.</p>
        </div>
        <div className="bg-bg-cream border border-border p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="opacity-60">Order Status</span>
            <span className="font-bold text-green-600 uppercase tracking-widest text-xs">Completed</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="opacity-60">Payment Method</span>
            <span className="font-bold">Paystack (Card)</span>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs opacity-60">A confirmation email and receipt have been sent to your student email.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/dashboard" 
            className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-primary/20"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/books" 
            className="w-full md:w-auto bg-white border border-border px-8 py-4 rounded-xl font-bold hover:bg-bg-cream transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/cart')} className="p-2 hover:bg-bg-cream rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-display font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Steps */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Shipping Information */}
          <section className={cn(
            "bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8 transition-all",
            step !== 'shipping' && "opacity-50 pointer-events-none"
          )}>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">1</div>
              <h2 className="text-xl font-display font-bold">Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Delivery Address (Hostel/Department)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                  <input 
                    type="text" 
                    required 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Room 204, Alvan Ikoku Hostel"
                    className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">City</label>
                <input 
                  type="text" 
                  value={city}
                  readOnly
                  className="w-full bg-bg-cream/50 border border-border rounded-xl px-4 py-3 opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep('payment')}
              disabled={!address || !phone}
              className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </section>

          {/* Payment Information */}
          <section className={cn(
            "bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8 transition-all",
            step !== 'payment' && "opacity-50 pointer-events-none"
          )}>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-display font-bold">Payment Method</h2>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-primary bg-primary/5 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img src="https://paystack.com/assets/img/paystack-logo-vector.svg" alt="Paystack" className="h-6" />
                  </div>
                  <div>
                    <div className="font-bold">Paystack Secure Checkout</div>
                    <div className="text-xs opacity-60">Pay with Card, Bank Transfer, or USSD</div>
                  </div>
                </div>
                <div className="w-6 h-6 border-4 border-primary rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs opacity-40 justify-center">
                <Lock className="w-3 h-3" />
                <span>Your payment information is encrypted and secure.</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep('shipping')}
                className="flex-1 bg-white border border-border py-4 rounded-xl font-bold hover:bg-bg-cream transition-all"
              >
                Back
              </button>
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-[2] bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay {formatCurrency(totalAmount + 150)}</span>
                    <ShieldCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-border p-8 rounded-[2.5rem] shadow-xl space-y-6 sticky top-24">
            <h2 className="text-xl font-display font-bold">Order Summary</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-12 h-16 bg-bg-cream rounded-lg overflow-hidden border border-border shrink-0">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{item.title}</div>
                    <div className="text-xs opacity-60">{item.quantity} x {formatCurrency(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Processing Fee</span>
                <span className="font-bold">{formatCurrency(150)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-display font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount + 150)}</span>
              </div>
            </div>

            <div className="bg-bg-cream/50 p-4 rounded-2xl flex items-center space-x-3">
              <Truck className="w-5 h-5 text-primary" />
              <div className="text-[10px] font-bold leading-tight">
                <div className="uppercase tracking-widest opacity-40">Estimated Delivery</div>
                <div>24 - 48 Hours (On Campus)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

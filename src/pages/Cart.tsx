import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store/useStore';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-bg-cream rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="w-12 h-12 opacity-20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold">Your cart is empty</h1>
          <p className="text-sm opacity-60">Looks like you haven't added any books to your cart yet.</p>
        </div>
        <Link 
          to="/books" 
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-primary/20"
        >
          <span>Browse Bookshelf</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Shopping Cart</h1>
          <p className="text-sm opacity-60">You have {items.length} items in your cart.</p>
        </div>
        <button 
          onClick={clearCart}
          className="text-xs font-bold text-error hover:underline flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-border p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-32 bg-bg-cream rounded-xl overflow-hidden border border-border shrink-0">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0 space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold truncate">{item.title}</h3>
                  <p className="text-sm opacity-60">{item.authorName}</p>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">{item.type}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-bg-cream border border-border rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</div>
                    <div className="text-[10px] opacity-40">{formatCurrency(item.price)} each</div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-border p-8 rounded-[2.5rem] shadow-xl space-y-6 sticky top-24">
            <h2 className="text-xl font-display font-bold">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Processing Fee</span>
                <span className="font-bold">{formatCurrency(150)}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-lg font-display font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount + 150)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-primary/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link 
                to="/books" 
                className="w-full block text-center py-4 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="bg-bg-cream/50 p-4 rounded-2xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Secure Payments</div>
              <div className="flex items-center space-x-3 opacity-60 grayscale">
                <img src="https://paystack.com/assets/img/paystack-logo-vector.svg" alt="Paystack" className="h-4" />
                <div className="h-4 w-px bg-border" />
                <span className="text-[10px] font-bold">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

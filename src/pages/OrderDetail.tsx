import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, Book } from '../types';
import { 
  ChevronLeft, 
  Download, 
  Printer, 
  Package, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate, generateStampHash } from '../lib/utils';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;

    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', id));
        if (orderDoc.exists()) {
          const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
          if (orderData.userId !== user.uid && user.role !== 'ADMIN') {
            setError('Unauthorized access to this order.');
          } else {
            setOrder(orderData);
          }
        } else {
          setError('Order not found.');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !order) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`UNN_BookHub_Receipt_${order.id.slice(-6).toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="h-10 w-48 bg-bg-cream rounded-xl animate-pulse" />
        <div className="h-96 w-full bg-bg-cream rounded-[2.5rem] animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-bold">{error || 'Order not found'}</h1>
        <Link to="/orders" className="text-primary hover:underline">Back to My Orders</Link>
      </div>
    );
  }

  const stampHash = generateStampHash(order.id, order.userId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/orders')} className="p-2 hover:bg-bg-cream rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">Order Details</h1>
            <p className="text-sm opacity-60">Order ID: #{order.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownloadReceipt}
            className="bg-white border border-border hover:bg-bg-cream px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-primary text-white hover:bg-primary-light px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-xl shadow-primary/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Banner */}
          <div className={cn(
            "p-6 rounded-[2rem] flex items-center justify-between",
            order.status === 'completed' ? "bg-green-500 text-white" : "bg-orange-500 text-white"
          )}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {order.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Order Status</div>
                <div className="text-xl font-bold capitalize">{order.status}</div>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">Placed On</div>
              <div className="font-bold">{formatDate(order.createdAt)}</div>
            </div>
          </div>

          {/* Items List */}
          <section className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold">Order Items</h2>
            <div className="space-y-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-16 h-20 bg-bg-cream rounded-xl overflow-hidden border border-border shrink-0">
                    <img src={`https://picsum.photos/seed/${item.bookId}/200/300`} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold truncate">{item.title}</h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{item.type}</p>
                    <p className="text-xs opacity-60">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <div className="text-right font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span className="font-bold">{formatCurrency(order.totalAmount - 150)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Processing Fee</span>
                <span className="font-bold">{formatCurrency(150)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-display font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </section>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex items-center space-x-3 text-primary">
                <MapPin className="w-5 h-5" />
                <h2 className="text-lg font-display font-bold">Delivery Address</h2>
              </div>
              <div className="text-sm opacity-60 leading-relaxed">
                {order.shippingAddress}
              </div>
            </section>
            <section className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex items-center space-x-3 text-primary">
                <CreditCard className="w-5 h-5" />
                <h2 className="text-lg font-display font-bold">Payment Info</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Method</span>
                  <span className="font-bold">Paystack</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Status</span>
                  <span className="font-bold text-green-600 uppercase tracking-widest text-[10px]">{order.paymentStatus}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Receipt Preview Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-border p-8 rounded-[2.5rem] shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Official Receipt</h2>
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            
            {/* Receipt Content (Hidden from normal view, used for PDF/Print) */}
            <div className="border border-border p-6 rounded-2xl bg-bg-cream/30 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/University_of_Nigeria_Nsukka_logo.png/220px-University_of_Nigeria_Nsukka_logo.png" alt="UNN" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>

              <div className="text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">UNN BookHub</div>
                <div className="text-sm font-display font-bold">Official Digital Receipt</div>
              </div>

              <div className="space-y-2 text-[10px] font-bold uppercase tracking-widest opacity-60 border-b border-border pb-4">
                <div className="flex justify-between">
                  <span>Receipt No:</span>
                  <span className="text-text-dark">{order.receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-text-dark">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="opacity-60 truncate max-w-[150px]">{item.title}</span>
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Total Paid</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>

              {/* Official Stamp */}
              <div className="flex justify-center pt-4">
                <div className="relative w-24 h-24 border-4 border-primary/30 rounded-full flex items-center justify-center rotate-12">
                  <div className="text-[8px] font-bold text-primary/40 text-center uppercase tracking-widest leading-tight">
                    UNN BOOKHUB<br/>OFFICIAL<br/>VERIFIED
                  </div>
                  <div className="absolute inset-0 border-2 border-primary/20 rounded-full m-1" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-bg-cream/50 p-4 rounded-2xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Verification Hash</div>
                <div className="text-[8px] font-mono break-all opacity-60">{stampHash}</div>
              </div>
              <Link 
                to={`/verify-receipt?id=${order.id}&hash=${stampHash}`}
                className="w-full bg-bg-cream hover:bg-primary hover:text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <span>Verify on Portal</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Receipt for jsPDF */}
      <div className="hidden">
        <div ref={receiptRef} className="w-[800px] p-20 bg-white space-y-12 text-text-dark">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/University_of_Nigeria_Nsukka_logo.png/220px-University_of_Nigeria_Nsukka_logo.png" alt="UNN Logo" className="h-24 w-24 object-contain" referrerPolicy="no-referrer" />
              <div className="space-y-1">
                <h1 className="text-4xl font-display font-bold">UNN BookHub</h1>
                <p className="text-lg opacity-60">University of Nigeria, Nsukka</p>
                <p className="text-sm opacity-40">Official Academic Bookstore & E-Library</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="bg-primary text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm inline-block">Official Receipt</div>
              <div className="text-sm opacity-60">Receipt ID: {order.receiptId}</div>
              <div className="text-sm opacity-60">Date: {formatDate(order.createdAt)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 border-y border-border py-12">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-40">Billed To</h2>
              <div className="space-y-1">
                <p className="text-xl font-bold">{user.fullName}</p>
                <p className="text-sm opacity-60">{user.email}</p>
                <p className="text-sm opacity-60">{user.department} • {user.level} Level</p>
                <p className="text-sm opacity-60">{user.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-40">Delivery Address</h2>
              <div className="space-y-1">
                <p className="text-sm opacity-60 leading-relaxed">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-4 text-xs font-bold uppercase tracking-widest opacity-40">Item Description</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest opacity-40 text-center">Qty</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest opacity-40 text-right">Price</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest opacity-40 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-6">
                    <div className="font-bold">{item.title}</div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.type}</div>
                  </td>
                  <td className="py-6 text-center font-bold">{item.quantity}</td>
                  <td className="py-6 text-right opacity-60">{formatCurrency(item.price)}</td>
                  <td className="py-6 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-start pt-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-widest opacity-40">Payment Details</h2>
                <p className="text-sm font-bold">Method: Paystack (Card)</p>
                <p className="text-sm font-bold text-green-600">Status: {order.paymentStatus.toUpperCase()}</p>
              </div>
              <div className="bg-bg-cream p-6 rounded-2xl space-y-2 w-64">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Verification Hash</div>
                <div className="text-[8px] font-mono break-all opacity-60 leading-relaxed">{stampHash}</div>
              </div>
            </div>
            <div className="w-80 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span className="font-bold">{formatCurrency(order.totalAmount - 150)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Processing Fee</span>
                <span className="font-bold">{formatCurrency(150)}</span>
              </div>
              <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                <span className="text-xl font-display font-bold">Total Paid</span>
                <span className="text-3xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="pt-20 flex justify-between items-end">
            <div className="space-y-2">
              <div className="w-48 h-px bg-border" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Authorized Signature</p>
            </div>
            <div className="relative w-40 h-40 border-8 border-primary/10 rounded-full flex items-center justify-center rotate-12">
              <div className="text-xs font-bold text-primary/20 text-center uppercase tracking-[0.2em] leading-tight">
                UNN BOOKHUB<br/>OFFICIAL<br/>DIGITAL STAMP
              </div>
              <div className="absolute inset-0 border-4 border-primary/5 rounded-full m-2" />
            </div>
          </div>

          <div className="text-center pt-20 text-[10px] opacity-40 font-bold uppercase tracking-[0.3em]">
            This is a computer generated receipt. No physical signature required.
          </div>
        </div>
      </div>
    </div>
  );
}

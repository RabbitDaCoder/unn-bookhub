import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore, useAuthStore } from "../store/useStore";
import { createOrder } from "../supabase";
import { useToast } from "../context/ToastContext";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    hostel: "",
    room: "",
    phone: "",
    notes: "",
  });

  const totalAmount = items.reduce((a, i) => a + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setLoading(true);
    try {
      await createOrder({
        userId: user.id,
        items: items.map((i) => ({
          id: i.id,
          title: i.title,
          courseCode: i.courseCode,
          author: i.author,
          price: i.price,
          quantity: i.quantity,
          coverColor: i.coverColor,
        })),
        totalAmount,
        status: "pending",
        shippingAddress: `${form.hostel}, Room ${form.room}`,
        paymentMethod: "pay-on-delivery",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      clearCart();
      toast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (err: any) {
      toast(err.message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-1">Checkout</h1>
          <p className="text-white/40 text-sm">Confirm your delivery details</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8">
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7"
          >
            <h2 className="text-lg font-bold text-white mb-6">
              Delivery Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                  Hostel / Location
                </label>
                <input
                  type="text"
                  value={form.hostel}
                  onChange={(e) => setForm({ ...form, hostel: e.target.value })}
                  required
                  placeholder="e.g. Akpabio Hall"
                  className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                  Room Number
                </label>
                <input
                  type="text"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  required
                  placeholder="e.g. B204"
                  className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                WhatsApp / Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                placeholder="+234..."
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Any special instructions..."
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              />
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <p className="text-amber-400 text-sm font-bold mb-1">
                💳 Payment: Pay on Delivery
              </p>
              <p className="text-white/40 text-xs">
                You'll pay when we deliver your books. No online payment needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 text-ink-900 font-extrabold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200 disabled:opacity-60"
            >
              {loading
                ? "Placing order..."
                : `Place Order · ₦${totalAmount.toLocaleString()}`}
            </button>
          </form>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Order Summary</h3>
              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/60 truncate max-w-[180px]">
                      {item.title} ×{item.quantity}
                    </span>
                    <span className="text-white font-semibold">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-amber-500 font-extrabold">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

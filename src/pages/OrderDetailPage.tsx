import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { getOrderById } from "../supabase";
import type { Order } from "../types";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      getOrderById(id)
        .then((o) => {
          setOrder(o);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, id]);

  if (loading)
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center text-white/30">
        Loading...
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-white text-xl font-bold mb-2">Order not found</p>
          <Link to="/orders" className="text-amber-500 font-semibold text-sm">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link
            to="/orders"
            className="text-white/40 hover:text-white text-sm mb-3 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-extrabold text-white">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
        {/* Status */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-1">
                Status
              </p>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  order.status === "delivered"
                    ? "bg-green-500/15 text-green-400"
                    : order.status === "pending"
                      ? "bg-yellow-500/15 text-yellow-400"
                      : order.status === "processing"
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-red-500/15 text-red-400"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-1">
                Total
              </p>
              <p className="text-amber-500 text-2xl font-extrabold">
                ₦{order.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">
            Items ({order.items.length})
          </h3>
          <div className="divide-y divide-white/[0.06]">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="text-white text-sm font-semibold">
                    {item.title}
                  </p>
                  <p className="text-white/40 text-xs">
                    {item.courseCode} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-white font-bold text-sm">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Delivery Details</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40 text-xs font-bold uppercase mb-1">
                Address
              </p>
              <p className="text-white">{order.shippingAddress || "—"}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase mb-1">
                Payment
              </p>
              <p className="text-white">
                {order.paymentMethod || "Pay on Delivery"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { getUserOrders } from "../supabase";
import type { Order } from "../types";

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserOrders(user.id)
        .then((o) => {
          setOrders(o);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-1">My Orders</h1>
          <p className="text-white/40 text-sm">
            Track and manage your book orders
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8">
        {loading ? (
          <div className="text-center py-20 text-white/30">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-white text-xl font-bold mb-2">No orders yet</p>
            <p className="text-white/40 mb-6 text-sm">
              Your order history will appear here
            </p>
            <Link
              to="/books"
              className="inline-flex px-7 py-3.5 rounded-full bg-amber-500 text-ink-900 font-bold shadow-amber hover:bg-amber-600 transition-all duration-200"
            >
              Browse Bookstore →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="bg-ink-700 border border-white/[0.06] rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-bold group-hover:text-amber-500 transition-colors">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-500/15 text-green-400"
                        : order.status === "pending"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : order.status === "processing"
                            ? "bg-blue-500/15 text-blue-400"
                            : order.status === "cancelled"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-white/10 text-white/50"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/50 text-sm">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-amber-500 font-extrabold">
                    ₦{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

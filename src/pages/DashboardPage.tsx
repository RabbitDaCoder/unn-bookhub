import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { getUserOrders } from "../supabase";
import type { Order } from "../types";

export default function DashboardPage() {
  const { user, userProfile } = useAuthStore();
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

  const recentOrders = orders.slice(0, 5);
  const totalSpent = orders.reduce((a, o) => a + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-1">
            Welcome back,{" "}
            <span className="text-amber-500">
              {user?.user_metadata?.full_name?.split(" ")[0] || "Student"}
            </span>{" "}
            👋
          </h1>
          <p className="text-white/40 text-sm">Here's your activity overview</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: "📦",
              color: "amber",
            },
            {
              label: "Total Spent",
              value: `₦${totalSpent.toLocaleString()}`,
              icon: "💰",
              color: "green",
            },
            {
              label: "Pending",
              value: pendingOrders,
              icon: "⏳",
              color: "yellow",
            },
            {
              label: "Delivered",
              value: orders.filter((o) => o.status === "delivered").length,
              icon: "✅",
              color: "green",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-ink-700 border border-white/[0.06] rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-white/40 text-xs font-bold uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <p className="text-white text-2xl font-extrabold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              to: "/books",
              label: "Browse Books",
              icon: "📚",
              desc: "Find your course materials",
            },
            {
              to: "/orders",
              label: "My Orders",
              icon: "📋",
              desc: "Track order status",
            },
            {
              to: "/library",
              label: "E-Library",
              icon: "📖",
              desc: "Read & listen",
            },
            {
              to: "/complaints",
              label: "Complaints",
              icon: "💬",
              desc: "Get help with issues",
            },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-ink-700 border border-white/[0.06] rounded-2xl p-5 hover:border-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span className="text-2xl mb-3 block">{action.icon}</span>
              <p className="text-white font-bold text-sm group-hover:text-amber-500 transition-colors">
                {action.label}
              </p>
              <p className="text-white/40 text-xs mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-amber-500 text-sm font-bold hover:text-amber-400"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-white/30 text-sm">
              Loading...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/30 text-sm">No orders yet</p>
              <Link
                to="/books"
                className="text-amber-500 text-sm font-bold mt-2 inline-block"
              >
                Browse books →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between py-4 hover:bg-white/[0.02] -mx-3 px-3 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">
                      ₦{order.totalAmount.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-500/15 text-green-400"
                          : order.status === "pending"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : order.status === "processing"
                              ? "bg-blue-500/15 text-blue-400"
                              : "bg-white/10 text-white/50"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

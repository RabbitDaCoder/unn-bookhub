import { Link } from "react-router-dom";
import {
  BookOpen,
  ShoppingCart,
  FileText,
  MessageSquare,
  ArrowRightCircle,
} from "lucide-react";
import { useAuthStore, useCartStore } from "../store/useStore";
import { formatCurrency } from "../lib/utils";

const activityFeed = [
  {
    title: "New order placed",
    details:
      "Your book order has been confirmed and is being prepared for delivery.",
    time: "Today",
  },
  {
    title: "Wishlist updated",
    details: "Math and science titles were added to your saved books.",
    time: "Yesterday",
  },
  {
    title: "Profile updated",
    details: "Your department and level were saved successfully.",
    time: "2 days ago",
  },
];

export default function DashboardPage() {
  const userProfile = useAuthStore((state) => state.userProfile);
  const cart = useCartStore();

  const stats = [
    {
      label: "Books in Cart",
      value: cart.totalItems,
      icon: BookOpen,
      accent: "bg-emerald-500/10 text-emerald-300",
    },
    {
      label: "Active Orders",
      value:
        cart.totalItems > 0
          ? Math.min(3, Math.max(1, Math.ceil(cart.totalItems / 2)))
          : 0,
      icon: ShoppingCart,
      accent: "bg-sky-500/10 text-sky-300",
    },
    {
      label: "Estimated Total",
      value: formatCurrency(cart.totalAmount || 0),
      icon: FileText,
      accent: "bg-violet-500/10 text-violet-300",
    },
    {
      label: "Support Requests",
      value: 1,
      icon: MessageSquare,
      accent: "bg-amber-500/10 text-amber-300",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                Welcome back,
                <span className="text-emerald-300">
                  {" "}
                  {userProfile?.fullName ?? "Student"}
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                Keep track of your orders, saved books, and account activity
                from one place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:w-[420px]">
              <Link
                to="/books"
                className="rounded-3xl border border-white/10 bg-emerald-500/10 p-5 text-left transition hover:bg-emerald-500/15"
              >
                <div className="flex items-center gap-3 text-emerald-300">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">Browse books</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Continue shopping and add more titles to your cart.
                </p>
              </Link>
              <Link
                to="/profile"
                className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-left transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3 text-sky-300">
                  <ArrowRightCircle className="h-5 w-5" />
                  <span className="font-semibold">View profile</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Review your account, contact details, and student information.
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${item.accent}`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm uppercase tracking-[0.3em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Recent activity
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Your latest actions across the platform.
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                  Live
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {activityFeed.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.details}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white">
                Student overview
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-slate-400">Name</p>
                  <p className="mt-2 font-semibold text-white">
                    {userProfile?.fullName ?? "Student"}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-slate-400">Email</p>
                  <p className="mt-2 font-semibold text-white">
                    {userProfile?.email ?? "—"}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-slate-400">Department</p>
                  <p className="mt-2 font-semibold text-white">
                    {userProfile?.department ?? "—"}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-slate-400">Level</p>
                  <p className="mt-2 font-semibold text-white">
                    {userProfile?.level ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

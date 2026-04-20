import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { getUserComplaints } from "../supabase";
import type { Complaint } from "../types";

export default function ComplaintsPage() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserComplaints(user.id)
        .then((c) => {
          setComplaints(c);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              Complaints
            </h1>
            <p className="text-white/40 text-sm">Track your support tickets</p>
          </div>
          <Link
            to="/complaints/new"
            className="px-5 py-2.5 rounded-full bg-amber-500 text-ink-900 font-bold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200"
          >
            + New Complaint
          </Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8">
        {loading ? (
          <div className="text-center py-20 text-white/30">Loading...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-white text-xl font-bold mb-2">No complaints</p>
            <p className="text-white/40 text-sm mb-6">
              Need help? File a complaint and we'll respond quickly.
            </p>
            <Link
              to="/complaints/new"
              className="inline-flex px-7 py-3.5 rounded-full bg-amber-500 text-ink-900 font-bold shadow-amber hover:bg-amber-600 transition-all duration-200"
            >
              File Complaint →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {complaints.map((c) => (
              <Link
                key={c.id}
                to={`/complaints/${c.id}`}
                className="bg-ink-700 border border-white/[0.06] rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-bold text-sm group-hover:text-amber-500 transition-colors">
                    {c.subject}
                  </p>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      c.status === "resolved"
                        ? "bg-green-500/15 text-green-400"
                        : c.status === "open"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-blue-500/15 text-blue-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-white/40 text-xs">
                  {c.category} · {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

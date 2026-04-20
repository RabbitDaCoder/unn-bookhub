import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { createComplaint } from "../supabase";
import { useToast } from "../context/ToastContext";

const CATEGORIES = [
  "Order Issue",
  "Delivery Problem",
  "Wrong Book",
  "Refund Request",
  "Account Issue",
  "Other",
];

export default function NewComplaintPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await createComplaint({
        userId: user.id,
        userEmail: user.email || "",
        userName: user.user_metadata?.full_name || "",
        subject: form.subject,
        category: form.category,
        description: form.description,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast("Complaint submitted!", "success");
      navigate("/complaints");
    } catch (err: any) {
      toast(err.message || "Failed to submit", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-1">
            New Complaint
          </h1>
          <p className="text-white/40 text-sm">
            Describe your issue and we'll help resolve it
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 lg:px-12 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7"
        >
          <div className="mb-4">
            <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              placeholder="Brief summary of the issue"
              className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div className="mb-4">
            <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              rows={6}
              placeholder="Provide full details about your issue..."
              className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-ink-900 font-extrabold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

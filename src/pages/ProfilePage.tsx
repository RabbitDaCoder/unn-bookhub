import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useStore";
import { updateUserProfile, fetchUserProfile } from "../supabase";
import { useToast } from "../context/ToastContext";
import { FACULTIES, DEPARTMENTS, LEVELS } from "../constants";

export default function ProfilePage() {
  const { user, userProfile, setUserProfile } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    faculty: "",
    department: "",
    level: "",
  });

  useEffect(() => {
    if (userProfile) {
      setForm({
        fullName: userProfile.fullName || "",
        phone: userProfile.phone || "",
        faculty: userProfile.faculty || "",
        department: userProfile.department || "",
        level: userProfile.level || "",
      });
    }
  }, [userProfile]);

  const departments = form.faculty ? DEPARTMENTS[form.faculty] || [] : [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(user.id, form);
      const updated = await fetchUserProfile(user.id);
      if (updated) setUserProfile(updated);
      toast("Profile updated!", "success");
    } catch (err: any) {
      toast(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-1">
            My Profile
          </h1>
          <p className="text-white/40 text-sm">
            Manage your account information
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 lg:px-12 py-10">
        {/* Avatar + info */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-ink-900 text-2xl font-black flex-shrink-0">
            {user?.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-white text-lg font-bold">
              {user?.user_metadata?.full_name || "Student"}
            </p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            {userProfile?.role && (
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">
                {userProfile.role}
              </span>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7"
        >
          <h2 className="text-lg font-bold text-white mb-6">Edit Profile</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+234..."
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Faculty
              </label>
              <select
                value={form.faculty}
                onChange={(e) => {
                  update("faculty", e.target.value);
                  update("department", "");
                }}
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="">Select faculty</option>
                {FACULTIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                disabled={!form.faculty}
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Level
              </label>
              <select
                value={form.level}
                onChange={(e) => update("level", e.target.value)}
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="">Select level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-full bg-amber-500 text-ink-900 font-bold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

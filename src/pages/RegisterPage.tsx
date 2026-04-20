import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail } from "../supabase";
import { useToast } from "../context/ToastContext";
import { Logo } from "../components/Logo";
import { FACULTIES, DEPARTMENTS, LEVELS } from "../constants";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    faculty: "",
    department: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const departments = form.faculty ? DEPARTMENTS[form.faculty] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    if (form.password.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(form.email, form.password, form.fullName, {
        phone: form.phone,
        faculty: form.faculty,
        department: form.department,
        level: form.level,
      });
      navigate("/register/success");
    } catch (err: any) {
      toast(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Create an account
          </h1>
          <p className="text-white/40 text-sm">Join UNN BookHub — it's free</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                required
                placeholder="Chukwuemeka Obi"
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                placeholder="your.email@unn.edu.ng"
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+234 XXX XXX XXXX"
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
            className="w-full py-3.5 rounded-xl bg-amber-500 text-ink-900 font-extrabold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200 disabled:opacity-60 mt-4"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-500 font-bold hover:text-amber-400"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

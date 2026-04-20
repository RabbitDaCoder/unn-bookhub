import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail } from "../supabase";
import { useToast } from "../context/ToastContext";
import { Logo } from "../components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast("Welcome back!", "success");
      navigate("/dashboard");
    } catch (err: any) {
      toast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Welcome back
          </h1>
          <p className="text-white/40 text-sm">
            Sign in to your UNN BookHub account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7"
        >
          <div className="mb-4">
            <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@unn.edu.ng"
              className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-amber-500/50 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-sm"
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-ink-900 font-extrabold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-500 font-bold hover:text-amber-400"
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}

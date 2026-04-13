import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { loginWithEmail, fetchUserProfile } from "../firebase";
import { User } from "../types";
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import Spinner from "../components/ui/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const credential = await loginWithEmail(email, password);
      const profile = await fetchUserProfile(credential.user.uid);
      if (!profile) {
        setError("User profile not found. Please register.");
      } else {
        setUser(profile as User);
        navigate(fromPath, { replace: true });
      }
    } catch (err: any) {
      setError(
        err.code === "auth/wrong-password"
          ? "Incorrect password."
          : err.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.3),_transparent_35%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-3 text-white shadow-lg shadow-black/20"
          >
            <span className="text-xl">📚</span>
            <span className="ml-3 text-lg font-bold">UNN BookHub</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="text-sm text-slate-300">
              Log in to continue browsing course books and placing orders.
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@unn.edu.ng"
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>Password</span>
                <Link
                  to="/forgot-password"
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <span>Log In</span>
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-white hover:text-emerald-300"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

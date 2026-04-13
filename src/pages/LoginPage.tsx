import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/useStore";
import { loginWithEmail, fetchUserProfile } from "../firebase";
import { useToast } from "../components/ui/ToastContext";
import Spinner from "../components/ui/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname || "/dashboard";
  const { pushToast } = useToast();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await loginWithEmail(email, password);
      const profile = await fetchUserProfile(credential.user.uid);

      if (!profile) {
        setError("User profile not found. Please register first.");
        return;
      }

      setUser(profile as any);
      pushToast({
        title: "Welcome back",
        message: "You have successfully signed in.",
        variant: "success",
      });
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      const message =
        err.code === "auth/wrong-password"
          ? "Incorrect password."
          : err.code === "auth/user-not-found"
            ? "No account found with this email."
            : err.message || "Login failed. Please try again.";
      setError(message);
      pushToast({
        title: "Login failed",
        message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.2fr_1fr]">
        <div className="relative px-8 py-12 sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                Secure email login only
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  UNN BookHub
                </p>
                <h1 className="text-5xl font-bold tracking-tight text-white">
                  Continue with your student account
                </h1>
                <p className="max-w-xl text-base leading-8 text-slate-300">
                  Log in to access course materials, track your order history,
                  and keep your student profile up to date.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Fast checkout
                  </p>
                  <p className="mt-3 text-white">
                    Save your favourite books and complete checkout in seconds.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Verified UNN students
                  </p>
                  <p className="mt-3 text-white">
                    Only email/password is required for secure campus access.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
              <div className="flex items-center gap-3 text-slate-300">
                <Sparkles className="h-5 w-5 text-emerald-300" />
                <span className="text-sm uppercase tracking-[0.3em]">
                  Student login perks
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-slate-400">
                <li>• Choose books from your course list</li>
                <li>• Track orders and delivery details</li>
                <li>• Manage your profile and contact details</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative px-8 py-12 sm:px-12 lg:px-16">
          <div className="relative z-10 mx-auto max-w-md">
            <div className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Sign in
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Welcome back.
                </h2>
                <p className="mt-3 text-sm text-slate-400">
                  Use your UNN email and password to access your dashboard.
                </p>
              </div>

              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 opacity-70"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                  G
                </span>
                Continue with Google
              </button>

              <div className="relative py-3 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
                <span className="bg-slate-900 px-3">Email login only</span>
              </div>

              {error && (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Student email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="student@unn.edu.ng"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  <span>Log in</span>
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-white hover:text-emerald-300"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

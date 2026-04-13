import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { registerWithEmail, saveUserProfile } from "../firebase";
import { User } from "../types";
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  School,
  GraduationCap,
  Phone,
} from "lucide-react";
import { FACULTIES, DEPARTMENTS } from "../constants";
import { motion } from "motion/react";
import Spinner from "../components/ui/Spinner";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [fullName, setFullName] = useState(location.state?.fullName || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [faculty, setFaculty] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [level, setLevel] = useState<string>("100");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!faculty || !department) {
      setError("Please select your faculty and department.");
      setLoading(false);
      return;
    }

    try {
      const authResult = await registerWithEmail(email, password);
      const profile = await saveUserProfile(
        {
          uid: authResult.user.uid,
          displayName: fullName,
          email,
        } as any,
        {
          role: "student",
          phone,
          faculty,
          department,
          level,
        },
      );

      setUser(profile as User);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : err.message || "Registration failed. Please try again.",
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
        className="relative z-10 w-full max-w-3xl space-y-8"
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
            <h1 className="text-4xl font-bold">Create your student account</h1>
            <p className="text-sm text-slate-300">
              Register to start ordering UNN course books and get doorstep
              delivery.
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

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Obi"
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Email
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
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Password
                </label>
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

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Faculty
                </label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <select
                    required
                    value={faculty}
                    onChange={(e) => {
                      setFaculty(e.target.value);
                      setDepartment("");
                    }}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400 appearance-none"
                  >
                    <option value="" className="bg-slate-950 text-white">
                      Select Faculty
                    </option>
                    {FACULTIES.map((f) => (
                      <option
                        key={f}
                        value={f}
                        className="bg-slate-950 text-white"
                      >
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <select
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={!faculty}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="" className="bg-slate-950 text-white">
                      Select Department
                    </option>
                    {faculty &&
                      DEPARTMENTS[faculty as keyof typeof DEPARTMENTS]?.map(
                        (d) => (
                          <option
                            key={d}
                            value={d}
                            className="bg-slate-950 text-white"
                          >
                            {d}
                          </option>
                        ),
                      )}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Level
                </label>
                <select
                  required
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400 appearance-none"
                >
                  {[
                    "100",
                    "200",
                    "300",
                    "400",
                    "500",
                    "600",
                    "Postgraduate",
                  ].map((lvl) => (
                    <option
                      key={lvl}
                      value={lvl}
                      className="bg-slate-950 text-white"
                    >
                      {lvl} Level
                    </option>
                  ))}
                </select>
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
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-emerald-300"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

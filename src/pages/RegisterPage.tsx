import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  School,
  GraduationCap,
  Phone,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../store/useStore";
import { registerWithEmail, saveUserProfile } from "../firebase";
import { FACULTIES, DEPARTMENTS } from "../constants";
import { useToast } from "../components/ui/ToastContext";
import Spinner from "../components/ui/Spinner";

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    email?: string;
    fullName?: string;
  } | null;
  const [fullName, setFullName] = useState(locationState?.fullName || "");
  const [email, setEmail] = useState(locationState?.email || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [faculty, setFaculty] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [level, setLevel] = useState<string>("100");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { pushToast } = useToast();

  const isFormValid = faculty && department;

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please select your faculty and department.");
      return;
    }

    setLoading(true);

    try {
      const credential = await registerWithEmail(email, password);
      const profile = await saveUserProfile(
        { uid: credential.user.uid, displayName: fullName, email } as any,
        { role: "student", phone, faculty, department, level },
      );

      setUser(profile as any);
      pushToast({
        title: "Registration complete",
        message: "Your UNN BookHub account has been created.",
        variant: "success",
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const message =
        err.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : err.message || "Registration failed. Please try again.";
      setError(message);
      pushToast({ title: "Registration failed", message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.2fr_1fr]">
        <div className="relative px-8 py-12 sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),_transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
                <ShieldCheck className="h-4 w-4" />
                Safe university signup
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  UNN BookHub
                </p>
                <h1 className="text-5xl font-bold tracking-tight text-white">
                  Create your student account
                </h1>
                <p className="max-w-xl text-base leading-8 text-slate-300">
                  Register with your UNN details and start ordering course books
                  in a secure portal.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Verified campus access
                  </p>
                  <p className="mt-3 text-white">
                    Only email/password is needed to protect your student data.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Book selection
                  </p>
                  <p className="mt-3 text-white">
                    Access official course books and university-approved
                    references.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
              <div className="flex items-center gap-3 text-slate-300">
                <Sparkles className="h-5 w-5 text-sky-300" />
                <span className="text-sm uppercase tracking-[0.3em]">
                  Start ordering faster
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-slate-400">
                <li>• Save your student details securely</li>
                <li>• Match books to your department and level</li>
                <li>• Receive email updates for orders and support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative px-8 py-12 sm:px-12 lg:px-16">
          <div className="relative z-10 mx-auto max-w-md">
            <div className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Create account
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Sign up for BookHub
                </h2>
                <p className="mt-3 text-sm text-slate-400">
                  Enter your details to register and start browsing UNN course
                  books.
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
                <span className="bg-slate-900 px-3">
                  Email registration only
                </span>
              </div>

              {error && (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Full name
                    </label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="John Obi"
                        className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="student@unn.edu.ng"
                        className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-sky-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="08012345678"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-sky-400"
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
                      className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Faculty
                    </label>
                    <div className="relative">
                      <School className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <select
                        required
                        value={faculty}
                        onChange={(event) => {
                          setFaculty(event.target.value);
                          setDepartment("");
                        }}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-sky-400 appearance-none"
                      >
                        <option value="" className="bg-slate-950 text-white">
                          Select faculty
                        </option>
                        {FACULTIES.map((facultyOption) => (
                          <option
                            key={facultyOption}
                            value={facultyOption}
                            className="bg-slate-950 text-white"
                          >
                            {facultyOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Department
                    </label>
                    <div className="relative">
                      <GraduationCap className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <select
                        required
                        value={department}
                        onChange={(event) => setDepartment(event.target.value)}
                        disabled={!faculty}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950 px-12 py-3 text-white outline-none transition focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      >
                        <option value="" className="bg-slate-950 text-white">
                          Select department
                        </option>
                        {faculty &&
                          DEPARTMENTS[faculty as keyof typeof DEPARTMENTS]?.map(
                            (dept) => (
                              <option
                                key={dept}
                                value={dept}
                                className="bg-slate-950 text-white"
                              >
                                {dept}
                              </option>
                            ),
                          )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Level
                  </label>
                  <select
                    required
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400 appearance-none"
                  >
                    {[
                      "100",
                      "200",
                      "300",
                      "400",
                      "500",
                      "600",
                      "Postgraduate",
                    ].map((levelOption) => (
                      <option
                        key={levelOption}
                        value={levelOption}
                        className="bg-slate-950 text-white"
                      >
                        {levelOption} Level
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  <span>Create account</span>
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-white hover:text-sky-300"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

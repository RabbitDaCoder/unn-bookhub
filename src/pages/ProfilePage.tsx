import { useAuthStore } from "../store/useStore";
import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  BookOpen,
  MapPin,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const userProfile = useAuthStore((state) => state.userProfile);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Profile
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                Student profile summary
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                Your UNN BookHub account details are shown here. Keep your
                email, faculty, and department information accurate for a better
                campus book ordering experience.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center gap-3 text-emerald-300">
                  <User className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Full name
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {userProfile?.fullName ?? "Student Name"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Email
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {userProfile?.email ?? "you@unn.edu.ng"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center gap-3 text-sky-300">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Department
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {userProfile?.department ?? "Not set"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center gap-3 text-amber-300">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Faculty
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {userProfile?.faculty ?? "Not specified"}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Account status
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {userProfile?.role === "admin" ? "Admin" : "Student"}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified student
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Level</p>
                  <p className="mt-2 font-semibold text-white">
                    {userProfile?.level ?? "100"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="mt-2 font-semibold text-white">
                    {userProfile?.phone ?? "Not added"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-emerald-500/10 p-4 text-emerald-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Quick summary
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Safe and simple
                </h2>
                <p className="mt-4 text-slate-400">
                  Your UNN BookHub profile stores only the information needed
                  for orders, delivery, and student verification.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                Keep your student email and department details updated for
                accurate course book recommendations.
              </p>
              <p className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                If you need help, visit the support section or submit a
                complaint through the dashboard.
              </p>
              <p className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                The profile page is the best place to confirm your student
                details before placing an order.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

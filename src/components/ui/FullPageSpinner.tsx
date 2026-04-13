import Spinner from "./Spinner";

export default function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl">
        <Spinner size="lg" />
        <p className="text-sm text-slate-300">Loading your page...</p>
      </div>
    </div>
  );
}

import { Spinner } from "./Spinner";

export function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-white/40 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

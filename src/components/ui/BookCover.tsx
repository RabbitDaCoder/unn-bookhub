import { cn } from "../../lib/utils";

interface BookCoverProps {
  title: string;
  courseCode: string;
  coverColor: string;
  featured?: boolean;
  className?: string;
}

export default function BookCover({
  title,
  courseCode,
  coverColor,
  featured,
  className,
}: BookCoverProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/10",
        className,
      )}
      style={{ backgroundColor: coverColor }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/30" />
      <div className="p-6 flex flex-col justify-between h-full text-white">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] font-semibold">
            {courseCode}
          </div>
          <div className="text-sm leading-tight font-bold text-white line-clamp-4">
            {title}
          </div>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.3em] opacity-90">
          UNN BookHub
        </div>
      </div>
      {featured && (
        <span className="absolute top-4 left-4 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.24em]">
          Featured
        </span>
      )}
    </div>
  );
}

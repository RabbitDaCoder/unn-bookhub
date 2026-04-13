import { type ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white text-3xl">
        {icon}
      </div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="max-w-xl mx-auto opacity-70 mb-8">{description}</p>
      {action}
    </div>
  );
}

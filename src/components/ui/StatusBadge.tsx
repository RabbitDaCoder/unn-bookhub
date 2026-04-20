interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending: {
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "text-yellow-400",
      label: "Pending",
    },
    processing: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      label: "Processing",
    },
    confirmed: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      label: "Confirmed",
    },
    completed: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      label: "Completed",
    },
    delivered: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      label: "Delivered",
    },
    cancelled: {
      bg: "bg-red-500/10 border-red-500/20",
      text: "text-red-400",
      label: "Cancelled",
    },
    open: {
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "text-yellow-400",
      label: "Open",
    },
    in_progress: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      label: "Investigating",
    },
    resolved: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      label: "Resolved",
    },
    closed: {
      bg: "bg-white/10 border-white/10",
      text: "text-white/50",
      label: "Closed",
    },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

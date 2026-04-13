interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-[3px]",
  md: "w-6 h-6 border-4",
  lg: "w-10 h-10 border-4",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={`inline-block rounded-full border-white/20 border-t-white animate-spin ${sizeMap[size]} ${className ?? ""}`}
    />
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showSub?: boolean;
}

export function Logo({
  size = "md",
  showText = true,
  showSub = false,
}: LogoProps) {
  const dims = { sm: 32, md: 40, lg: 56 };
  const d = dims[size];
  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2.5">
      <svg width={d} height={d} viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="35" rx="14" ry="3" fill="rgba(245,158,11,0.15)" />
        <path d="M20 8 L6 12.5 L6 31 L20 27.5 Z" fill="rgba(255,255,255,0.8)" />
        <path
          d="M20 8 L34 12.5 L34 31 L20 27.5 Z"
          fill="rgba(255,255,255,0.95)"
        />
        <rect x="18.5" y="7" width="3" height="22.5" rx="1.5" fill="#f59e0b" />
        <line
          x1="9"
          y1="17"
          x2="17"
          y2="15.5"
          stroke="rgba(245,158,11,0.5)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="20.5"
          x2="17"
          y2="19"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="24"
          x2="15"
          y2="22.8"
          stroke="rgba(245,158,11,0.2)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="23"
          y1="15.5"
          x2="31"
          y2="17"
          stroke="rgba(245,158,11,0.5)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="23"
          y1="19"
          x2="31"
          y2="20.5"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="22.8"
          x2="31"
          y2="24"
          stroke="rgba(245,158,11,0.2)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M20 4.5 L20.7 2.5 L21.3 4.5 L23 4 L21.7 5.3 L23 6.5 L21 6 L20 7.5 L19 6 L17 6.5 L18.3 5.3 L17 4 L18.7 4.5 L19.3 2.5 Z"
          fill="#f59e0b"
        />
      </svg>
      {showText && (
        <div className="leading-tight">
          <div
            className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}
          >
            UNN <span className="text-amber-500">BookHub</span>
          </div>
          {showSub && (
            <div className="text-[10px] text-white/40 font-medium tracking-wide mt-0.5">
              University of Nigeria, Nsukka
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;

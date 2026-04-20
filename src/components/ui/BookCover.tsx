interface BookCoverProps {
  courseCode: string;
  title: string;
  color: string;
  author?: string;
  size?: "xs" | "sm" | "md" | "lg" | "hero";
}

export function BookCover({
  courseCode,
  title,
  color,
  author,
  size = "md",
}: BookCoverProps) {
  const sizes = {
    xs: { w: 48, h: 68, code: 7, title: 6, spine: 4 },
    sm: { w: 72, h: 100, code: 9, title: 7.5, spine: 5 },
    md: { w: 130, h: 182, code: 11, title: 9, spine: 7 },
    lg: { w: 200, h: 280, code: 15, title: 12, spine: 10 },
    hero: { w: 260, h: 364, code: 18, title: 14, spine: 13 },
  };
  const s = sizes[size];

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  const c = hexToRgb(color.startsWith("#") ? color : "#1a56db");
  const darkColor = `rgb(${Math.max(0, c.r - 50)},${Math.max(0, c.g - 50)},${Math.max(0, c.b - 50)})`;

  return (
    <div
      style={{
        width: s.w,
        height: s.h,
        flexShrink: 0,
        borderRadius: "2px 8px 8px 2px",
        background: `linear-gradient(160deg, ${color} 0%, ${darkColor} 100%)`,
        position: "relative",
        overflow: "hidden",
        boxShadow: "-3px 4px 16px rgba(0,0,0,0.5), 2px 0 6px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${s.spine + 6}px 8px 8px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: s.spine,
          background: "rgba(0,0,0,0.28)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: s.spine,
          right: 0,
          height: "22%",
          background: "rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "25%",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.06))",
        }}
      />
      {[0.35, 0.65].map((y, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${y * 100}%`,
            left: s.spine + 4,
            right: 4,
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />
      ))}
      <span
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: s.code,
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          fontFamily: '"JetBrains Mono", monospace',
          marginBottom: 8,
          zIndex: 1,
          textAlign: "center",
          position: "relative",
        }}
      >
        {courseCode}
      </span>
      <span
        style={{
          color: "#fff",
          fontSize: s.title,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
          zIndex: 1,
          position: "relative",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          padding: "0 2px",
        }}
      >
        {title}
      </span>
      {author && (
        <span
          style={{
            position: "absolute",
            bottom: 8,
            left: s.spine + 6,
            right: 6,
            color: "rgba(255,255,255,0.4)",
            fontSize: s.code * 0.75,
            fontWeight: 500,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {author}
        </span>
      )}
    </div>
  );
}

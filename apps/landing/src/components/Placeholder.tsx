import Image from "next/image";

export function Placeholder({
  label,
  brief,
  aspect = "4/5",
  className = "",
  src,
  priority = false,
  sizes = "(max-width: 960px) 90vw, 440px",
}: {
  label: string;
  brief: string;
  aspect?: string;
  className?: string;
  /** When set, renders a real photo (next/image) instead of the striped placeholder. */
  src?: string;
  priority?: boolean;
  sizes?: string;
}) {
  // Real photo: fill the rounded/clipped `.ph` box. Interim Unsplash imagery —
  // replace with owned photography later (brief kept as alt text).
  if (src) {
    return (
      <div className={`ph shot ${className}`} style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={brief}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  // Fallback: striped box + monospace brief (no network).
  return (
    <div
      className={`ph shot ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`${label}: ${brief}`}
    >
      <div className="ph-l">
        <span className="t">{label}</span>
        <span className="d">{brief}</span>
      </div>
      {/* TODO: fotos reales — swap for owned photography when assets land */}
    </div>
  );
}

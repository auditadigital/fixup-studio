export function Placeholder({
  label,
  brief,
  aspect = "4/5",
  className = "",
}: {
  label: string;
  brief: string;
  aspect?: string;
  className?: string;
}) {
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
      {/* TODO: fotos reales — swap for next/image when assets land */}
    </div>
  );
}

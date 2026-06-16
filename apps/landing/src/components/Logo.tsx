export function Logo({
  size = 34,
  fill = "var(--accent)",
  stroke = "#FFF7F0",
}: {
  size?: number;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="32" height="32" rx="9" fill={fill} />
      <path
        d="M10.5 17.5l4 4 9-10.5"
        stroke={stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

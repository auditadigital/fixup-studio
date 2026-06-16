import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icon = {
  search: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  pin: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  insta: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  chat: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M21 11.5c0 4-4 7-9 7a10 10 0 01-3-.5L4 20l1.2-3.3A6.5 6.5 0 013 11.5C3 7.5 7 4.5 12 4.5s9 3 9 7z" />
    </svg>
  ),
  eye: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  heart: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  ),
  repeat: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} {...stroke} {...p}>
      <path d="M5 12.5l4.5 4.5L19 6.5" />
    </svg>
  ),
  x: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} {...stroke} {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  plus: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  phone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.5a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  spark: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  ),
  user: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0116 0" />
    </svg>
  ),
  alert: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  ghost: (p: IconProps) => (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...stroke} {...p}>
      <path d="M5 21V10a7 7 0 0114 0v11l-3-2-2 2-2-2-2 2-2-2z" />
      <path d="M9 11h.01M15 11h.01" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;

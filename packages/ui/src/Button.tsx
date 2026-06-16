import * as React from "react";

type Variant = "coral" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  coral: "bg-coral text-white hover:bg-coral-600 active:bg-coral-press",
  secondary: "bg-surface text-ink border border-line-2 hover:bg-cream",
  ghost: "bg-transparent text-ink-2 hover:bg-cream",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "coral", className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "editorial";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#B8A99A] text-white hover:-translate-y-px hover:bg-[#A08474] hover:shadow-[0_4px_20px_rgba(184,151,126,0.3)] active:translate-y-0 active:bg-[#8F7565] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.15em]",
  secondary:
    "bg-transparent text-text-primary border border-accent-gold hover:bg-accent-gold hover:text-white px-7 py-3.5 text-xs font-medium uppercase tracking-[0.15em]",
  editorial: "",
};

export default function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  if (variant === "editorial") {
    return (
      <Link
        href={href}
        className={`editorial-link text-sm font-medium tracking-wide text-text-primary transition-colors hover:text-accent-gold ${className}`}
      >
        {children}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

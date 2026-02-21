type BgVariant = "primary" | "secondary" | "dark";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  bg?: BgVariant;
  className?: string;
}

const bgStyles: Record<BgVariant, string> = {
  primary: "bg-bg-primary text-text-primary",
  secondary: "bg-bg-secondary text-text-primary",
  dark: "bg-bg-dark text-white",
};

export default function SectionWrapper({ children, id, bg = "primary", className = "" }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`px-6 py-24 md:py-32 ${bgStyles[bg]} ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`size-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
    >
      <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" />
    </svg>
  );
}

type Variant = "primary" | "outline" | "gold" | "outlineDeep";

const variants: Record<Variant, string> = {
  primary:
    "bg-blue text-white hover:bg-deep active:bg-deep",
  outline:
    "border border-ink/80 text-ink hover:border-blue hover:text-blue",
  gold:
    "bg-gold text-deep hover:bg-[#e2bf4c]",
  outlineDeep:
    "border border-white/45 text-white hover:border-white hover:bg-white/8",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const base =
    "group inline-flex h-12 items-center justify-center gap-2.5 rounded-sheet px-5 text-[15px] font-semibold tracking-[-0.005em] transition-colors duration-200";
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <ArrowIcon className="transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
    </a>
  );
}

/** Disabled stand-in used while a required link (e.g. donations) is unset. */
export function PendingButton({
  children,
  variant = "gold",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      role="link"
      aria-disabled="true"
      className={`inline-flex h-12 cursor-not-allowed items-center justify-center gap-2.5 rounded-sheet px-5 text-[15px] font-semibold opacity-60 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Phoenix({
  tone = "color",
  className = "",
  priority = false,
}: {
  tone?: "color" | "white" | "duo";
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tone === "white" ? "/brand/phoenix-white.svg" : tone === "duo" ? "/brand/phoenix-duo.svg" : "/brand/phoenix-color.svg"}
      alt=""
      aria-hidden="true"
      width={985}
      height={1120}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  );
}

export function SectionHeading({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`font-display text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink ${className}`}
    >
      {children}
    </h2>
  );
}

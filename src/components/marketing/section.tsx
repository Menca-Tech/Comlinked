import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const container = "mx-auto my-0 w-full max-w-[1200px] px-5";

/** The page's single navy band. */
export function PageHero({
  className,
  contentClassName,
  children,
}: {
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("cl-dark bg-cl-night text-cl-paper", className)}>
      <div className={cn(container, "cl-hero-pad py-24", contentClassName)}>{children}</div>
    </section>
  );
}

/** A flat paper or white section. Its scroll margin clears the sticky navigation. */
export function Section({
  id,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  tone?: "paper" | "white";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "cl-sec scroll-mt-22",
        tone === "white" ? "bg-cl-surface" : "bg-cl-paper",
        className,
      )}
    >
      <div className={container}>{children}</div>
    </section>
  );
}

/** A section heading with one supporting sentence. */
export function SectionIntro({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-11 max-w-[700px]">
      <h2 className="cl-h2 mx-0 mt-0 mb-4 text-balance text-cl-ink">{title}</h2>
      <p className="m-0 text-[18px] leading-[28px] text-cl-ink-2">{children}</p>
    </div>
  );
}

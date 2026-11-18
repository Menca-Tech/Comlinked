import type { ReactNode } from "react";
import Link from "next/link";

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

/** Two hero columns on laptops, stacked on phones. */
export const heroWithVisual =
  "grid items-center gap-12 py-16 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]";

/** A hero's one headline and supporting line, with any buttons as children. */
export function HeroCopy({
  title,
  lead,
  className,
  children,
}: {
  title: ReactNode;
  lead: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col justify-center", className)}>
      <h1 className="cl-h1 mx-0 mt-0 mb-6 text-balance text-cl-paper">{title}</h1>
      <p className="mx-0 mt-0 mb-8 max-w-[32em] text-[19px] leading-[30px] text-cl-on-night-78">
        {lead}
      </p>
      {children}
    </div>
  );
}

const heroLinkBase =
  "cl-btn inline-flex h-13 items-center justify-center self-start border px-6.5 py-0 font-sans text-[15px] font-bold no-underline";

/** A button-styled link on the navy hero: light fill, or an outline for a second path. */
export function HeroLink({
  href,
  outline = false,
  children,
}: {
  href: string;
  outline?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      className={cn(
        heroLinkBase,
        outline
          ? "cl-btn-od border-cl-on-night-50 bg-transparent text-cl-paper"
          : "border-cl-paper bg-cl-paper text-cl-navy",
      )}
      href={href}
    >
      {children}
    </Link>
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

/** Marks a visual as example data. Takes its colour from the className. */
export function ExampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-current px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal",
        className,
      )}
    >
      Example
    </span>
  );
}

export interface TitledItem {
  title: string;
  text: string;
}

/** A grid of short titled statements, led by the logo ring. */
export function TitledList({ items }: { items: TitledItem[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-10 p-0">
      {items.map(({ title, text }) => (
        <li
          className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6"
          key={title}
        >
          <span
            className="cl-ring-accent mt-1.5 inline-block h-[11px] w-[11px] rounded-full"
            aria-hidden="true"
          />
          <div>
            <h3 className="mx-0 mt-0 mb-1 text-[20px] leading-[26px] text-cl-ink">{title}</h3>
            <p className="m-0 text-[15px] leading-[23px] text-cl-ink-2">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A plain list of single lines, led by the logo ring. */
export function RingList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-none border-b border-b-cl-rule p-0">
      {items.map((item) => (
        <li
          className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2"
          key={item}
        >
          <span
            className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The closing band of a page: a heading on paper and one navy button. */
export function ClosingCta({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <Section>
      <h2 className="cl-h2 mx-0 mt-0 mb-8 max-w-[16em] text-balance text-cl-ink">{title}</h2>
      <Link
        className="cl-btn inline-flex h-13 items-center justify-center border border-cl-navy bg-cl-navy px-6.5 py-0 font-sans text-[15px] font-bold text-cl-surface no-underline"
        href={href}
      >
        {label}
      </Link>
    </Section>
  );
}

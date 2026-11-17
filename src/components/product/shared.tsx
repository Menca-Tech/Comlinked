"use client";

import type { ComponentProps, ReactNode } from "react";
import { Check, ChevronLeft, Minus } from "lucide-react";

import { ClaimMark } from "@/components/product/claim-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Company } from "@/services/comlinked";
import {
  act,
  degreeLabel,
  fitReasons,
  matchReason,
  mutualText,
  publicView,
  searchDegree,
} from "@/services/comlinked";

type ButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & { cls?: string };

/** The product button. `cls` takes the App Mode modifiers: o, g, sm, block, w-fit, a-flush. */
export function Btn({ cls, className, type = "button", ...props }: ButtonProps) {
  return <Button type={type} variant="ghost" className={cn("a-btn", cls, className)} {...props} />;
}

type Mark = Pick<Company, "ini">;

export function Mono({ c, cls }: { c: Mark; cls?: string }) {
  return (
    <span className={cn("a-mono", cls)} aria-hidden="true">
      {c.ini}
    </span>
  );
}

/** The line under a Company's name: its industry and city, then its degree once it has claimed,
 * with the count of mutual connections where `mutuals` asks for it. Until then the line ends
 * with its website, the last of the basics other Companies may see. */
export function BasicsLine({ c, mutuals = false }: { c: Company; mutuals?: boolean }) {
  const view = publicView(c);
  const degree = degreeLabel(c);
  const relation = mutuals ? searchDegree(c) : degree ? ` · ${degree}` : "";
  return (
    <>
      {view.ind}, {view.city}
      {view.claimed ? relation : ` · ${view.website}`}
    </>
  );
}

export function CoBtn({ c, detail, cls }: { c: Company; detail?: ReactNode; cls?: string }) {
  return (
    <button type="button" className="a-co" onClick={() => act.viewCo(c.id)}>
      <Mono c={c} cls={cls} />
      <span className="a-co-t">
        <strong>{c.name}</strong>
        <small>{detail ?? <BasicsLine c={c} />}</small>
        <ClaimMark c={c} />
      </span>
    </button>
  );
}

export function St({
  kind = "",
  icon,
  children,
}: {
  kind?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className={cn("a-st", kind)}>
      {icon}
      {children}
    </span>
  );
}

export function NewMark() {
  return (
    <span className="a-new">
      <span className="a-ring" />
      New
    </span>
  );
}

export function Back({
  label,
  onClick,
  cls,
}: {
  label: string;
  onClick: () => void;
  cls?: string;
}) {
  return (
    <button type="button" className={cn("a-back", cls)} onClick={onClick}>
      <ChevronLeft className="a-ic" aria-hidden="true" />
      {label}
    </button>
  );
}

export function Tags({ list }: { list: string[] }) {
  return (
    <div className="a-row">
      {list.map((tag) => (
        <span key={tag} className="a-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function OfferSeek({ c }: { c: Pick<Company, "offer" | "seek"> }) {
  return (
    <div className="a-fields">
      <div>
        <div className="a-label">What we offer</div>
        <Tags list={c.offer} />
      </div>
      <div>
        <div className="a-label">What we’re looking for</div>
        <Tags list={c.seek} />
      </div>
    </div>
  );
}

export function PageHead({
  title,
  back,
  tail,
  sub,
}: {
  title: ReactNode;
  back?: ReactNode;
  tail?: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <header className="a-page">
      {back}
      <div className="a-head">
        <h1 className="a-h1">{title}</h1>
        {tail}
      </div>
      {sub}
    </header>
  );
}

/** The head of a profile. `note` adds lines under the industry and city. */
export function ProfileHead({
  c,
  tail,
  note,
}: {
  c: Mark & Pick<Company, "name" | "ind" | "city">;
  tail?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <header className="a-profile">
      <Mono c={c} cls="lg" />
      <div className="a-profile-t">
        <h1 className="a-h1">{c.name}</h1>
        <p className="a-small">
          {c.ind}, {c.city}
        </p>
        {note}
      </div>
      {tail}
    </header>
  );
}

/** One raised white panel per column. */
export function Panel({ cls, children }: { cls?: string; children: ReactNode }) {
  return <div className={cn("a-surface", cls)}>{children}</div>;
}

export function Tally({ done, total }: { done: number; total: number }) {
  return (
    <div className="a-tally">
      <span className="a-tally-m" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={i < done ? "on" : undefined} />
        ))}
      </span>
      {done} of {total} done
    </div>
  );
}

export function FitMark({ score }: { score: number }) {
  return (
    <span className="a-fit">
      <b>{score}</b>
      <small>Fit</small>
    </span>
  );
}

/** The Match Reason: one line on why to meet a Company. Shows nothing when there is none. */
export function WhyMeet({ c }: { c: Company }) {
  const reason = matchReason(c);
  if (!reason) return null;
  return (
    <div>
      <div className="a-label">Why meet</div>
      <p className="a-why">{reason}</p>
    </div>
  );
}

/** What makes up a Fit Score. Shows nothing for a Company that has not claimed. */
export function ReasonList({ c }: { c: Company }) {
  const reasons = fitReasons(c);
  if (!reasons.length) return null;
  return (
    <ul className="a-reasons">
      {reasons.map(([label, points]) => (
        <li key={label}>
          {points > 0 ? (
            <Check className="a-ic" aria-hidden="true" />
          ) : (
            <Minus className="a-ic" aria-hidden="true" />
          )}
          {label}
        </li>
      ))}
    </ul>
  );
}

export function MutualLine({ c }: { c: Company }) {
  const text = mutualText(c);
  return text ? <p className="a-small">{text}</p> : null;
}

export function AiChip({ field, on }: { field: string; on: boolean }) {
  return on ? (
    <span className="a-tag accent" data-chip={field}>
      AI draft
    </span>
  ) : null;
}

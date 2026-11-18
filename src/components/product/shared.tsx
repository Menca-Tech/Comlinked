"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Check, ChevronLeft, Minus } from "lucide-react";

import { ClaimMark } from "@/components/product/claim-mark";
import { Tag } from "@/components/product/tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Company, MyCompany } from "@/services/comlinked";
import {
  act,
  degreeLabel,
  fitReasons,
  hasClaimed,
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

/** Whose mark it is: a Company in the network, by its id, or the viewer's own Company. */
type MarkOf =
  { c: Pick<Company, "id" | "ini">; own?: false } | { c: Pick<MyCompany, "ini">; own: true };

/** A Company's mark: its initials on a square. Pale blue once the Company has claimed, a dashed
 * outline until then, and solid navy for the viewer's `own` Company. Whether a Company has
 * claimed comes from the seam, so no screen works it out. */
export function Mono(props: MarkOf & { cls?: string }) {
  const state = props.own ? "me" : hasClaimed(props.c.id) ? null : "unclaimed";
  return (
    <span className={cn("a-mono", state, props.cls)} aria-hidden="true">
      {props.c.ini}
    </span>
  );
}

/** The mark of a Company the network holds no claim for, in grey, so it says nothing of whether
 * the Company has claimed: one in another chamber, with its initials, or one whose name a "View
 * as" tier hides, with none. */
export function PlainMark({ ini, cls }: { ini?: string; cls?: string }) {
  return (
    <span className={cn("a-mono plain", cls)} aria-hidden="true">
      {ini}
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
  ...rest
}: {
  kind?: string;
  icon: ReactNode;
  children: ReactNode;
} & Omit<ComponentProps<"span">, "className" | "children">) {
  return (
    <span className={cn("a-st", kind)} {...rest}>
      {icon}
      {children}
    </span>
  );
}

/** For a status that takes a button's place once the viewer has acted. It marks the status so it
 * fades in, but only when it took that place while the viewer watched: one that was already there
 * when the screen opened does not move. Spread what it returns on the status. */
export function useReplaced(done: boolean) {
  const [doneAtFirst] = useState(done);
  return done && !doneAtFirst ? { "data-replaced": "" } : undefined;
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
        <Tag key={tag}>{tag}</Tag>
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

/** Whose profile it heads: a Company in the network, or the viewer's own. */
type ProfileOf =
  | { c: Pick<Company, "id" | "ini" | "name" | "ind" | "city">; own?: false }
  | { c: Pick<MyCompany, "ini" | "name" | "ind" | "city">; own: true };

/** The head of a profile. `note` adds lines under the industry and city. */
export function ProfileHead(props: ProfileOf & { tail?: ReactNode; note?: ReactNode }) {
  const { c, tail, note } = props;
  return (
    <header className="a-profile">
      {props.own ? <Mono c={props.c} own cls="lg" /> : <Mono c={props.c} cls="lg" />}
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

/** A panel: flat white with a hairline and no shadow. */
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
    <Tag tone="accent" data-chip={field}>
      AI draft
    </Tag>
  ) : null;
}

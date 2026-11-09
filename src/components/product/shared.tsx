"use client";

import type { ComponentProps, ReactNode } from "react";
import { Check, ChevronLeft, Clock, Minus } from "lucide-react";

import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Company } from "@/services/comlinked";
import {
  act,
  CAT,
  co,
  degreeLabel,
  fit,
  fitReasons,
  cap,
  mutualText,
  selectedLead,
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

export function CoBtn({ c, detail, cls }: { c: Company; detail?: ReactNode; cls?: string }) {
  const degree = degreeLabel(c);
  return (
    <button type="button" className="a-co" onClick={() => act.viewCo(c.id)}>
      <Mono c={c} cls={cls} />
      <span className="a-co-t">
        <strong>{c.name}</strong>
        <small>
          {detail ?? (
            <>
              {c.ind}, {c.city}
              {degree ? ` · ${degree}` : ""}
            </>
          )}
        </small>
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

export function ProfileHead({
  c,
  tail,
}: {
  c: Mark & Pick<Company, "name" | "ind" | "city">;
  tail?: ReactNode;
}) {
  return (
    <header className="a-profile">
      <Mono c={c} cls="lg" />
      <div className="a-profile-t">
        <h1 className="a-h1">{c.name}</h1>
        <p className="a-small">
          {c.ind}, {c.city}
        </p>
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

export function WhyMeet({ c }: { c: Company }) {
  return (
    <div>
      <div className="a-label">Why meet</div>
      <p className="a-why">{cap(c.why)}</p>
    </div>
  );
}

export function ReasonList({ c }: { c: Company }) {
  return (
    <ul className="a-reasons">
      {fitReasons(c).map(([label, points]) => (
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

export function LeadActions({ c }: { c: Company }) {
  return (
    <div className="a-acts a-lead-actions">
      <Btn onClick={() => act.connect(c.id)}>Connect</Btn>
      <Btn cls="o" onClick={() => act.message(c.id)}>
        Message
      </Btn>
      <Btn cls="g" onClick={() => act.skip(c.id)}>
        Skip
      </Btn>
    </div>
  );
}

/** The selected Lead in full: inside the list on a phone and on ComDash. */
export function LeadCard({ c, markCls }: { c: Company; markCls?: string }) {
  return (
    <article className="a-lead active a-lead-open" data-lead={c.id}>
      <div className="a-between">
        <CoBtn c={c} cls={markCls} />
        <FitMark score={fit(c).score} />
      </div>
      <WhyMeet c={c} />
      <ReasonList c={c} />
      <MutualLine c={c} />
      <LeadActions c={c} />
    </article>
  );
}

/** The selected Lead in full: the right-hand panel on a laptop. */
function LeadDetail({ c }: { c: Company }) {
  return (
    <article className="a-lead-open" id="lead-detail">
      <div className="a-between">
        <CoBtn c={c} cls="lg" />
        <FitMark score={fit(c).score} />
      </div>
      <WhyMeet c={c} />
      <div>
        <div className="a-label">Why it fits</div>
        <ReasonList c={c} />
      </div>
      <MutualLine c={c} />
      <OfferSeek c={c} />
      <LeadActions c={c} />
    </article>
  );
}

function LeadRow({ c, selected }: { c: Company; selected: boolean }) {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const action = S.leadAct[c.id];
  const conn = S.conn[c.id];
  const score = <FitMark score={fit(c).score} />;
  let result: ReactNode = null;
  let tail: ReactNode = null;
  if (conn === "connected") {
    result = (
      <span className="a-st good">
        <Check className="a-ic" aria-hidden="true" />
        Connected
      </span>
    );
    tail = (
      <Btn cls="g sm" onClick={() => act.message(c.id)}>
        Message
      </Btn>
    );
  } else if (conn === "pending") {
    result = (
      <span className="a-st">
        <Clock className="a-ic" aria-hidden="true" />
        Connection Request sent
      </span>
    );
    tail = (
      <Btn cls="g sm" onClick={() => act.withdraw(c.id)}>
        Withdraw
      </Btn>
    );
  } else if (action === "skip") {
    result = `Skipped. Fewer ${CAT[c.cat]} companies tomorrow.`;
  } else if (action === "message") {
    result = (
      <span className="a-st">
        <Check className="a-ic" aria-hidden="true" />
        Message started
      </span>
    );
    tail = (
      <Btn cls="g sm" onClick={() => act.connect(c.id)}>
        Connect
      </Btn>
    );
  }
  if (result) {
    return (
      <article className="a-lead done" data-lead={c.id}>
        <CoBtn c={c} detail={result} cls="sm" />
        {score}
        {tail}
      </article>
    );
  }
  if (selected && !isWeb) return <LeadCard c={c} />;
  const degree = degreeLabel(c);
  return (
    <article className={cn("a-lead pick", selected && "sel")} data-lead={c.id}>
      <button
        type="button"
        className="a-pick"
        onClick={() => act.pickLead(c.id)}
        aria-current={selected ? "true" : undefined}
      >
        <Mono c={c} />
        <span className="a-co-t">
          <strong>{c.name}</strong>
          <small>
            {c.ind}, {c.city}
            {degree ? ` · ${degree}` : ""}
          </small>
          <small className="a-pick-why">{cap(c.why)}</small>
        </span>
        {score}
      </button>
    </article>
  );
}

/** Ranked list beside the selected company on a laptop; a single opening list on a phone. */
export function LeadBoard({ ids, finished }: { ids: string[]; finished: ReactNode }) {
  const isWeb = useIsDesktop();
  const selected = selectedLead(ids);
  const rows = (
    <div className="a-leads">
      {ids.map((id) => (
        <LeadRow key={id} c={co(id)} selected={id === selected} />
      ))}
    </div>
  );
  if (!isWeb) {
    return (
      <>
        {selected ? null : finished}
        <Panel>{rows}</Panel>
      </>
    );
  }
  return (
    <div className="w-board">
      <Panel cls="a-board-list">{rows}</Panel>
      <aside className="a-surface a-detail">
        {selected ? <LeadDetail c={co(selected)} /> : finished}
      </aside>
    </div>
  );
}

export function AiChip({ field, on }: { field: string; on: boolean }) {
  return on ? (
    <span className="a-tag accent" data-chip={field}>
      AI draft
    </span>
  ) : null;
}

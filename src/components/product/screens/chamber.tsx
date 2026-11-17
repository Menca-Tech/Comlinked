"use client";

import { AlertCircle, Check, Clock } from "lucide-react";

import { Back, Btn, Mono, OfferSeek, PageHead, Panel, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TextField } from "@/services/comlinked";
import {
  act,
  cap,
  CHAMBER,
  co,
  memberRows,
  members,
  memberTotals,
  POOL,
  setForm,
} from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;
const clock = <Clock className="a-ic" aria-hidden="true" />;
const alert = <AlertCircle className="a-ic" aria-hidden="true" />;

function ImportCard() {
  const S = useSimulation();
  const cm = S.cm;
  const rows = memberRows();
  if (cm.stage === "idle") {
    return (
      <section className="a-card">
        <h2 className="a-h2">Member import</h2>
        <p className="a-why">
          Upload your member list. We build each company’s profile and send it a claim link.
        </p>
        <p className="a-small">This mockup always uses the sample list.</p>
        <Btn cls="w-fit" onClick={() => act.importPick()}>
          Choose sample file
        </Btn>
      </section>
    );
  }
  if (cm.stage === "preview") {
    return (
      <section className="a-card">
        <h2 className="a-h2">Member import</h2>
        <St kind="good" icon={check}>
          members-sample.csv: {rows.length} companies found
        </St>
        <div className="a-list">
          {rows.map((r) => (
            <div className="a-li" key={r.id}>
              <span className="a-li-m">
                <strong>{r.name}</strong>
                <small>
                  {r.ind}, {r.city}
                </small>
              </span>
              <span className="a-li-r">{r.source}</span>
            </div>
          ))}
        </div>
        <div className="a-row">
          <Btn onClick={() => act.importBuild()}>Build profiles and send claim links</Btn>
          <Btn cls="g" onClick={() => act.importCancel()}>
            Cancel
          </Btn>
        </div>
      </section>
    );
  }
  if (cm.stage === "building") {
    return (
      <section className="a-card">
        <h2 className="a-h2">Member import</h2>
        <St icon={clock}>
          Building profiles: {cm.built} of {rows.length}
        </St>
        <div className="a-meter">
          <i style={{ width: `${(cm.built / rows.length) * 100}%` }} />
        </div>
        <div className="a-list">
          {rows.map((r, i) => {
            const done = i < cm.built;
            const state = done
              ? "Draft ready"
              : i === cm.built
                ? `Reading ${r.source.toLowerCase()}`
                : "Waiting";
            const inner = (
              <>
                <span className="a-li-m">
                  <strong>{r.name}</strong>
                  <small>From {r.source.toLowerCase()}</small>
                </span>
                <span className="a-li-r">{state}</span>
              </>
            );
            return done ? (
              <button type="button" className="a-li" key={r.id} onClick={() => act.viewDraft(r.id)}>
                {inner}
              </button>
            ) : (
              <div className="a-li" key={r.id}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  return (
    <section className="a-sec">
      <h2 className="a-h2">Member import</h2>
      <St kind="good" icon={check}>
        {rows.length} profiles built. {rows.length} claim links sent.
      </St>
      <Btn cls="g sm a-flush" onClick={() => act.importPick()}>
        Run the import again
      </Btn>
    </section>
  );
}

function DraftProfile() {
  const S = useSimulation();
  const r = memberRows().find((x) => x.id === S.cm.draft)!;
  const mine = r.id === "me";
  const c = mine ? S.me : co(r.id);
  const about = mine ? `${cap(S.me.about)}.` : `${c.name} ${co(r.id).why}`;
  return (
    <div className="w-read">
      <Back label="Back to chamber tools" onClick={() => act.closeDraft()} />
      <PageHead
        title="Draft profile"
        sub={<p className="a-why">AI drafted this from the company’s {r.source.toLowerCase()}.</p>}
      />
      <Panel>
        <div className="a-co a-static">
          <Mono c={c} cls="lg" />
          <span className="a-co-t">
            <strong>{c.name}</strong>
            <small>
              {c.ind}, {c.city}
            </small>
          </span>
        </div>
        <p className="a-why">{about}</p>
        <OfferSeek c={c} />
        <section className="a-sec a-rule">
          <h2 className="a-h2">Claim status</h2>
          <St icon={clock}>Claim link sent</St>
          <p className="a-small">Source: {r.source}</p>
        </section>
      </Panel>
    </div>
  );
}

function CompanySelect({ id, field, value }: { id: string; field: TextField; value: string }) {
  const S = useSimulation();
  return (
    <Select value={value} onValueChange={(next) => setForm(field, next)}>
      <SelectTrigger className="a-input" id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="cl-guide">
        <SelectItem value="me">{S.me.name}</SelectItem>
        {POOL.slice(0, 11).map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// A1 L4: the Community Manager's tools.
export function Chamber() {
  const S = useSimulation();
  if (S.cm.draft) return <DraftProfile />;
  const list = members();
  const f = S.forms;
  const cm = S.cm;
  const head = (
    <PageHead
      title="Members"
      back={<Back label="Back to company view" onClick={() => act.nav("dash")} />}
      tail={
        <span className="a-small">{CHAMBER.shortName} community manager view, example members</span>
      }
    />
  );
  if (!cm.imported) {
    return (
      <>
        {head}
        <ImportCard />
        <p className="a-empty">
          Import the member list to see who has claimed, who is active and who needs an intro.
        </p>
      </>
    );
  }
  const totals = memberTotals();
  return (
    <>
      {head}
      <p className="t-sum">
        <b>{totals.members}</b> members · <b>{totals.claimed}</b> claimed · <b>{totals.active}</b>{" "}
        active · <b>{totals.needIntro}</b> need an intro
      </p>
      <div className="w-2">
        <div className="w-col a-surface">
          <section className="a-sec">
            <h2 className="a-h2">Latest {list.length} members</h2>
            <div className="a-list">
              {list.map((x) => (
                <button
                  type="button"
                  className="a-li"
                  key={x.id}
                  onClick={() => act.viewDraft(x.id)}
                >
                  <span className="a-li-m">
                    <strong>{x.name}</strong>
                    <small>{x.state}</small>
                  </span>
                  {x.intro ? (
                    <St kind="bad" icon={alert}>
                      Needs an intro
                    </St>
                  ) : null}
                </button>
              ))}
            </div>
          </section>
          <ImportCard />
        </div>
        <div className="w-col a-surface">
          <section className="a-card">
            <h2 className="a-h2">Make an introduction</h2>
            <div>
              <label className="a-label" htmlFor="f-a">
                First company
              </label>
              <CompanySelect id="f-a" field="introA" value={f.introA} />
            </div>
            <div>
              <label className="a-label" htmlFor="f-b">
                Second company
              </label>
              <CompanySelect id="f-b" field="introB" value={f.introB} />
            </div>
            <Btn cls="block" onClick={() => act.makeIntro()}>
              Send introduction
            </Btn>
          </section>
          <section className="a-card">
            <h2 className="a-h2">Announcement to members</h2>
            <div>
              <label className="a-label" htmlFor="f-b2">
                Message
              </label>
              <Textarea
                className="a-input"
                id="f-b2"
                rows={3}
                placeholder="Our next member meeting is on Friday."
                value={f.broadcast}
                onChange={(event) => setForm("broadcast", event.target.value)}
              />
            </div>
            <Btn cls="o block" onClick={() => act.broadcast()}>
              Send to {totals.claimed} claimed members
            </Btn>
          </section>
          <section className="a-sec">
            <h2 className="a-h2">Unusual points</h2>
            {cm.spike ? (
              cm.spike === "ok" ? (
                <St kind="good" icon={check}>
                  Marked as normal
                </St>
              ) : (
                <St kind="bad" icon={alert}>
                  Flagged for ComLinked staff
                </St>
              )
            ) : (
              <>
                <p className="a-why">
                  <b>Tala Print and Label</b> earned 68 points in one day.
                </p>
                <div className="a-row">
                  <Btn cls="o sm" onClick={() => act.spike("ok")}>
                    Looks normal
                  </Btn>
                  <Btn cls="o sm" onClick={() => act.spike("flag")}>
                    Flag it
                  </Btn>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

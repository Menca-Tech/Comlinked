"use client";

import Image from "next/image";

import { focusPanel } from "@/components/product/focus-panel";
import { MonthlyTopList } from "@/components/product/monthly-top";
import { AiChip, Btn, PageHead } from "@/components/product/shared";
import { SuccessWallList } from "@/components/product/success-wall";
import { useSimulation } from "@/components/product/use-simulation";
import { Textarea } from "@/components/ui/textarea";
import type { Win } from "@/services/comlinked";
import { act, co, setForm, SHARE_LINK } from "@/services/comlinked";

/** S1: the two questions that make a testimonial, owed after a deal with `company`. */
function TestimonialForm({ company }: { company: string }) {
  const S = useSimulation();
  const f = S.forms;
  return (
    <>
      <h2 className="a-formal">You did business with {company}</h2>
      <p className="a-small">Answer 2 questions. Other companies will see your testimonial.</p>
      <div>
        <div className="a-between">
          <label className="a-label" htmlFor="f-need">
            What did you need?
          </label>
          <AiChip field="need" on={f.needAi} />
        </div>
        <Textarea
          className="a-input"
          id="f-need"
          rows={2}
          value={f.need}
          onChange={(event) => setForm("need", event.target.value)}
        />
      </div>
      <div>
        <div className="a-between">
          <label className="a-label" htmlFor="f-got">
            What happened?
          </label>
          <AiChip field="got" on={f.gotAi} />
        </div>
        <Textarea
          className="a-input"
          id="f-got"
          rows={2}
          value={f.got}
          onChange={(event) => setForm("got", event.target.value)}
        />
      </div>
      <div className="a-row">
        <Btn onClick={() => act.postT()}>Post testimonial</Btn>
        {S.ai ? (
          <Btn cls="g" onClick={() => act.polishT()}>
            Polish my words
          </Btn>
        ) : null}
      </div>
    </>
  );
}

/** S2: the latest win as it would be shared, and where to share it. `main` makes posting the
 * screen's solid button, which it is unless a testimonial is owed. */
function ShareWin({ win, main }: { win: Win; main: boolean }) {
  const S = useSimulation();
  const preview = S.sharePreview;
  return (
    <>
      <h2 className="a-h2">Share this win</h2>
      <div className="a-share-card">
        <Image
          src="/assets/comlinked-logo.png"
          alt="ComLinked"
          width={110}
          height={22}
          unoptimized
        />
        <q>{win.got}</q>
        <small>
          {win.a} with {win.b}. Join free at {SHARE_LINK}
        </small>
      </div>
      <div className="a-acts">
        {["Facebook", "LinkedIn", "Viber"].map((n) => (
          <Btn key={n} cls="o sm" onClick={() => act.sharePreview(n)}>
            {S.shares[n] ? "Shared" : n}
          </Btn>
        ))}
      </div>
      {preview ? (
        <div className="a-sec a-rule">
          <h3 className="a-h3">Post preview for {preview}</h3>
          <p className="a-why">
            We just closed a deal with {win.b} through ComLinked. {win.got}
          </p>
          <p className="a-small">{SHARE_LINK}</p>
          <div className="a-row">
            <Btn cls={main ? undefined : "o"} onClick={() => act.share(preview)}>
              Post to {preview}
            </Btn>
            <Btn cls="g" onClick={() => act.shareCancel()}>
              Cancel
            </Btn>
          </div>
        </div>
      ) : null}
    </>
  );
}

// S1 S2 S3 D5: testimonials, sharing, the Success Wall and Monthly Top Companies. The card for
// sharing a win leads, as the Focus panel: the testimonial owed after a deal, or else the latest
// win to share. With neither, nothing is raised.
export function Wins() {
  const S = useSimulation();
  const owed = S.pendingT[0];
  const win = S.lastWin;
  return (
    <>
      <PageHead title="Wins" />
      <div className="w-2">
        <div className="w-col">
          {owed ? (
            <section className="a-card" {...focusPanel(true)}>
              <TestimonialForm company={co(owed.co).name} />
            </section>
          ) : win ? (
            <section className="a-card" {...focusPanel(true)}>
              <ShareWin win={win} main />
            </section>
          ) : null}
          <div className="a-surface">
            {owed && win ? (
              <section className="a-sec">
                <ShareWin win={win} main={false} />
              </section>
            ) : null}
            <section className="a-sec">
              <h2 className="a-h2">Success wall</h2>
              <SuccessWallList />
            </section>
          </div>
        </div>
        <div className="w-col w-sticky a-surface">
          <section className="a-sec" id="monthly">
            <h2 className="a-h2">Monthly top companies</h2>
            <MonthlyTopList />
          </section>
        </div>
      </div>
    </>
  );
}

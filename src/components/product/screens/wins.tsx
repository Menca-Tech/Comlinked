"use client";

import Image from "next/image";

import { focusPanel } from "@/components/product/focus-panel";
import { MonthlyTopList } from "@/components/product/monthly-top";
import { AiChip, Btn, PageHead } from "@/components/product/shared";
import { SuccessWallList } from "@/components/product/success-wall";
import { useSimulation } from "@/components/product/use-simulation";
import { Textarea } from "@/components/ui/textarea";
import { act, co, setForm, SHARE_LINK } from "@/services/comlinked";

// S1 S2 S3 D5: testimonials, sharing, the Success Wall and Monthly Top Companies. The card for
// sharing a win leads, as the Focus panel: the testimonial owed after a deal, or else the latest
// win to share. With neither, nothing is raised.
export function Wins() {
  const S = useSimulation();
  const f = S.forms;
  const pending = S.pendingT[0];
  const w = S.lastWin;
  const preview = S.sharePreview;
  const testimonial = pending ? (
    <>
      <h2 className="a-formal">You did business with {co(pending.co).name}</h2>
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
  ) : null;
  const share = w ? (
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
        <q>{w.got}</q>
        <small>
          {w.a} with {w.b}. Join free at {SHARE_LINK}
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
            We just closed a deal with {w.b} through ComLinked. {w.got}
          </p>
          <p className="a-small">{SHARE_LINK}</p>
          <div className="a-row">
            <Btn cls={pending ? "o" : undefined} onClick={() => act.share(preview)}>
              Post to {preview}
            </Btn>
            <Btn cls="g" onClick={() => act.shareCancel()}>
              Cancel
            </Btn>
          </div>
        </div>
      ) : null}
    </>
  ) : null;
  const lead = testimonial ?? share;
  return (
    <>
      <PageHead title="Wins" />
      <div className="w-2">
        <div className="w-col">
          {lead ? (
            <section className="a-card" {...focusPanel(true)}>
              {lead}
            </section>
          ) : null}
          <div className="a-surface">
            {testimonial && share ? <section className="a-sec">{share}</section> : null}
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

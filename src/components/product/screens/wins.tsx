"use client";

import Image from "next/image";

import { AiChip, Btn, PageHead } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Textarea } from "@/components/ui/textarea";
import {
  act,
  CHAMBER,
  co,
  monthlyTop,
  setForm,
  SHARE_LINK,
  successWall,
} from "@/services/comlinked";

// S1 S2 S3 D5: testimonials, sharing, the Success Wall and Monthly Top Companies.
export function Wins() {
  const S = useSimulation();
  const f = S.forms;
  const pending = S.pendingT[0];
  const w = S.lastWin;
  const { month, top } = monthlyTop();
  const wall = successWall();
  return (
    <>
      <PageHead title="Wins" />
      <div className="w-2">
        <div className="w-col a-surface">
          {pending ? (
            <section className="a-panel">
              <h2 className="a-h2">You did business with {co(pending.co).name}</h2>
              <p className="a-small">
                Answer 2 questions. Other companies will see your testimonial.
              </p>
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
            </section>
          ) : null}
          {w ? (
            <section className="a-sec">
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
              {S.sharePreview ? (
                <div className="a-panel">
                  <h3 className="a-h3">Post preview for {S.sharePreview}</h3>
                  <p className="a-why">
                    We just closed a deal with {w.b} through ComLinked. {w.got}
                  </p>
                  <p className="a-small">{SHARE_LINK}</p>
                  <div className="a-row">
                    <Btn cls={pending ? "o" : undefined} onClick={() => act.share(S.sharePreview!)}>
                      Post to {S.sharePreview}
                    </Btn>
                    <Btn cls="g" onClick={() => act.shareCancel()}>
                      Cancel
                    </Btn>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
          <section className="a-sec">
            <h2 className="a-h2">Success wall</h2>
            {wall.length ? (
              <div className="a-list">
                {wall.map((win) => (
                  <article className="a-win" key={`${win.day}|${win.a}|${win.b}|${win.need}`}>
                    <p className="a-why">
                      <b>{win.need}</b> {win.got}
                    </p>
                    <p className="a-small">
                      {win.a} with {win.b}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="a-empty">
                No wins yet. The first appears when two members confirm a deal.
              </p>
            )}
          </section>
        </div>
        <div className="w-col w-sticky a-surface">
          <section className="a-sec" id="monthly">
            <h2 className="a-h2">Monthly top companies</h2>
            <p className="a-small">
              {CHAMBER.shortName}, month {month}. For recognition only, and it resets each month.
            </p>
            <div className="a-list">
              {top.map((t, i) => (
                <div className={`a-li${t.me ? "me" : ""}`} key={t.n}>
                  <span className="a-li-m">
                    <strong>
                      {i + 1}. {t.n}
                    </strong>
                  </span>
                  <span className="a-li-r">{t.p} points</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

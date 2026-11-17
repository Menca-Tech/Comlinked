"use client";

import { useLayoutEffect } from "react";

import { ClaimMark } from "@/components/product/claim-mark";
import { Mono, NewMark, PageHead, Panel } from "@/components/product/shared";
import { Thread } from "@/components/product/screens/thread";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { act, co, openDefaultThread, th } from "@/services/comlinked";

const NO_THREADS = "Message a lead to start your first conversation.";

function MailList() {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  if (!S.threads.length) return <p className="a-empty">{NO_THREADS}</p>;
  return (
    <div className="a-list">
      {S.threads.map((t) => {
        const c = co(t.co);
        const last = t.msgs[t.msgs.length - 1];
        const preview = last
          ? last.text.replace(/\s+/g, " ").slice(0, 58) + (last.text.length > 58 ? "..." : "")
          : "New conversation";
        return (
          <button
            type="button"
            className="a-li"
            key={t.id}
            aria-current={isWeb && S.openThread === t.id ? "true" : undefined}
            onClick={() => act.openThread(t.id)}
          >
            <Mono c={c} />
            <span className="a-li-m">
              <strong>{c.name}</strong>
              <small>{preview}</small>
              <ClaimMark c={c} />
            </span>
            {t.unread ? <NewMark /> : null}
          </button>
        );
      })}
    </div>
  );
}

// C2 C3 C4: company-to-company messaging.
export function ComMail() {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  useLayoutEffect(() => {
    if (isWeb) openDefaultThread();
  }, [isWeb, S.threads.length, S.openThread]);
  if (!isWeb) {
    if (S.openThread) {
      return (
        <Panel>
          <Thread t={th(S.openThread)} />
        </Panel>
      );
    }
    return (
      <>
        <PageHead title="ComMail" />
        <Panel>
          <MailList />
        </Panel>
      </>
    );
  }
  return (
    <>
      <PageHead title="ComMail" />
      <div className="w-mail">
        <div className="w-col a-surface">
          <MailList />
        </div>
        <div className="w-col a-surface">
          {S.openThread ? <Thread t={th(S.openThread)} /> : <p className="a-empty">{NO_THREADS}</p>}
        </div>
      </div>
    </>
  );
}

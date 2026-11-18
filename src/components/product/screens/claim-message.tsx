"use client";

import { focusPanel } from "@/components/product/focus-panel";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, claimMessage } from "@/services/comlinked";

/** The message a member receives from its chamber, laid out as one message in its inbox. It is
 * the screen's Focus panel, and its button opens the Claim. The line under it says whose wording
 * this is. */
export function ClaimMessage() {
  useSimulation();
  const message = claimMessage();
  return (
    <div className="w-read cm-read">
      <article className="a-card" aria-labelledby="cm-subject" {...focusPanel(true)}>
        <header className="cm-head">
          <h1 id="cm-subject" className="a-h1">
            {message.subject}
          </h1>
          <dl className="cm-meta">
            <div>
              <dt>From</dt>
              <dd>{message.from}</dd>
            </div>
            <div>
              <dt>To</dt>
              <dd>{message.to}</dd>
            </div>
          </dl>
        </header>
        <div className="cm-body">
          <p>{message.greeting}</p>
          {message.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <Btn cls="w-fit" onClick={() => act.claimOpen()}>
            Claim your profile
          </Btn>
          <p>{message.assurance}</p>
        </div>
      </article>
      <p className="a-small">{message.note}</p>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";

import { Btn, Mono, OfferSeek } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { act, cap, firstMatches } from "@/services/comlinked";

function Welcome({
  title,
  sub,
  named,
  children,
}: {
  title: string;
  sub?: string;
  named?: boolean;
  children: ReactNode;
}) {
  const S = useSimulation();
  return (
    <div className="a-welcome">
      <div className="a-welcome-side">
        {named ? (
          <div className="a-welcome-co">
            <Mono c={S.me} />
            {S.me.name}
          </div>
        ) : null}
        <h1 className="a-h1">{title}</h1>
        {sub ? <p>{sub}</p> : null}
      </div>
      <div className="a-welcome-main">{children}</div>
    </div>
  );
}

// A2 A3: the personal claim link, the profile check and easy sign-in.
export function Claim() {
  const S = useSimulation();
  const [authorized, setAuthorized] = useState(false);
  const m = S.me;
  if (S.claimStep === 0) {
    return (
      <Welcome title="Your company is already here" sub="3 companies are already a match." named>
        <section className="a-sec">
          <h2 className="a-h2">Your first three matches</h2>
          <div className="a-list">
            {firstMatches().map((c) => (
              <div className="a-li" key={c.id}>
                <Mono c={c} />
                <span className="a-li-m">
                  <strong>{c.name}</strong>
                  <small>{cap(c.why)}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
        <Btn cls="block" onClick={() => act.claimNext()}>
          Claim your profile
        </Btn>
      </Welcome>
    );
  }
  if (S.claimStep === 1) {
    return (
      <Welcome
        title="Check your company profile"
        sub="We built this draft from your website, Facebook page and public directory listings."
      >
        <div className="a-co a-static">
          <Mono c={m} cls="lg" />
          <span className="a-co-t">
            <strong>{m.name}</strong>
            <small>
              {m.ind}, {m.city}
            </small>
          </span>
        </div>
        <p className="a-why">{cap(m.about)}.</p>
        <p className="a-small">Other members see this description once you confirm it.</p>
        <OfferSeek c={m} />
        <div className="a-sec a-rule">
          <label className="a-check">
            <Checkbox
              id="claim-auth"
              checked={authorized}
              onCheckedChange={(value) => setAuthorized(value === true)}
            />
            <span>I’m authorized to connect my company with other companies on its behalf.</span>
          </label>
          <p className="a-small">
            Your profile, and which companies view it, are visible to other companies on ComLinked.
          </p>
        </div>
        <Btn cls="block" onClick={() => act.claimConfirm(authorized ? "yes" : "")}>
          Confirm and claim
        </Btn>
      </Welcome>
    );
  }
  if (S.claimSub === "email") {
    return (
      <Welcome title="Check your work email" named>
        <p className="a-why">
          We sent a sign-in link to <b>ana@kalayaanfoods.example</b>.
        </p>
        <Btn cls="block" onClick={() => act.claimFinish()}>
          Open the sign-in link
        </Btn>
      </Welcome>
    );
  }
  if (S.claimSub === "otp") {
    return (
      <Welcome title="Enter your one-time code" named>
        <div className="a-auth">
          <label className="a-label" htmlFor="otp">
            Code sent to +63 917 555 0142
          </label>
          <Input className="a-input" id="otp" inputMode="numeric" defaultValue="482913" />
        </div>
        <Btn cls="block" onClick={() => act.claimFinish()}>
          Verify and continue
        </Btn>
        <p className="a-small">The number and code are examples.</p>
      </Welcome>
    );
  }
  return (
    <Welcome title="Sign in" sub="No password to remember on your phone." named>
      <div className="a-stack a-auth">
        <Btn cls="o block" onClick={() => act.claimFinish()}>
          Continue with Google
        </Btn>
        <Btn cls="o block" onClick={() => act.claimFinish()}>
          Continue with Facebook
        </Btn>
        <Btn cls="block" onClick={() => act.claimSub("email")}>
          Email me a sign-in link
        </Btn>
        <Btn cls="g block" onClick={() => act.claimSub("otp")}>
          Use my mobile number
        </Btn>
      </div>
    </Welcome>
  );
}

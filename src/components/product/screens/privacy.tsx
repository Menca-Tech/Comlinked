"use client";

import { PersonCard } from "@/components/product/person-card";
import { Back, Btn, PageHead, Panel } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Switch } from "@/components/ui/switch";
import type { NameShown } from "@/services/comlinked";
import { act, aliasOf, contactRequestsToMe, previewOfMe, signedIn } from "@/services/comlinked";

/** The choice between Ana's full name and her alias, as native radio buttons. */
function NameChoice() {
  const me = signedIn();
  const choices: { value: NameShown; label: string; on: boolean }[] = [
    { value: "full", label: me.name, on: !me.alias },
    { value: "alias", label: aliasOf(me.name), on: me.alias },
  ];
  return (
    <fieldset className="a-sec pv-fieldset">
      <legend className="a-label">Name</legend>
      {choices.map((choice) => (
        <label className="a-check pv-choice" key={choice.value}>
          <input
            type="radio"
            name="pv-name"
            value={choice.value}
            checked={choice.on}
            onChange={() => act.chooseName(choice.value)}
          />
          {choice.label}
        </label>
      ))}
    </fieldset>
  );
}

/** The Contact Requests waiting for Ana, each with Share and Decline. */
function WaitingForYou() {
  const { waiting } = contactRequestsToMe();
  return (
    <section className="a-sec">
      <h2 className="a-h2">Waiting for you</h2>
      {waiting.length ? (
        <ul className="a-list">
          {waiting.map((request) => (
            <li className="a-li pp-row" key={request.from}>
              <div className="a-li-m">
                <strong>{request.name}</strong>
                <small>Asked for your email and phone</small>
                <div className="a-row">
                  <Btn
                    cls="o sm"
                    aria-label={`Share with ${request.name}`}
                    onClick={() => act.shareContact(request.from)}
                  >
                    Share
                  </Btn>
                  <Btn
                    cls="g sm"
                    aria-label={`Decline ${request.name}`}
                    onClick={() => act.declineContact(request.from)}
                  >
                    Decline
                  </Btn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="a-small">Nothing is waiting.</p>
      )}
    </section>
  );
}

// C1: what connected Companies see of Ana, and the Contact Requests she answers herself.
export function Privacy() {
  useSimulation();
  const me = signedIn();
  const { sharedWith } = contactRequestsToMe();
  return (
    <div className="w-read">
      <PageHead
        back={<Back label="Company profile" onClick={() => act.nav("company")} />}
        title="Privacy and contact details"
      />
      <Panel>
        <section className="a-sec">
          <h2 className="a-h2">How connected companies see you</h2>
          <PersonCard person={previewOfMe()} />
        </section>
        <NameChoice />
        <section className="a-sec">
          <div className="a-switch-row">
            <h2 className="a-label">Job title: {me.showTitle ? "Shown" : "Hidden"}</h2>
            <Switch
              className="a-switch"
              aria-label="Job title"
              checked={me.showTitle}
              onCheckedChange={() => act.toggleTitle()}
            />
          </div>
        </section>
        <section className="a-sec">
          <h2 className="a-label">Email and phone</h2>
          <p className="a-why">Shared only with companies you approve, one request at a time.</p>
          <p className="a-small">
            {sharedWith.length
              ? `Shared with ${sharedWith.join(", ")}.`
              : "Shared with no company yet."}
          </p>
        </section>
        <WaitingForYou />
        <p className="a-small">Companies you aren’t connected to see no people at all.</p>
      </Panel>
    </div>
  );
}

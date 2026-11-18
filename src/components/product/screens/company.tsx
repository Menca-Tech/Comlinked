"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

import { focusPanel } from "@/components/product/focus-panel";
import { AiChip, Btn, Mono, ProfileHead, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileField } from "@/services/comlinked";
import {
  act,
  AI_LIMIT,
  co,
  connected,
  dayName,
  fit,
  setForm,
  strength,
} from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;

function PendingRows() {
  const S = useSimulation();
  const ids = Object.keys(S.conn).filter((k) => S.conn[k] === "pending");
  if (!ids.length) return null;
  return (
    <div>
      <h3 className="a-h3">Connection Requests you sent</h3>
      <div className="a-list">
        {ids.map((id) => {
          const c = co(id);
          return (
            <div className="a-li" key={id}>
              <Mono c={c} cls="sm" />
              <span className="a-li-m">
                <strong>{c.name}</strong>
                <small>{fit(c).score} fit</small>
              </span>
              <Btn cls="g sm" onClick={() => act.withdraw(id)}>
                Withdraw
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// A4 A5 C1 C3: your own Company's profile. Profile Strength leads it, as the Focus panel. `focus`
// names a field to focus on arrival.
export function CompanyProfile({ focus }: { focus?: ProfileField }) {
  const S = useSimulation();
  useEffect(() => {
    if (focus) document.getElementById(`f-${focus}`)?.focus();
  }, [focus]);
  const m = S.me;
  const f = S.forms;
  const todo = !m.products
    ? "products"
    : !m.projects.length
      ? "project"
      : !m.photo
        ? "photo"
        : null;
  const addCls = (key: string) => `${todo === key ? "" : "o "}sm`;
  const mine = S.wall.filter((w) => w.a === m.name || w.b === m.name);
  const lastChange = S.aiLog[0];
  const links = connected();
  return (
    <>
      <ProfileHead
        c={m}
        own
        tail={
          <St kind="good" icon={check}>
            Verified
          </St>
        }
      />
      <div className="w-2">
        <div className="w-col">
          <section className="a-card" {...focusPanel(true)}>
            <div className="a-between">
              <h2 className="a-h2">Profile strength</h2>
              <span className="a-pct">{strength()}%</span>
            </div>
            <div className="a-meter">
              <i style={{ width: `${strength()}%` }} />
            </div>
            <div>
              <div className="a-between">
                <label className="a-label" htmlFor="f-about">
                  Company description
                </label>
                <AiChip field="about" on={f.aboutAi} />
              </div>
              <div className="a-stack">
                <Textarea
                  className="a-input"
                  id="f-about"
                  rows={3}
                  value={f.about}
                  onChange={(event) => setForm("about", event.target.value)}
                />
                <div className="a-row">
                  <Btn cls="o sm" onClick={() => act.saveAbout()}>
                    Save description
                  </Btn>
                  {S.ai ? (
                    <Btn cls="g sm" onClick={() => act.polishAbout()}>
                      Polish my words
                    </Btn>
                  ) : null}
                </div>
              </div>
            </div>
            <div>
              <label className="a-label" htmlFor="f-products">
                Your top 3 products{m.products ? "" : ", +15%"}
              </label>
              {m.products ? (
                <p className="a-why">{m.products}</p>
              ) : (
                <div className="a-stack">
                  <Input
                    className="a-input"
                    id="f-products"
                    placeholder="Banana chips, ube spread, frozen lumpia"
                    value={f.products}
                    onChange={(event) => setForm("products", event.target.value)}
                  />
                  <Btn cls={`${addCls("products")} w-fit`} onClick={() => act.addProducts()}>
                    Add products
                  </Btn>
                </div>
              )}
            </div>
            <div>
              <label className="a-label" htmlFor="f-project">
                A recent project{m.projects.length ? "" : ", +10%"}
              </label>
              <div className="a-stack">
                {m.projects.map((p) => (
                  <p className="a-why" key={p}>
                    {p}
                  </p>
                ))}
                <Input
                  className="a-input"
                  id="f-project"
                  placeholder="Private-label chips for a Quezon City grocer"
                  value={f.project}
                  onChange={(event) => setForm("project", event.target.value)}
                />
                <Btn cls={`${addCls("project")} w-fit`} onClick={() => act.addProject()}>
                  Add project
                </Btn>
              </div>
            </div>
            <div className="a-between">
              <span className="a-why">A photo of your work{m.photo ? "" : ", +10%"}</span>
              {m.photo ? (
                <St kind="good" icon={check}>
                  Added
                </St>
              ) : (
                <Btn cls={addCls("photo")} onClick={() => act.addPhoto()}>
                  Add photo
                </Btn>
              )}
            </div>
          </section>
          <div className="a-surface">
            <section className="a-sec">
              <h2 className="a-h2">Company connections: {links.length}</h2>
              <p className="a-small">Connections belong to your company, not the person.</p>
              <div className="a-list">
                {links.map((id) => {
                  const c = co(id);
                  return (
                    <button type="button" className="a-li" key={id} onClick={() => act.viewCo(id)}>
                      <Mono c={c} cls="sm" />
                      <span className="a-li-m">
                        <strong>{c.name}</strong>
                        <small>{c.ind}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <PendingRows />
              <div className="a-between a-rule">
                <span className="a-why">
                  Authorized rep: <b>{m.rep}</b>
                </span>
                <Btn cls="o sm" onClick={() => act.swapRep()}>
                  Assign new rep
                </Btn>
              </div>
            </section>
            {mine.length ? (
              <section className="a-sec">
                <h2 className="a-h2">Testimonials on your profile</h2>
                {mine.map((w, i) => (
                  <p className="a-why" key={i}>
                    <b>{w.need}</b> {w.got}
                  </p>
                ))}
              </section>
            ) : null}
          </div>
        </div>
        <div className="w-col a-surface">
          <section className="a-sec">
            <div className="a-switch-row">
              <h2 className="a-h2">AI Assistant: {S.ai ? "On" : "Off"}</h2>
              <Switch
                className="a-switch"
                aria-label="AI Assistant"
                checked={S.ai}
                onCheckedChange={() => act.toggleAi()}
              />
            </div>
            <p className="a-why">
              When on, AI writes a draft for you. Nothing is sent until you tap Send.
            </p>
            <p className="a-small">
              {S.aiUsed[S.day] ?? 0} of {AI_LIMIT} drafts used today. Last change:{" "}
              {lastChange?.note}, {dayName(lastChange?.day ?? S.day).toLowerCase()}.
            </p>
          </section>
          <section className="a-card">
            <h2 className="a-h2">Invite your business partners</h2>
            <p className="a-small">+10 points when a company you invite claims its profile.</p>
            <div>
              <label className="a-label" htmlFor="f-invite">
                Company name
              </label>
              <Input
                className="a-input"
                id="f-invite"
                placeholder="A customer or supplier"
                value={f.invite}
                onChange={(event) => setForm("invite", event.target.value)}
              />
            </div>
            <div className="a-acts">
              {["Link", "Email", "Chat"].map((via) => (
                <Btn key={via} cls="o sm" onClick={() => act.invite(via)}>
                  {via}
                </Btn>
              ))}
            </div>
            {S.invites.length ? (
              <div className="a-list">
                {S.invites.map((invite, i) => (
                  <div className="a-li" key={i}>
                    <span className="a-li-m">
                      <strong>{invite.name}</strong>
                      <small>
                        {invite.joined
                          ? "Joined. New Member Boost active"
                          : `Invited by ${invite.via.toLowerCase()}`}
                      </small>
                    </span>
                    {invite.joined ? (
                      <Btn cls="g sm" onClick={() => act.searchFor(invite.name)}>
                        Find in search
                      </Btn>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}

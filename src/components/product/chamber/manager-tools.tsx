"use client";

import { AlertCircle, Check } from "lucide-react";

import { MemberImport } from "@/components/product/chamber/member-import";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { Btn, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IntroChoices, TextField } from "@/services/comlinked";
import {
  act,
  chamberClaimed,
  formatCount,
  introChoices,
  managerSpike,
  setForm,
} from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;
const alert = <AlertCircle className="a-ic" aria-hidden="true" />;

/** A picker of members that have claimed, those needing an Intro listed together first. */
function MemberSelect({
  id,
  field,
  value,
  choices,
}: {
  id: string;
  field: TextField;
  value: string;
  choices: IntroChoices;
}) {
  const groups = [
    { label: "Need an intro", items: choices.needIntro },
    { label: "Other members", items: choices.others },
  ].filter((group) => group.items.length);
  return (
    <Select value={value} onValueChange={(next) => setForm(field, next)}>
      <SelectTrigger className="a-input" id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="cl-guide">
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

/** An Intro between two members that have claimed. Its button is the screen's solid one once the
 * Member List is imported; until then the import's own button is. */
function Introduction() {
  const S = useSimulation();
  const choices = introChoices();
  const enough = choices.needIntro.length + choices.others.length > 1;
  return (
    <DashPanel title="Make an introduction">
      {enough ? (
        <>
          <div>
            <label className="a-label" htmlFor="f-a">
              First company
            </label>
            <MemberSelect id="f-a" field="introA" value={S.forms.introA} choices={choices} />
          </div>
          <div>
            <label className="a-label" htmlFor="f-b">
              Second company
            </label>
            <MemberSelect id="f-b" field="introB" value={S.forms.introB} choices={choices} />
          </div>
          <Btn cls={S.cm.imported ? "block" : "o block"} onClick={() => act.makeIntro()}>
            Send introduction
          </Btn>
        </>
      ) : (
        <EmptyNote>Introductions open once two members have claimed their profiles.</EmptyNote>
      )}
    </DashPanel>
  );
}

/** A message to every member of the chamber that has claimed, saying how many that is. */
function Announcement() {
  const S = useSimulation();
  const audience = chamberClaimed();
  return (
    <DashPanel title="Announcement to all members">
      {audience ? (
        <>
          <div>
            <label className="a-label" htmlFor="f-b2">
              Message
            </label>
            <Textarea
              className="a-input"
              id="f-b2"
              rows={3}
              placeholder="Our next member meeting is on Friday."
              value={S.forms.broadcast}
              onChange={(event) => setForm("broadcast", event.target.value)}
            />
          </div>
          <Btn cls="o block" onClick={() => act.broadcast()}>
            Send to {formatCount(audience)} claimed {audience === 1 ? "member" : "members"}
          </Btn>
        </>
      ) : (
        <EmptyNote>No member has claimed yet, so an announcement would reach nobody.</EmptyNote>
      )}
    </DashPanel>
  );
}

/** The unusual points awaiting review, or what was decided about them. */
function SpikeReview() {
  useSimulation();
  const spike = managerSpike();
  if (!spike) return <EmptyNote>Nothing unusual so far.</EmptyNote>;
  if (spike.state === "ok") {
    return (
      <St kind="good" icon={check}>
        Marked as normal
      </St>
    );
  }
  if (spike.state) {
    return (
      <St kind="bad" icon={alert}>
        Flagged for ComLinked staff
      </St>
    );
  }
  return (
    <>
      <p className="a-why">
        <b>{spike.name}</b> earned {spike.pts} points in one day.
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
  );
}

/** The Community Manager's tools, added to the Activity View in their Seat: the member import,
 * an Intro, an announcement and unusual points. */
export function ManagerTools() {
  return (
    <section className="av-tools" aria-label="Community manager’s tools">
      <MemberImport />
      <Introduction />
      <Announcement />
      <DashPanel title="Unusual points">
        <SpikeReview />
      </DashPanel>
    </section>
  );
}

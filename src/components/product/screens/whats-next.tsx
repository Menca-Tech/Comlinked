"use client";

import { Back, Btn, PageHead, Panel } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, laterItemShown, NEXT_UP } from "@/services/comlinked";

// Section 6 of the plan: planned after the MVP.
export function WhatsNext() {
  const S = useSimulation();
  const order = NEXT_UP.reduce<string[]>((groups, n) => {
    if (!groups.includes(n[2])) groups.push(n[2]);
    return groups;
  }, []);
  return (
    <div className="w-read">
      <PageHead
        title="After the MVP"
        back={<Back label="Back" onClick={() => act.nav(S.claimed ? "dash" : "home")} />}
        sub={
          <p className="a-why">
            Planned once the pilot shows companies coming back on their own. None of this is in the
            MVP.
          </p>
        }
      />
      <Panel>
        {order.map((when) => (
          <section className="a-sec" key={when}>
            <h2 className="a-h2">{when}</h2>
            <div className="a-list">
              {NEXT_UP.filter((n) => n[2] === when).map((n) => (
                <div className="a-li stack" key={n[0]}>
                  <span className="a-li-m">
                    <strong>{n[0]}</strong>
                    <small>{n[1]}</small>
                  </span>
                  {n[0] === "AI Lead Agent" && laterItemShown("previews") ? (
                    <Btn cls="o sm" onClick={() => act.nav("agent")}>
                      Open the preview
                    </Btn>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </Panel>
    </div>
  );
}

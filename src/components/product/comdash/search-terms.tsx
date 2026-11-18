"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { GapActions } from "@/components/product/comdash/gap-actions";
import { useSimulation } from "@/components/product/use-simulation";
import { planShown, termsForPlan } from "@/services/comlinked";

/** The words companies searched with, flagging any your profile doesn't list. The Free member tier
 * shows the first five and says how many more, and how many profile gaps, Growth shows. */
export function SearchTermsPanel() {
  useSimulation();
  const { shown: terms, more, moreGaps } = termsForPlan(planShown());
  return (
    <DashPanel title="Search terms that found you" note="30 days">
      {terms.length ? (
        <ul className="cd-terms">
          {terms.map((t) => (
            <li key={t.term}>
              <div className="cd-term">
                <code>{t.term}</code>
                <span>{t.count}</span>
              </div>
              {t.gap ? (
                <div className="cd-gap">
                  <p>Your profile doesn’t list this. Add it if you offer it.</p>
                  <GapActions term={t.term} links />
                </div>
              ) : null}
              {t.added ? <p className="cd-gap ok">Added to your profile.</p> : null}
            </li>
          ))}
          {more ? (
            <li className="cd-lockline">
              {more} more {more === 1 ? "term" : "terms"}
              {moreGaps
                ? `, including ${moreGaps} profile ${moreGaps === 1 ? "gap" : "gaps"},`
                : ""}{" "}
              on Growth.
            </li>
          ) : null}
        </ul>
      ) : (
        <EmptyNote>No searches yet. The words companies use to find you will show here.</EmptyNote>
      )}
    </DashPanel>
  );
}

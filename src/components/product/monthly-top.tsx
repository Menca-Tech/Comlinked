"use client";

import { useSimulation } from "@/components/product/use-simulation";
import { CHAMBER, monthlyTop } from "@/services/comlinked";

/** The chamber's Monthly Top Companies under its name, or a calm note before any member has
 * claimed. Wins and the chamber's Activity View both show it. The ten names are in regular
 * weight, so the list reads as a ranking and not as ten headings. */
export function MonthlyTopList() {
  useSimulation();
  const { month, top } = monthlyTop();
  return (
    <>
      <p className="a-small">
        {CHAMBER.shortName}, month {month}. For recognition only, and it resets each month.
      </p>
      {top.length ? (
        <div className="a-list">
          {top.map((t, i) => (
            <div className="a-li" key={t.n}>
              <span className="a-li-m">
                {i + 1}. {t.n}
              </span>
              <span className="a-li-r">{t.p} points</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="a-empty">The list starts once members have claimed and earned points.</p>
      )}
    </>
  );
}

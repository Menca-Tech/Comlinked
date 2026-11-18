import type { Ref } from "react";

import { SplitBar } from "@/components/product/chamber/split-bar";
import { StatusFilter } from "@/components/product/chamber/status-filter";
import { DashPanel } from "@/components/product/comdash/dash-panel";
import type { ActivityTile, ActivityViewData, StatusChoice } from "@/services/comlinked";

/** The results shown beside the claimed figure, in this order. */
const RESULTS: ActivityTile["key"][] = ["deals", "wins"];

/** The chamber screens' Focus panel: how many members have claimed, over how they all split by
 * status, with the status filter as the split's key and the pilot's results beside it. */
export function ClaimedFigure({
  data,
  choice,
  onChoose,
  chosenChip,
}: {
  data: ActivityViewData;
  choice: StatusChoice;
  onChoose: (choice: StatusChoice) => void;
  /** Set on the status filter's chosen chip, so the screen can send focus to it. */
  chosenChip: Ref<HTMLButtonElement>;
}) {
  const claimed = data.tiles.find((t) => t.key === "claimed");
  const results = RESULTS.flatMap((key) => data.tiles.filter((t) => t.key === key));
  return (
    <DashPanel label="The pilot in figures" focus className="av-claimed">
      <div>
        {claimed ? (
          <div className="cd-stat">
            <span className="cd-k">{claimed.label}</span>
            <span className="av-fig">
              {claimed.value} <span className="av-of">of {claimed.of}</span>
            </span>
          </div>
        ) : null}
        <SplitBar counts={data.counts} />
        <StatusFilter data={data} value={choice} onChange={onChoose} chosen={chosenChip} />
      </div>
      <div className="av-results">
        {results.map((t) => (
          <div className="cd-stat" key={t.key}>
            <span className="cd-k">{t.label}</span>
            <span className="cd-v">{t.value}</span>
          </div>
        ))}
      </div>
    </DashPanel>
  );
}

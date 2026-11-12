"use client";

import { LevelTag } from "@/components/product/comdash/level-tag";
import { INTEREST_LEVELS, type InterestLevel } from "@/services/comlinked";

export type LevelChoice = "All" | InterestLevel;

/** All, Hot, Warm and New, each with how many Companies it holds. */
export function LevelFilter({
  value,
  levels,
  onChange,
}: {
  value: LevelChoice;
  levels: InterestLevel[];
  onChange: (choice: LevelChoice) => void;
}) {
  const choices: LevelChoice[] = ["All", ...INTEREST_LEVELS];
  return (
    <div className="cd-seg" role="group" aria-label="Filter by Interest Level">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className="cd-chip"
          aria-pressed={value === choice}
          onClick={() => onChange(choice)}
        >
          {choice === "All" ? "All" : <LevelTag level={choice} />}{" "}
          {choice === "All" ? levels.length : levels.filter((l) => l === choice).length}
        </button>
      ))}
    </div>
  );
}

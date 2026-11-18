"use client";

import type { ReactNode, Ref } from "react";

import { LevelTag } from "@/components/product/comdash/level-tag";
import { INTEREST_LEVELS, type InterestLevel } from "@/services/comlinked";

export type LevelChoice = "All" | InterestLevel;

/** One chip: what it chooses, how it reads, and how many it holds. */
export interface FilterChip<T extends string> {
  value: T;
  label: ReactNode;
  count: number;
}

/** A row of filter chips, each with its count, the chosen one pressed. `chosen` is set on the
 * chosen chip, for a screen that sends focus to it. */
export function FilterChips<T extends string>({
  label,
  chips,
  value,
  onChange,
  chosen,
}: {
  label: string;
  chips: FilterChip<T>[];
  value: T;
  onChange: (choice: T) => void;
  chosen?: Ref<HTMLButtonElement>;
}) {
  return (
    <div className="cd-bands" role="group" aria-label={label}>
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          className="cd-band"
          ref={value === chip.value ? chosen : undefined}
          aria-pressed={value === chip.value}
          onClick={() => onChange(chip.value)}
        >
          {chip.label} <b>{chip.count}</b>
        </button>
      ))}
    </div>
  );
}

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
  const chips: FilterChip<LevelChoice>[] = [
    { value: "All", label: "All", count: levels.length },
    ...INTEREST_LEVELS.map((level) => ({
      value: level,
      label: <LevelTag level={level} />,
      count: levels.filter((l) => l === level).length,
    })),
  ];
  return (
    <FilterChips label="Filter by Interest Level" chips={chips} value={value} onChange={onChange} />
  );
}

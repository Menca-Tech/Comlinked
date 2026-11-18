import type { Ref } from "react";

import { statusKey } from "@/components/product/chamber/status-key";
import { FilterChips, type FilterChip } from "@/components/product/comdash/level-filter";
import type { ActivityViewData, StatusChoice } from "@/services/comlinked";

/** All the chamber's members, then each status with its colour from the split bar and how many of
 * the chamber's members it holds: the bar's key, and the member list's filter. `chosen` is set on
 * the chosen chip. */
export function StatusFilter({
  data,
  value,
  onChange,
  chosen,
}: {
  data: Pick<ActivityViewData, "memberCount" | "counts">;
  value: StatusChoice;
  onChange: (choice: StatusChoice) => void;
  chosen?: Ref<HTMLButtonElement>;
}) {
  const chips: FilterChip<StatusChoice>[] = [
    { value: "All", label: "All", count: data.memberCount },
    ...data.counts.map((c) => ({
      value: c.status,
      label: (
        <>
          <i className={statusKey(c.status)} aria-hidden="true" />
          {c.status}
        </>
      ),
      count: c.count,
    })),
  ];
  return (
    <FilterChips
      label="Filter by status"
      chips={chips}
      value={value}
      onChange={onChange}
      chosen={chosen}
    />
  );
}

import { FilterChips, type FilterChip } from "@/components/product/comdash/level-filter";
import type { ActivityViewData, MemberStatus } from "@/services/comlinked";

export type StatusChoice = "All" | MemberStatus;

/** All members, then each status, with how many members it holds, in ComDash's chip style. */
export function StatusFilter({
  data,
  value,
  onChange,
}: {
  data: Pick<ActivityViewData, "memberCount" | "counts">;
  value: StatusChoice;
  onChange: (choice: StatusChoice) => void;
}) {
  const chips: FilterChip<StatusChoice>[] = [
    { value: "All", label: "All", count: data.memberCount },
    ...data.counts.map((c) => ({ value: c.status, label: c.status, count: c.count })),
  ];
  return <FilterChips label="Filter by status" chips={chips} value={value} onChange={onChange} />;
}

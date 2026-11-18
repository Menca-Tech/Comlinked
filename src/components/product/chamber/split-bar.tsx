import { statusKey } from "@/components/product/chamber/status-key";
import type { ActivityViewData } from "@/services/comlinked";

/** How the members split by status, drawn in proportion. A status with no members draws no
 * segment. A picture only: the status filter under it gives the same counts in words. */
export function SplitBar({ counts }: { counts: ActivityViewData["counts"] }) {
  return (
    <div className="av-split" aria-hidden="true">
      {counts
        .filter((c) => c.count > 0)
        .map((c) => (
          <i key={c.status} className={statusKey(c.status)} style={{ flex: c.count }} />
        ))}
    </div>
  );
}

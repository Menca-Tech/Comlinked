import { Mono } from "@/components/product/shared";
import type { InterestRow } from "@/services/comlinked";

/** The mark of a named Company on Interest Signals: claim-aware for a member of the network, and
 * plain for a Company in another chamber, which the network holds no claim for. */
export function SignalMark({ row }: { row: InterestRow }) {
  const c = row.company;
  return row.chamber === null ? <Mono c={c} /> : <Mono c={c} plain />;
}

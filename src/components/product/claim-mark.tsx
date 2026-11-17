import type { Company } from "@/services/comlinked";
import { publicView } from "@/services/comlinked";

/** Marks a Company that has not claimed its profile, in text, and shows nothing once it has.
 * Until it claims, other Companies see only its name, industry, city and website. */
export function ClaimMark({ c }: { c: Company }) {
  return publicView(c).claimed ? null : <span className="a-unclaimed">Not yet claimed</span>;
}

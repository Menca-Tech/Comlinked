import type { MemberStatus } from "@/services/comlinked";

/** Each status's colour key. Adding a status adds its key here. */
const STATUS_KEY: Record<MemberStatus, string> = {
  Active: "active",
  Quiet: "quiet",
  "Needs an intro": "intro",
  "Not yet claimed": "unclaimed",
};

/** The class that colours a status's segment of the split bar and the dot on its chip. A second
 * cue only: every status is also named in words, with its count. */
export function statusKey(status: MemberStatus) {
  return `av-key ${STATUS_KEY[status]}`;
}

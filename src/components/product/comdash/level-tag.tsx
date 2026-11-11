import type { InterestLevel } from "@/services/comlinked";

/** Interest Level as text, with colour only as a second cue. */
export function LevelTag({ level }: { level: InterestLevel }) {
  return <span className={`cd-level ${level.toLowerCase()}`}>{level}</span>;
}

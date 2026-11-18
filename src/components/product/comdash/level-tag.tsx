import { Tag, type TagTone } from "@/components/product/tag";
import type { InterestLevel } from "@/services/comlinked";

/** Each Interest Level's tone, a second cue after its word. */
const TONE: Record<InterestLevel, TagTone> = { Hot: "solid", Warm: "accent", New: "line" };

/** Interest Level as text, with colour only as a second cue. With a score it reads "Hot · 88". */
export function LevelTag({ level, score = null }: { level: InterestLevel; score?: number | null }) {
  return (
    <Tag tone={TONE[level]}>
      {level}
      {score === null ? null : (
        <>
          {" · "}
          <span className="sr-only">intent score </span>
          {score}
        </>
      )}
    </Tag>
  );
}

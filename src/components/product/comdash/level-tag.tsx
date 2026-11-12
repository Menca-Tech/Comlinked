import type { InterestLevel } from "@/services/comlinked";

/** Interest Level as text, with colour only as a second cue. With a score it reads "Hot · 88". */
export function LevelTag({ level, score = null }: { level: InterestLevel; score?: number | null }) {
  return (
    <span className={`cd-level ${level.toLowerCase()}`}>
      {level}
      {score === null ? null : (
        <>
          {" · "}
          <span className="sr-only">intent score </span>
          {score}
        </>
      )}
    </span>
  );
}

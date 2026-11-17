import { NumberTiles } from "@/components/product/comdash/top-numbers";
import type { ActivityTile } from "@/services/comlinked";

/** The Activity View's figures as ComDash's number tiles. A figure out of a whole reads
 * "40 of 100". */
export function ActivityTiles({ tiles }: { tiles: ActivityTile[] }) {
  return (
    <section aria-label="The pilot in figures">
      <NumberTiles
        className="av-tiles"
        tiles={tiles.map((t) => ({
          key: t.key,
          label: t.label,
          value:
            t.of === null ? (
              t.value
            ) : (
              <>
                {t.value}
                <span className="av-of"> of {t.of}</span>
              </>
            ),
        }))}
      />
    </section>
  );
}

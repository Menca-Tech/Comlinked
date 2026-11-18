import { ExampleTag } from "@/components/marketing/section";
import { cn } from "@/lib/utils";

/** How the example chamber's members split by status, with each status's key on the bar and the
 * tone of its tag, as the Demo's chamber screen draws them on Day 14. */
const STATUSES = [
  { status: "Active", count: 20, key: "active", tone: "accent" },
  { status: "Quiet", count: 16, key: "quiet", tone: "" },
  { status: "Needs an intro", count: 4, key: "intro", tone: "error" },
  { status: "Not yet claimed", count: 60, key: "unclaimed", tone: "line" },
] as const;

type Status = (typeof STATUSES)[number]["status"];

const NOT_YET_CLAIMED: Status = "Not yet claimed";
const MEMBER_COUNT = STATUSES.reduce((total, { count }) => total + count, 0);
const CLAIMED = STATUSES.filter(({ status }) => status !== NOT_YET_CLAIMED).reduce(
  (total, { count }) => total + count,
  0,
);

const MEMBERS: { name: string; initials: string; status: Status }[] = [
  { name: "Luntian Foods Inc.", initials: "LF", status: "Active" },
  { name: "Hilaga Spice Traders", initials: "HS", status: "Quiet" },
  { name: "Lakbay Hotels", initials: "LH", status: "Needs an intro" },
  { name: "Northline Logistics", initials: "NL", status: NOT_YET_CLAIMED },
];

const toneOf = (status: Status) => STATUSES.find((entry) => entry.status === status)?.tone;

const describeList = (items: string[]) => items.join(", ");
const PANEL_LABEL = `Example activity view for a chamber. Claimed: ${CLAIMED} of ${MEMBER_COUNT}. ${describeList(
  STATUSES.map(({ status, count }) => `${status}: ${count}`),
)}. Members listed: ${describeList(MEMBERS.map(({ name, status }) => `${name}, ${status}`))}.`;

/** An example of the chamber's one-screen view: how many members have claimed, over how they all
 * split by status, with a few members under it. The Demo's chamber screen in small. */
export function ActivityViewPanel() {
  return (
    <div className="cl-example">
      <ExampleTag className="absolute top-5 right-5 text-cl-muted" />
      <div className="ex-body" role="img" aria-label={PANEL_LABEL}>
        <p className="ex-title">Activity view</p>
        <div>
          <div className="ex-fig">
            <span className="ex-k">Claimed</span>
            <span className="ex-claimed">
              <span>{CLAIMED}</span> <span className="ex-of">of {MEMBER_COUNT}</span>
            </span>
          </div>
          <div className="ex-split" aria-hidden="true">
            {STATUSES.map(({ status, count, key }) => (
              <i key={status} className={cn("ex-key", key)} style={{ flex: count }} />
            ))}
          </div>
          <ul className="ex-counts">
            {STATUSES.map(({ status, count, key }) => (
              <li key={status}>
                <i className={cn("ex-dot ex-key", key)} />
                {status} <b>{count}</b>
              </li>
            ))}
          </ul>
        </div>
        <ul className="ex-rows">
          {MEMBERS.map(({ name, initials, status }) => (
            <li className="ex-row" key={name}>
              <span className={cn("ex-mark", status === NOT_YET_CLAIMED && "unclaimed")}>
                {initials}
              </span>
              <div className="ex-row-t">
                <div className="ex-name">{name}</div>
              </div>
              <span className={cn("ex-tag", toneOf(status))}>{status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

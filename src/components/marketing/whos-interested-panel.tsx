import { EXAMPLE_MATCHES } from "@/components/marketing/home/example-matches";
import { ExampleTag } from "@/components/marketing/section";
import { cn } from "@/lib/utils";

export const INTEREST_SIGNALS = {
  search: { short: "Found you in search", full: "Companies that found you in search" },
  view: { short: "Viewed your profile", full: "Companies that viewed your profile" },
  message: { short: "Messaged you", full: "Companies that messaged you in ComMail" },
  recommended: {
    short: "Was recommended your company",
    full: "Companies that were recommended your company",
  },
};

type InterestSignal = keyof typeof INTEREST_SIGNALS;

/** How interested a Company is, and how the Demo's tag for it reads: Hot solid, Warm in the blue
 * tint, New outlined. */
const LEVEL_TONE = { Hot: "solid", Warm: "accent", New: "line" };

const RANK = "#4 of 12 in Food Suppliers";

/** The interested Companies, strongest interest first, as the Demo lists them. */
const ROWS: {
  company: string;
  initials: string;
  signal: InterestSignal;
  level: keyof typeof LEVEL_TONE;
}[] = [
  { company: "Luntian Foods Inc.", initials: "LF", signal: "message", level: "Hot" },
  { ...nameOf(EXAMPLE_MATCHES.pack), signal: "view", level: "Warm" },
  { ...nameOf(EXAMPLE_MATCHES.maple), signal: "search", level: "New" },
  { ...nameOf(EXAMPLE_MATCHES.northline), signal: "recommended", level: "New" },
];

function nameOf({ name, initials }: { name: string; initials: string }) {
  return { company: name, initials };
}

const sent = (signal: InterestSignal) => ROWS.filter((row) => row.signal === signal).length;

/** The figures over the list, counted from the rows so the two cannot disagree. */
const FIGURES = [
  { label: "Interested companies", value: ROWS.length },
  { label: "Messages", value: sent("message") },
  { label: "Search appearances", value: sent("search") },
];

const PANEL_LABEL = `Example of who’s interested in Kalayaan Foods, ranked ${RANK}. ${ROWS.map(
  ({ company, signal, level }) => `${company}: ${INTEREST_SIGNALS[signal].short}, ${level}`,
).join(". ")}.`;

/** Named example companies, the signal each one sent and its Interest Level: the Demo's Interest
 * Signals in small. */
export function WhosInterestedPanel() {
  return (
    <div className="cl-example">
      <ExampleTag className="absolute top-5 right-5 text-cl-muted" />
      <div className="ex-body" role="img" aria-label={PANEL_LABEL}>
        <div>
          <p className="ex-title">Who’s interested</p>
          <p className="ex-note">{RANK}</p>
        </div>
        <div className="ex-figs">
          {FIGURES.map(({ label, value }) => (
            <div className="ex-fig" key={label}>
              <span className="ex-k">{label}</span>
              <span className="ex-v">{value}</span>
            </div>
          ))}
        </div>
        <ul className="ex-rows">
          {ROWS.map(({ company, initials, signal, level }) => (
            <li className="ex-row" key={company}>
              <span className="ex-mark">{initials}</span>
              <div className="ex-row-t">
                <div className="ex-name">{company}</div>
                <div className="ex-detail">{INTEREST_SIGNALS[signal].short}</div>
              </div>
              <span className={cn("ex-tag", LEVEL_TONE[level])}>{level}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

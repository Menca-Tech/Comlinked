import { EXAMPLE_MATCHES } from "@/components/marketing/home/example-matches";
import { ExampleTag } from "@/components/marketing/section";

export const INTEREST_SIGNALS = {
  search: { short: "Found you in search", full: "Companies that found you in search" },
  view: { short: "Viewed your profile", full: "Companies that viewed your profile" },
  message: { short: "Messaged you", full: "Companies that messaged you in ComMail" },
  recommended: {
    short: "Was recommended your company",
    full: "Companies that were recommended your company",
  },
};

const RANK = "#4 of 12 in Food Suppliers";

const ROWS: { company: string; initials: string; signal: keyof typeof INTEREST_SIGNALS }[] = [
  { ...nameOf(EXAMPLE_MATCHES.maple), signal: "search" },
  { ...nameOf(EXAMPLE_MATCHES.pack), signal: "view" },
  { company: "Luntian Foods Inc.", initials: "LF", signal: "message" },
  { ...nameOf(EXAMPLE_MATCHES.northline), signal: "recommended" },
];

function nameOf({ name, initials }: { name: string; initials: string }) {
  return { company: name, initials };
}

const PANEL_LABEL = `Example of who’s interested in Kalayaan Foods, ranked ${RANK}. ${ROWS.map(
  ({ company, signal }) => `${company}: ${INTEREST_SIGNALS[signal].short}`,
).join(". ")}.`;

/** Named example companies and the signal each one sent. */
export function WhosInterestedPanel() {
  return (
    <div className="relative min-w-0 rounded-[16px] border border-cl-on-night-14 bg-cl-night-raised p-6">
      <ExampleTag className="absolute top-5 right-5 text-cl-on-night-82" />
      <div role="img" aria-label={PANEL_LABEL}>
        <p className="mx-0 mt-0 mb-1 pr-24 text-[18px] leading-[24px] font-extrabold text-cl-paper">
          Who’s interested
        </p>
        <p className="mx-0 mt-0 mb-3 text-[14px] leading-[20px] text-cl-on-night-82">{RANK}</p>
        <ul className="m-0 list-none p-0">
          {ROWS.map(({ company, initials, signal }) => (
            <li
              className="flex items-center gap-3.5 border-t border-t-cl-on-night-14 py-3"
              key={company}
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-[8px] bg-cl-night-chip text-[13px] font-extrabold text-cl-paper">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] leading-[22px] font-bold [overflow-wrap:anywhere] text-cl-paper">
                  {company}
                </div>
                <div className="text-[14px] leading-[20px] text-cl-on-night-82">
                  {INTEREST_SIGNALS[signal].short}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

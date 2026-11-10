import { ExampleTag } from "@/components/marketing/section";

const COUNTS = [
  { label: "Claimed", value: 86 },
  { label: "Active this week", value: 41 },
  { label: "Need an intro", value: 12 },
];

const MEMBERS = [
  { name: "Luntian Foods Inc.", status: "Active this week" },
  { name: "Kainan Catering Co.", status: "Claimed" },
  { name: "Hilaga Spice Traders", status: "Needs an intro" },
];

const describeList = (items: string[]) => items.join(", ");
const PANEL_LABEL = `Example activity view for a chamber. ${describeList(
  COUNTS.map(({ label, value }) => `${label}: ${value}`),
)}. Members listed: ${describeList(MEMBERS.map(({ name, status }) => `${name}, ${status}`))}.`;

/** An example of the chamber's one-screen view of who has claimed, who is active and who needs an intro. */
export function ActivityViewPanel() {
  return (
    <div className="relative min-w-0 rounded-[16px] border border-cl-on-night-14 bg-cl-night-raised p-6">
      <ExampleTag className="absolute top-5 right-5 text-cl-on-night-82" />
      <div role="img" aria-label={PANEL_LABEL}>
        <p className="mx-0 mt-0 mb-5 pr-24 text-[18px] leading-[24px] font-extrabold text-cl-paper">
          Activity view
        </p>
        <div className="grid grid-cols-3 gap-3 border-b border-b-cl-on-night-14 pb-5">
          {COUNTS.map(({ label, value }) => (
            <div className="min-w-0" key={label}>
              <div className="text-[32px] leading-[36px] font-bold text-cl-paper tabular-nums">
                {value}
              </div>
              <div className="mt-1 text-[13px] leading-[17px] text-cl-on-night-82">{label}</div>
            </div>
          ))}
        </div>
        <ul className="m-0 list-none p-0">
          {MEMBERS.map(({ name, status }) => (
            <li
              className="flex flex-wrap justify-between gap-x-4 border-b border-b-cl-on-night-14 py-3 text-[15px] leading-[22px] last:border-b-0"
              key={name}
            >
              <span className="min-w-0 font-bold [overflow-wrap:anywhere] text-cl-paper">
                {name}
              </span>
              <span className="text-cl-on-night-82">{status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

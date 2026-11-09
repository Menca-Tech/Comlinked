import { cn } from "@/lib/utils";
import { Section, SectionIntro } from "@/components/marketing/section";

const COMPANY = { x: 60, y: 45 };
const CONNECTIONS = [
  { x: 160, y: 20 },
  { x: 160, y: 70 },
  { x: 250, y: 45 },
];
const CONNECTION_SIZE = 20;

const OUTCOMES = [
  {
    tag: "Personal networks",
    text: "Their supplier and client contacts go with them. Your company starts over.",
    kept: false,
  },
  {
    tag: "ComLinked",
    text: "Every company connection stays on your profile. Assign a new rep and keep selling.",
    kept: true,
  },
];

/** The end state of a departure: connections broken, or still held by the company. */
function ConnectionsDrawing({ kept }: { kept: boolean }) {
  const stroke = kept ? "stroke-cl-sky" : "stroke-cl-grey";
  const companySize = kept ? 40 : 36;
  return (
    <svg className="block h-auto w-full" aria-hidden="true" viewBox="0 0 300 90">
      {CONNECTIONS.map(({ x, y }) => (
        <line
          className={stroke}
          key={`${x}-${y}`}
          x1={COMPANY.x}
          y1={COMPANY.y}
          x2={x}
          y2={y}
          strokeWidth={kept ? 2 : 1.5}
          strokeDasharray={kept ? undefined : "4 5"}
          opacity={kept ? 1 : 0.3}
        />
      ))}
      <rect
        className={kept ? "fill-cl-accent" : "fill-cl-sunken stroke-cl-grey"}
        rx={companySize / 2}
        x={COMPANY.x - companySize / 2}
        y={COMPANY.y - companySize / 2}
        width={companySize}
        height={companySize}
        strokeWidth={kept ? 0 : 1.5}
      />
      {CONNECTIONS.map(({ x, y }) => (
        <rect
          className={cn("fill-cl-surface", stroke)}
          key={`${x}-${y}`}
          rx={CONNECTION_SIZE / 2}
          x={x - CONNECTION_SIZE / 2}
          y={y - CONNECTION_SIZE / 2}
          width={CONNECTION_SIZE}
          height={CONNECTION_SIZE}
          strokeWidth={kept ? 2 : 1.5}
          opacity={kept ? 1 : 0.35}
        />
      ))}
    </svg>
  );
}

export function LeaveSection() {
  return (
    <Section>
      <SectionIntro title="When people leave, relationships shouldn’t.">
        On personal networks, connections belong to the employee. On ComLinked, they belong to the
        company, and any authorized representative can pick them up.
      </SectionIntro>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
        {OUTCOMES.map(({ tag, text, kept }) => (
          <div className="cl-card cl-pad min-w-0 border border-cl-rule bg-cl-surface p-8" key={tag}>
            <span
              className={cn(
                "mb-4.5 inline-block rounded-full border px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal",
                kept ? "border-cl-accent text-cl-accent-strong" : "border-cl-rule text-cl-muted",
              )}
            >
              {tag}
            </span>
            <h3 className="mx-0 mt-0 mb-2 text-[24px] leading-[28px] text-cl-ink">
              Your sales lead resigns
            </h3>
            <p className="mx-0 mt-0 mb-6 text-[16px] leading-[25px] text-cl-ink-2">{text}</p>
            <ConnectionsDrawing kept={kept} />
          </div>
        ))}
      </div>
    </Section>
  );
}

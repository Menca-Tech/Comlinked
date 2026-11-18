import { EXAMPLE_MATCHES } from "@/components/marketing/home/example-matches";
import { ExampleTag, Section, SectionIntro } from "@/components/marketing/section";

const MATCHES = Object.values(EXAMPLE_MATCHES);

const ACTIONS = [
  { label: "Connect", className: "border-cl-navy bg-cl-navy text-cl-surface" },
  { label: "Message", className: "border-cl-grey text-cl-ink" },
  { label: "Skip", className: "border-transparent text-cl-muted" },
];

export function FirstDaySection() {
  return (
    <Section>
      <SectionIntro title="Your first day">
        Three matched companies, each with a reason to meet.
      </SectionIntro>
      <div
        className="cl-card max-w-[760px] border border-cl-rule bg-cl-surface px-6 pt-5.5 pb-2"
        role="group"
        aria-label="Example of your first day on ComLinked"
      >
        <div className="flex items-center justify-between gap-3 pb-3.5">
          <p className="m-0 text-[14px] leading-[20px] text-cl-ink-2">
            <strong>Luntian Foods Inc.</strong> viewed your profile today
          </p>
          <ExampleTag className="flex-none text-cl-muted" />
        </div>
        <ul className="m-0 list-none p-0">
          {MATCHES.map((match) => (
            <li className="flex gap-3.5 border-t border-t-cl-rule px-0 py-4" key={match.name}>
              <span
                className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-cl-navy text-[13px] font-extrabold text-cl-paper"
                aria-hidden="true"
              >
                {match.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
                  <span className="text-[16px] leading-[22px] font-bold text-cl-ink">
                    {match.name}
                  </span>
                  <span className="text-[13px] leading-[22px] text-cl-muted">{match.detail}</span>
                </div>
                <p className="mx-0 mt-1 mb-3 text-[14px] leading-[21px] text-cl-ink-2">
                  Why meet: {match.why}
                </p>
                <div className="flex flex-wrap gap-2" aria-hidden="true">
                  {ACTIONS.map((action) => (
                    <span
                      className={`inline-flex h-8 items-center rounded-full border px-3.5 py-0 text-[13px] font-bold ${action.className}`}
                      key={action.label}
                    >
                      {action.label}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

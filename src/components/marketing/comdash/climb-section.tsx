import { Section, SectionIntro } from "@/components/marketing/section";

// Values from the Activity Score table, MVP Build Plan Section 4.
const POINTS = [
  { action: "Open your daily lead list and act on at least one company", points: 2 },
  { action: "Reply to a ComMail within 24 hours", points: 3 },
  { action: "Post an ask, or respond to someone else’s", points: 5 },
  { action: "Connection accepted", points: 5 },
  { action: "Meeting confirmed by both companies", points: 10 },
  { action: "Testimonial posted", points: 15 },
  { action: "Deal confirmed by both companies", points: 25 },
];

export function ClimbSection() {
  return (
    <Section tone="white">
      <SectionIntro title="Climb by being active.">
        Search shows the most relevant companies first. Among them, activity raises your place by up
        to 30%, so an inactive packaging company still shows up in a packaging search.
      </SectionIntro>
      <ul className="m-0 max-w-[700px] list-none border-b border-b-cl-rule p-0">
        {POINTS.map(({ action, points }) => (
          <li
            className="flex items-baseline justify-between gap-6 border-t border-t-cl-rule py-3.5 text-[16px] leading-[25px] text-cl-ink-2"
            key={action}
          >
            <span className="min-w-0">{action}</span>
            <span className="font-bold whitespace-nowrap text-cl-ink">{points} points</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

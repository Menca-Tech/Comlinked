import { Section, SectionIntro } from "@/components/marketing/section";

const COMMITMENTS = [
  {
    title: "Free for every company",
    text: "Every feature is open to every company. No tiers and no paywall.",
  },
  {
    title: "Company names are never hidden",
    text: "The names of companies interested in you are shown, not blurred.",
  },
  {
    title: "Connections stay with your company",
    text: "They stay on your company profile when someone leaves.",
  },
  {
    title: "Each chamber network is kept separate",
    text: "Each chamber’s network is kept apart from the others.",
  },
  {
    title: "AI drafts. You decide.",
    text: "The AI Assistant drafts for you and never sends on its own.",
  },
];

export function CommitmentsSection() {
  return (
    <Section id="free" tone="white">
      <SectionIntro title="What we commit to">
        ComLinked is a network of companies, so every profile, connection and message is tied to a
        real business.
      </SectionIntro>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-10 p-0">
        {COMMITMENTS.map(({ title, text }) => (
          <li
            className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6"
            key={title}
          >
            <span
              className="cl-ring-accent mt-1.5 inline-block h-[11px] w-[11px] rounded-full"
              aria-hidden="true"
            />
            <div>
              <h3 className="mx-0 mt-0 mb-1 text-[20px] leading-[26px] text-cl-ink">{title}</h3>
              <p className="m-0 text-[15px] leading-[23px] text-cl-ink-2">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

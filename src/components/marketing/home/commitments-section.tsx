import { Section, SectionIntro, TitledList } from "@/components/marketing/section";

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
      <TitledList items={COMMITMENTS} />
    </Section>
  );
}

import { Section, SectionIntro, TitledList, type TitledItem } from "@/components/marketing/section";

const ASKS: TitledItem[] = [
  { title: "Your member list", text: "We use it to build each company’s profile." },
  { title: "One contact", text: "Someone who can help us welcome members." },
];

export function AsksSection() {
  return (
    <Section>
      <SectionIntro title="What a pilot asks of you">
        Pilot chambers and their members join free.
      </SectionIntro>
      <TitledList items={ASKS} />
      <p className="mx-0 mt-2 mb-0 text-[16px] leading-[25px] text-cl-ink-2">
        We’ll confirm anything else with your chamber during pilot planning.
      </p>
    </Section>
  );
}

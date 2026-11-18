import { Section, SectionIntro, TitledList, type TitledItem } from "@/components/marketing/section";

const COMMITMENTS: TitledItem[] = [
  {
    title: "Your Chamber Network is kept separate",
    text: "Each chamber’s network is kept apart from the others.",
  },
  {
    title: "Every feature for every member",
    text: "No tiers and no paywall for any member company.",
  },
  {
    title: "Connections stay private",
    text: "Other companies see only a company’s Connection count and Mutual Connections.",
  },
];

export function ChamberCommitmentsSection() {
  return (
    <Section tone="white">
      <SectionIntro title="What we commit to">
        Three promises to every pilot chamber and its members.
      </SectionIntro>
      <TitledList items={COMMITMENTS} />
    </Section>
  );
}

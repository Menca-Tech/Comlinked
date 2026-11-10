import { Section, SectionIntro, TitledList, type TitledItem } from "@/components/marketing/section";

const BENEFITS: TitledItem[] = [
  {
    title: "A profile built for them",
    text: "We build each company’s profile and send a personal claim link.",
  },
  {
    title: "Matches on the first day",
    text: "3 matched companies, each with a reason to talk.",
  },
  {
    title: "New leads every morning",
    text: "5 new matched companies a day to connect with, message or skip.",
  },
  {
    title: "Interest shown by name",
    text: "ComDash shows which companies found, viewed or messaged them.",
  },
];

export function MembersSection() {
  return (
    <Section>
      <SectionIntro title="What your members get">
        Every feature is open to every member company.
      </SectionIntro>
      <TitledList items={BENEFITS} />
    </Section>
  );
}

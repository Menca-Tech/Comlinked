import { Section, SectionIntro, TitledList, type TitledItem } from "@/components/marketing/section";

const FIRST_DAY: TitledItem[] = [
  {
    title: "Meet 3 matched companies",
    text: "Right after you claim, 3 companies that fit you, each with a one-line reason to meet.",
  },
  {
    title: "See who’s interested",
    text: "ComDash shows who found you, viewed you or messaged you, by company name.",
  },
  {
    title: "A person helps if it’s quiet",
    text: "No interest yet? A community manager hand-picks an introduction for you.",
  },
];

export function HowFirstDaySection() {
  return (
    <Section tone="white">
      <SectionIntro title="Your first day">
        Everything here happens on the day you claim your profile.
      </SectionIntro>
      <TitledList items={FIRST_DAY} />
    </Section>
  );
}

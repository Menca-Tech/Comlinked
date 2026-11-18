import { DailyLeadLoop } from "@/components/marketing/daily-lead-loop";
import { Section, SectionIntro } from "@/components/marketing/section";

export function EveryDaySection() {
  return (
    <Section>
      <SectionIntro title="Every day after">
        Each step feeds the next, so the more you use ComLinked, the more companies find you.
      </SectionIntro>
      <DailyLeadLoop />
    </Section>
  );
}

import { Section, SectionIntro, TitledList } from "@/components/marketing/section";
import { MEMBER_BENEFITS } from "@/lib/member-benefits";

export function MembersSection() {
  return (
    <Section>
      <SectionIntro title="What your members get">
        Every feature is open to every member company.
      </SectionIntro>
      <TitledList items={MEMBER_BENEFITS} />
    </Section>
  );
}

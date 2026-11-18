import { RingList, Section, SectionIntro } from "@/components/marketing/section";
import { INTEREST_SIGNALS } from "@/components/marketing/whos-interested-panel";

export function SignalsSection() {
  return (
    <Section>
      <SectionIntro title="Who’s interested, by name.">
        Every signal shows the company behind it. Names are never hidden, and it’s free.
      </SectionIntro>
      <div className="max-w-[700px]">
        <RingList items={Object.values(INTEREST_SIGNALS).map((signal) => signal.full)} />
      </div>
    </Section>
  );
}

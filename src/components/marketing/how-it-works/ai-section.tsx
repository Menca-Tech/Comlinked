import { RingList, Section, SectionIntro } from "@/components/marketing/section";

const AI_JOBS = [
  "Introduce yourself to a match",
  "Suggest a reply to a ComMail",
  "Draft a polite follow-up after 3 days",
  "Polish your profile, asks and testimonials",
];

export function AiSection() {
  return (
    <Section tone="white">
      <SectionIntro title="AI drafts. You decide.">
        One switch turns the AI Assistant on or off. When it’s on, it writes a draft for you.
        Nothing is sent until you tap Send.
      </SectionIntro>
      <div className="max-w-[700px]">
        <RingList items={AI_JOBS} />
        <p className="mx-0 mt-5 mb-0 text-[16px] leading-[25px] text-cl-ink-2">
          With it off, everything works the same, with ready-made templates instead of drafts.
        </p>
      </div>
    </Section>
  );
}

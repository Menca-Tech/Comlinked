import { Section, SectionIntro } from "@/components/marketing/section";

const STEPS = [
  {
    title: "Import your members",
    text: "Upload your member list. We build each company’s profile and send them a claim link.",
  },
  {
    title: "See who’s active",
    text: "One screen shows who has claimed their profile, who is active, and who needs an introduction.",
  },
  {
    title: "Make introductions",
    text: "Introduce two members to each other, or send an announcement to every member.",
  },
  {
    title: "Community managers on hand",
    text: "During the pilot, community managers hand-pick introductions so no member goes a week without a lead.",
  },
  {
    title: "Recognize your most active members",
    text: "A monthly list of your 10 most active companies. Recognition only, no prizes.",
  },
];

export function ChamberHowSection() {
  return (
    <Section id="how" tone="white">
      <SectionIntro title="How it works for your chamber">
        Everything a chamber needs to run the pilot, on one screen.
      </SectionIntro>
      <ol className="m-0 list-none border-b border-b-cl-rule p-0" role="list">
        {STEPS.map(({ title, text }, index) => (
          <li
            className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-t border-t-cl-rule px-0 py-6.5"
            key={title}
          >
            <span
              className="font-sans text-[22px] leading-[28px] font-bold text-cl-accent-strong"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="mx-0 mt-0 mb-1.5 text-[22px] leading-[28px] text-cl-ink">{title}</h3>
              <p className="m-0 text-[16px] leading-[25px] text-cl-ink-2">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

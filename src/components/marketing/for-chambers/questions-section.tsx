import { Questions, type Question } from "@/components/marketing/questions";
import { Section } from "@/components/marketing/section";

const UNCONFIRMED = "We’ll confirm this with your chamber during pilot planning.";

const QUESTIONS: Question[] = [
  { question: "How long does a pilot take?", answer: UNCONFIRMED },
  {
    question: "Do our members pay?",
    answer: "No. Every feature is open to every member company, free, with no paywall.",
  },
  {
    question: "Can members see each other’s names?",
    answer:
      "Yes. ComLinked shows which companies viewed or searched for you, by name. Sign-up tells every company that profile views are visible to others.",
  },
  { question: "How is member data protected?", answer: UNCONFIRMED },
];

export function ChamberQuestionsSection() {
  return (
    <Section id="faq">
      <Questions title="Questions from chambers" items={QUESTIONS} />
    </Section>
  );
}

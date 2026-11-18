import { Questions, type Question } from "@/components/marketing/questions";
import { Section } from "@/components/marketing/section";

const QUESTIONS: Question[] = [
  {
    question: "Who can join?",
    answer:
      "Companies only: their owners and authorized representatives. No personal profiles, multi-level marketing or one-person sellers.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. Every feature is open to every company, with no paywall. The names of companies interested in you are shown, not blurred.",
  },
  {
    question: "Does the AI send messages for me?",
    answer:
      "No. With the AI Assistant on, it drafts intros, replies and follow-ups; nothing is sent until you tap Send. Turn it off at any time.",
  },
  {
    question: "What happens when our rep leaves?",
    answer:
      "Your connections stay with your company profile. Assign another authorized rep and keep selling.",
  },
  {
    question: "Protecting your data",
    answer: "We’ll confirm this with your chamber during pilot planning.",
  },
];

export function QuestionsSection() {
  return (
    <Section>
      <Questions title="Questions from companies" items={QUESTIONS} />
    </Section>
  );
}

import { ChamberSection } from "@/components/marketing/home/chamber-section";
import { CommitmentsSection } from "@/components/marketing/home/commitments-section";
import { FirstDaySection } from "@/components/marketing/home/first-day-section";
import { HeroSection } from "@/components/marketing/home/hero-section";
import { JoinSection } from "@/components/marketing/home/join-section";
import { LeaveSection } from "@/components/marketing/home/leave-section";
import { QuestionsSection } from "@/components/marketing/home/questions-section";

export function HomeContent() {
  return (
    <>
      <HeroSection />
      <FirstDaySection />
      <ChamberSection />
      <LeaveSection />
      <CommitmentsSection />
      <QuestionsSection />
      <JoinSection />
    </>
  );
}

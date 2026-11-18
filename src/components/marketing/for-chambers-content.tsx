import { AsksSection } from "@/components/marketing/for-chambers/asks-section";
import { ChamberCommitmentsSection } from "@/components/marketing/for-chambers/commitments-section";
import { ChamberHeroSection } from "@/components/marketing/for-chambers/hero-section";
import { ChamberHowSection } from "@/components/marketing/for-chambers/how-section";
import { MembersSection } from "@/components/marketing/for-chambers/members-section";
import { PilotSection } from "@/components/marketing/for-chambers/pilot-section";
import { ChamberQuestionsSection } from "@/components/marketing/for-chambers/questions-section";

export function ForChambersContent() {
  return (
    <>
      <ChamberHeroSection />
      <MembersSection />
      <ChamberHowSection />
      <AsksSection />
      <ChamberCommitmentsSection />
      <ChamberQuestionsSection />
      <PilotSection />
    </>
  );
}

import { AiSection } from "@/components/marketing/how-it-works/ai-section";
import { ClaimSection } from "@/components/marketing/how-it-works/claim-section";
import { EveryDaySection } from "@/components/marketing/how-it-works/every-day-section";
import { HowFirstDaySection } from "@/components/marketing/how-it-works/first-day-section";
import { HowHeroSection } from "@/components/marketing/how-it-works/hero-section";
import { ClosingCta } from "@/components/marketing/section";
import { paths } from "@/paths";

export function HowItWorksContent() {
  return (
    <>
      <HowHeroSection />
      <ClaimSection />
      <HowFirstDaySection />
      <EveryDaySection />
      <AiSection />
      <ClosingCta
        title="Your first leads are a day away."
        href={paths.marketing.join}
        label="Join ComLinked free"
      />
    </>
  );
}

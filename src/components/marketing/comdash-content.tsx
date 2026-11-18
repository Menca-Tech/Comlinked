import { ClimbSection } from "@/components/marketing/comdash/climb-section";
import { ComDashHeroSection } from "@/components/marketing/comdash/hero-section";
import { SignalsSection } from "@/components/marketing/comdash/signals-section";
import { ClosingCta } from "@/components/marketing/section";
import { paths } from "@/paths";

export function ComDashContent() {
  return (
    <>
      <ComDashHeroSection />
      <SignalsSection />
      <ClimbSection />
      <ClosingCta
        title="See who’s finding your company."
        href={paths.marketing.join}
        label="Join ComLinked free"
      />
    </>
  );
}

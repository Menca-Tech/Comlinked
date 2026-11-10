import { HeroCopy, heroWithVisual, PageHero } from "@/components/marketing/section";
import { WhosInterestedPanel } from "@/components/marketing/whos-interested-panel";

export function ComDashHeroSection() {
  return (
    <PageHero contentClassName={heroWithVisual}>
      <HeroCopy
        title="See who’s finding you on ComDash"
        lead="Your company dashboard shows who is looking at you, by name, and where you rank in search."
      />
      <WhosInterestedPanel />
    </PageHero>
  );
}

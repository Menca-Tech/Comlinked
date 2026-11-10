import { ActivityViewPanel } from "@/components/marketing/activity-view-panel";
import { HeroCopy, HeroLink, heroWithVisual, PageHero } from "@/components/marketing/section";
import { paths } from "@/paths";

export function ChamberHeroSection() {
  return (
    <PageHero contentClassName={heroWithVisual}>
      <HeroCopy
        title="Run your chamber’s network on ComLinked"
        lead="Bring your members onto a company-to-company network that finds them leads from their first day."
      >
        <HeroLink href={paths.marketing.chamberPilot}>Request a pilot</HeroLink>
      </HeroCopy>
      <ActivityViewPanel />
    </PageHero>
  );
}

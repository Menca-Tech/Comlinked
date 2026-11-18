import { HeroCopy, HeroLink, PageHero } from "@/components/marketing/section";
import { paths } from "@/paths";

export function HowHeroSection() {
  return (
    <PageHero>
      <HeroCopy
        title="First leads today. Fresh leads every morning."
        lead="Claim your company’s profile, meet your first matches today, and come back each morning to new ones."
      >
        <HeroLink href={paths.marketing.join}>Find your company</HeroLink>
      </HeroCopy>
    </PageHero>
  );
}

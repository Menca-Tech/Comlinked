import { HeroNetworkRing } from "@/components/marketing/hero-network-ring";
import { HeroCopy, HeroLink, heroWithVisual, PageHero } from "@/components/marketing/section";
import { paths } from "@/paths";

export function HeroSection() {
  return (
    <PageHero contentClassName={heroWithVisual}>
      <HeroCopy
        className="max-[600px]:min-h-[calc(100svh-180px)]"
        title={
          <>
            Your first business leads <span className="text-cl-sky">within 24 hours.</span>
          </>
        }
        lead="Claim your company’s free profile and meet 3 matched companies on your first day, each with a reason to talk."
      >
        <div className="flex flex-col gap-3 min-[601px]:flex-row min-[601px]:flex-wrap [&>a]:self-stretch min-[601px]:[&>a]:self-auto">
          <HeroLink href={paths.marketing.join}>Join ComLinked free</HeroLink>
          <HeroLink href={paths.marketing.forChambers} outline>
            Bring ComLinked to your chamber
          </HeroLink>
        </div>
      </HeroCopy>
      <HeroNetworkRing />
    </PageHero>
  );
}

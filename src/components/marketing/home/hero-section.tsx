import Link from "next/link";

import { HeroNetworkRing } from "@/components/marketing/hero-network-ring";
import { PageHero } from "@/components/marketing/section";
import { paths } from "@/paths";

const heroButton =
  "cl-btn inline-flex h-13 items-center justify-center border px-6.5 py-0 font-sans text-[15px] font-bold no-underline";

export function HeroSection() {
  return (
    <PageHero contentClassName="grid items-center gap-12 py-16 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="flex min-w-0 flex-col justify-center max-[600px]:min-h-[calc(100svh-180px)]">
        <h1 className="cl-h1 mx-0 mt-0 mb-6 text-balance text-cl-paper">
          Your first business leads <span className="text-cl-sky">within 24 hours.</span>
        </h1>
        <p className="mx-0 mt-0 mb-8 max-w-[32em] text-[19px] leading-[30px] text-cl-on-night-78">
          Claim your company’s free profile and meet 3 matched companies on your first day, each
          with a reason to talk.
        </p>
        <div className="flex flex-col gap-3 min-[601px]:flex-row min-[601px]:flex-wrap">
          <Link
            className={`${heroButton} border-cl-paper bg-cl-paper text-cl-navy`}
            href={paths.marketing.join}
          >
            Join ComLinked free
          </Link>
          <Link
            className={`${heroButton} cl-btn-od border-cl-on-night-50 bg-transparent text-cl-paper`}
            href={paths.marketing.forChambers}
          >
            Bring ComLinked to your chamber
          </Link>
        </div>
      </div>
      <HeroNetworkRing />
    </PageHero>
  );
}

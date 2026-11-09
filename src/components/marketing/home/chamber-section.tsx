import Link from "next/link";

import { FirstChamber } from "@/components/marketing/first-chamber";
import { Section, SectionIntro } from "@/components/marketing/section";
import { paths } from "@/paths";

export function ChamberSection() {
  return (
    <Section tone="white">
      <SectionIntro title="A network for your members.">
        Chambers bring their members on board with a pilot: member import, intros and announcements.
      </SectionIntro>
      <Link
        className="inline-block py-2.5 text-[16px] font-bold"
        href={paths.marketing.forChambers}
      >
        See the chamber pilot
      </Link>
      <FirstChamber />
    </Section>
  );
}

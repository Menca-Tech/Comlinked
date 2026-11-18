import { cn } from "@/lib/utils";
import { ExampleTag, RingList, Section, SectionIntro } from "@/components/marketing/section";

const CLAIM_POINTS = [
  "A personal link by email or SMS. One tap to claim and confirm.",
  "We pre-build your profile from your website, Facebook page or public listings.",
  "A strength meter shows your next step, like adding your top 3 products.",
  "Not listed yet? Create your profile in about two minutes.",
];

const TAG_GROUPS = [
  {
    title: "What we offer",
    tags: ["Filipino snacks", "Frozen foods", "Private label"],
    accent: false,
  },
  {
    title: "What we’re looking for",
    tags: ["Grocery retailers", "Cold-chain freight", "Packaging"],
    accent: true,
  },
];

function ProfilePreview() {
  return (
    <div
      className="cl-card min-w-0 flex-[1.15_1_440px] overflow-hidden border border-cl-rule bg-cl-surface"
      role="group"
      aria-label="Example company profile"
    >
      <div className="flex flex-wrap items-center gap-4 border-b border-b-cl-rule p-6">
        <div
          className="grid h-14 w-14 flex-none place-items-center rounded-[8px] bg-cl-navy font-sans text-[15px] font-bold text-cl-paper"
          aria-hidden="true"
        >
          KF
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[22px] leading-[28px] text-cl-ink">Kalayaan Foods Inc.</div>
          <div className="text-[14px] leading-[20px] text-cl-muted">
            Food manufacturing, Quezon City
          </div>
        </div>
        <ExampleTag className="text-cl-muted" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {TAG_GROUPS.map(({ title, tags, accent }) => (
          <div className="border-b border-b-cl-rule px-6 py-5" key={title}>
            <div className="mb-2.5 font-sans text-[14px] leading-[16px] font-bold text-cl-muted">
              {title}
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {tags.map((tag) => (
                <li
                  className={cn(
                    "rounded-full border px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold",
                    accent
                      ? "border-cl-accent text-cl-accent-strong"
                      : "border-cl-rule text-cl-ink-2",
                  )}
                  key={tag}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="px-6 py-5">
        <div className="mb-2.5 font-sans text-[14px] leading-[16px] font-bold text-cl-muted">
          Products and services
        </div>
        <p className="m-0 text-[15px] leading-[23px] text-cl-ink-2">
          Banana chips, ube spreads, frozen lumpia, and private-label manufacturing for retailers.
        </p>
      </div>
    </div>
  );
}

export function ClaimSection() {
  return (
    <Section>
      <SectionIntro title="Claim your profile">
        One profile for the whole company: what you offer, what you’re looking for, and your
        products and services.
      </SectionIntro>
      <div className="flex flex-wrap items-start gap-x-14 gap-y-8">
        <div className="min-w-0 flex-[0.85_1_340px]">
          <RingList items={CLAIM_POINTS} />
        </div>
        <ProfilePreview />
      </div>
    </Section>
  );
}

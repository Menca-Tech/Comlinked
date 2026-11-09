import Link from "next/link";

import { JoinForm } from "@/components/marketing/join-form";
import { Section } from "@/components/marketing/section";
import { paths } from "@/paths";

const REASONS = [
  "Your first 3 matches appear as soon as you finish",
  "Every feature is free for every company",
  "Connections stay with your company, not the person",
];

export function JoinSection() {
  return (
    <Section id="join" className="pt-0">
      <div className="flex flex-wrap items-start gap-x-18 gap-y-10">
        <div className="min-w-0 flex-[1_1_360px]">
          <h2 className="cl-h2 mx-0 mt-0 mb-4 text-balance text-cl-ink">
            Claim your free profile.
          </h2>
          <p className="mx-0 mt-0 mb-6 text-[18px] leading-[28px] text-cl-ink-2">
            Your company may already have a profile waiting, built from its website and public
            listings. Claim it, or create one in about two minutes.
          </p>
          <ul className="m-0 list-none border-b border-b-cl-rule p-0">
            {REASONS.map((reason) => (
              <li
                className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2"
                key={reason}
              >
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cl-pad max-w-[520px] min-w-0 flex-[1_1_380px] border border-cl-rule bg-cl-surface p-9 text-cl-ink-2">
          <h3 className="mx-0 mt-0 mb-2 text-[30px] leading-[32px] text-cl-ink">
            Put your company on the map
          </h3>
          <p className="mx-0 mt-0 mb-7 text-[15px] leading-[22px] text-cl-muted">
            Create your company profile in about two minutes.
          </p>
          <JoinForm />
          <p className="mx-0 mt-3.5 mb-0 text-center text-[13px] leading-[19px] text-cl-muted">
            By joining you agree to the ComLinked <a href="#">User Agreement</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </p>
          <div className="mx-0 my-5.5 flex items-center gap-3.5 font-sans text-[14px] font-bold tracking-normal text-cl-muted">
            <span className="h-[1px] flex-1 bg-cl-rule" />
            or
            <span className="h-[1px] flex-1 bg-cl-rule" />
          </div>
          <Link
            className="cl-btn cl-btn-o flex h-13 w-full items-center justify-center border border-cl-ink bg-transparent tracking-normal text-cl-ink no-underline [font:700_15px_var(--font-text)]"
            href={paths.product.claim}
          >
            Claim an existing company profile
          </Link>
          <p className="mx-0 mt-5 mb-0 text-center text-[14px] leading-[20px]">
            Already on ComLinked? <Link href={paths.product.dash}>Sign in</Link>
          </p>
        </div>
      </div>
    </Section>
  );
}

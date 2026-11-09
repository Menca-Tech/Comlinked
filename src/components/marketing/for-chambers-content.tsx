import Link from "next/link";

import { paths } from "@/paths";

export function ForChambersContent() {
  return (
    <>
      <section className="cl-dark cl-rings-top-right text-cl-paper">
        <div className="cl-hero-pad mx-auto my-0 flex max-w-[1200px] flex-wrap items-start gap-16 px-5 pt-22 pb-26">
          <div className="min-w-0 flex-[1.1_1_460px]">
            <h1 className="cl-h1 mx-0 mt-6 mb-7 font-normal tracking-[-0.025em] text-balance text-cl-paper">
              Run your chamber’s network{" "}
              <span className="text-cl-sky not-italic">on ComLinked</span>
            </h1>
            <p className="mx-0 mt-0 mb-9 max-w-[32em] text-[19px] leading-[30px] text-cl-on-night-80">
              Bring your members onto a company-to-company network that finds them leads from their
              first day. Pilot chambers and their members join free.
            </p>
            <ul className="m-0 list-none border-t border-t-cl-on-night-14 p-0">
              <li className="flex gap-3.5 border-b border-b-cl-on-night-14 px-0 py-3.5 text-cl-on-night-88">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Import your member list; we build their profiles
              </li>
              <li className="flex gap-3.5 border-b border-b-cl-on-night-14 px-0 py-3.5 text-cl-on-night-88">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                See who has claimed, who is active, who needs an intro
              </li>
              <li className="flex gap-3.5 border-b border-b-cl-on-night-14 px-0 py-3.5 text-cl-on-night-88">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Introduce members and send announcements
              </li>
            </ul>
          </div>
          <div
            className="cl-pad min-w-0 flex-[0.9_1_360px] scroll-mt-22 border border-cl-rule bg-cl-surface p-9 text-cl-ink-2"
            id="pilot"
          >
            <div>
              <h2 className="mx-0 mt-0 mb-2 text-[30px] leading-[32px] font-normal tracking-[-0.02em] text-cl-ink">
                Talk to us about a chamber pilot
              </h2>
              <p className="mx-0 mt-0 mb-7 text-[15px] leading-[22px] text-cl-muted">
                Tell us about your chamber. We’ll follow up to plan a pilot with your members.
              </p>
              <div className="mb-4.5 flex flex-col gap-2">
                <label
                  className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                  htmlFor="chname"
                >
                  Chamber or association
                </label>
                <input
                  className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                  id="chname"
                  autoComplete="organization"
                />
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-3">
                <div className="mb-4.5 flex flex-col gap-2">
                  <label
                    className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                    htmlFor="pname"
                  >
                    Your name
                  </label>
                  <input
                    className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                    id="pname"
                    autoComplete="name"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-2">
                  <label
                    className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                    htmlFor="prole"
                  >
                    Your role
                  </label>
                  <input
                    className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                    id="prole"
                    placeholder="e.g. Executive Director"
                  />
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-3">
                <div className="mb-4.5 flex flex-col gap-2">
                  <label
                    className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                    htmlFor="members"
                  >
                    Member companies
                  </label>
                  <input
                    className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                    id="members"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="e.g. 150"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-2">
                  <label
                    className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                    htmlFor="pemail"
                  >
                    Work email
                  </label>
                  <input
                    className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                    id="pemail"
                    type="email"
                    autoComplete="email"
                    placeholder="you@yourchamber.org"
                  />
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-2">
                <label
                  className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                  htmlFor="msg"
                >
                  Message (optional)
                </label>
                <textarea
                  className="cl-fld w-full resize-y rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-3 text-cl-ink [font:400_16px_var(--font-text)]"
                  id="msg"
                  rows={3}
                ></textarea>
              </div>
              <button
                className="cl-btn flex h-13 w-full cursor-pointer items-center justify-center rounded-[8px] border border-cl-accent-strong bg-cl-accent-strong font-sans text-[13px] font-bold tracking-normal text-cl-surface"
                type="button"
              >
                Request a pilot
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-b-cl-rule px-0 py-14">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-center justify-between gap-x-14 gap-y-7 px-5 py-0">
          <div className="min-w-0 flex-[1_1_320px]">
            <div className="mb-3.5 font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
              <span
                className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                aria-hidden="true"
              ></span>
              Piloting with
            </div>
            <div className="text-[28px] leading-[32px] tracking-[-0.015em] text-cl-ink">
              <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">[PILOT CHAMBER]</span> pilot,
              2027
            </div>
          </div>
          <figure className="m-0 min-w-0 flex-[1.4_1_420px] border-l border-l-cl-rule pl-7">
            <blockquote className="mx-0 mt-0 mb-3 text-[22px] leading-[30px] text-cl-ink-2 not-italic">
              “
              <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">
                [QUOTE FROM CHAMBER LEADER]
              </span>
              ”
            </blockquote>
            <figcaption className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
              <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">[NAME]</span>,{" "}
              <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">[ROLE]</span>,{" "}
              <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">[PILOT CHAMBER]</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="cl-sec" id="how">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap gap-x-14 gap-y-6 px-5 py-0">
          <div className="min-w-0 flex-[0.7_1_300px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              How it works <span className="not-italic">for your chamber</span>
            </h2>
            <p className="m-0 text-[18px] leading-[28px]">
              Everything a chamber needs to run the pilot, with no setup fees and no custom tools to
              learn.
            </p>
          </div>
          <ol className="m-0 min-w-0 flex-[1.3_1_480px] list-none border-b border-b-cl-rule p-0">
            <li className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-t-cl-rule px-0 py-6.5">
              <span className="cl-pop0 font-sans text-[22px] leading-[28px] font-bold text-cl-accent-strong">
                01
              </span>
              <span>
                <span className="mb-1.5 block text-[22px] leading-[28px] tracking-[-0.01em] text-cl-ink">
                  Import your members
                </span>
                <span className="block text-[16px] leading-[25px]">
                  Upload your member list. We build each company’s profile and send them a claim
                  link.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-t-cl-rule px-0 py-6.5">
              <span className="cl-pop0 font-sans text-[22px] leading-[28px] font-bold text-cl-accent-strong">
                02
              </span>
              <span>
                <span className="mb-1.5 block text-[22px] leading-[28px] tracking-[-0.01em] text-cl-ink">
                  See who’s active
                </span>
                <span className="block text-[16px] leading-[25px]">
                  One screen shows who has claimed their profile, who is active, and who needs an
                  introduction.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-t-cl-rule px-0 py-6.5">
              <span className="cl-pop0 font-sans text-[22px] leading-[28px] font-bold text-cl-accent-strong">
                03
              </span>
              <span>
                <span className="mb-1.5 block text-[22px] leading-[28px] tracking-[-0.01em] text-cl-ink">
                  Make introductions
                </span>
                <span className="block text-[16px] leading-[25px]">
                  Introduce two members to each other, or send an announcement to every member.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-t-cl-rule px-0 py-6.5">
              <span className="cl-pop0 font-sans text-[22px] leading-[28px] font-bold text-cl-accent-strong">
                04
              </span>
              <span>
                <span className="mb-1.5 block text-[22px] leading-[28px] tracking-[-0.01em] text-cl-ink">
                  Community managers on hand
                </span>
                <span className="block text-[16px] leading-[25px]">
                  During the pilot, community managers hand-pick introductions so no member goes a
                  week without a lead.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-t-cl-rule px-0 py-6.5">
              <span className="cl-pop0 font-sans text-[22px] leading-[28px] font-bold text-cl-accent-strong">
                05
              </span>
              <span>
                <span className="mb-1.5 block text-[22px] leading-[28px] tracking-[-0.01em] text-cl-ink">
                  Recognize your most active members
                </span>
                <span className="block text-[16px] leading-[25px]">
                  A monthly list of your 10 most active companies. Recognition only, no prizes.
                </span>
              </span>
            </li>
          </ol>
        </div>
      </section>
      <section className="cl-sec pt-0">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-center gap-x-18 gap-y-8 px-5 py-0">
          <div className="min-w-0 flex-[1_1_360px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Free for pilot chambers.
            </h2>
            <p className="mx-0 mt-0 mb-7 text-[18px] leading-[28px]">
              Pilot chambers and their members join free. Every feature is open to every member
              company, with no tiers and no paywall.
            </p>
            <a
              className="cl-btn inline-flex h-13 items-center justify-center border border-cl-accent-strong bg-cl-accent-strong px-6.5 py-0 font-sans text-[15px] font-bold text-cl-surface no-underline"
              href="#pilot"
            >
              Request a pilot
            </a>
          </div>
          <div className="min-w-0 flex-[1_1_360px]">
            <ul className="m-0 list-none border-b border-b-cl-rule p-0">
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Member import and claim links by email or SMS</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>An activity view of claimed, active and quiet members</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Introductions and announcements to all members</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Community managers to make early intros</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>A monthly top-10 of your most active companies</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="px-0 pt-0 pb-28" id="faq">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap gap-x-14 gap-y-6 px-5 py-0">
          <h2 className="cl-h2 mx-0 mt-0 mb-4 flex-[0.6_1_280px] font-normal tracking-[-0.025em] text-balance text-cl-ink">
            Questions from <span className="not-italic">chambers</span>
          </h2>
          <div className="min-w-0 flex-[1.4_1_480px] border-b border-b-cl-rule">
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                How long does a pilot take?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">
                  [CONFIRM: pilot length and start date]
                </span>
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                Do our members pay?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                No. Every feature is open to every member company, free, with no paywall.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                What do you need from us?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                Your member list, and a contact who can help us welcome members.{" "}
                <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">
                  [CONFIRM: what pilot chambers provide]
                </span>
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                Can members see each other’s names?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                Yes. ComLinked shows which companies viewed or searched for you, by name. Sign-up
                tells every company that profile views are visible to others.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                How is member data protected?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">
                  [CONFIRM: how company data is protected, including from scraping]
                </span>
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="cl-dark cl-rings-bottom-8 px-0 pt-32 pb-28 text-cl-paper">
        <div className="cl-in cl-cta-pad mx-auto my-0 max-w-[1200px] px-5 py-0">
          <h2 className="cl-hxl mx-0 mt-0 mb-18 max-w-[16em] font-normal tracking-[-0.035em] text-balance text-cl-paper">
            Build connections <span className="not-italic">your members keep.</span>
          </h2>
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-t border-t-cl-on-night-24 pt-8">
            <ul className="m-0 max-w-[560px] flex-[1_1_360px] list-none border-b border-b-cl-on-night-14 p-0 font-sans text-[12px] leading-[18px] font-bold tracking-normal text-cl-on-night-82">
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Member import and claim links
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Intros and announcements
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Free for pilot chambers
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                className="cl-btn inline-flex h-14 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-ink no-underline"
                href="#pilot"
              >
                Request a pilot
              </a>
              <Link
                className="cl-btn cl-btn-od inline-flex h-14 items-center justify-center border border-cl-on-night-50 bg-transparent px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-paper no-underline"
                href={paths.marketing.howItWorks}
              >
                See how it works for companies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

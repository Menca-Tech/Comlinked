import Link from "next/link";

import { paths } from "@/paths";

export function ComDashContent() {
  return (
    <>
      <section className="cl-dark cl-rings-top-right text-cl-paper">
        <div className="cl-in cl-hero-pad mx-auto my-0 flex max-w-[1200px] flex-wrap items-center gap-14 px-5 pt-24 pb-26">
          <div className="min-w-0 flex-[0.9_1_360px]">
            <h1 className="cl-h1 mx-0 mt-6 mb-7 font-normal tracking-[-0.025em] text-balance text-cl-paper">
              See who’s finding you <span className="text-cl-sky not-italic">on ComDash</span>
            </h1>
            <p className="mx-0 mt-0 mb-8 text-[19px] leading-[30px] text-cl-on-night-80">
              Your company dashboard shows who is looking at you, by name, and where you rank in
              search.
            </p>
            <div>
              <Link
                className="cl-btn inline-flex h-13 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-6 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-ink no-underline"
                href={paths.marketing.join}
              >
                Join ComLinked free
              </Link>
            </div>
          </div>
          <div
            className="min-w-0 flex-[1.1_1_440px] border border-cl-on-night-14 bg-cl-night-raised"
            aria-label="Example ComDash"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-b-cl-on-night-14 px-5 py-4 font-sans text-[14px] leading-[16px] font-bold tracking-normal">
              <span className="text-cl-paper">ComDash for Kalayaan Foods Inc.</span>
              <span className="rounded-full border border-cl-sky px-3 py-1 text-cl-sky-strong">
                Last 30 days
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
              <div className="min-w-0 border-r border-b border-r-cl-on-night-14 border-b-cl-on-night-14 px-5 py-5.5">
                <div className="text-[52px] leading-[52px] font-normal tracking-[-0.03em] text-cl-sky tabular-nums">
                  312
                </div>
                <div className="mt-2.5 font-sans text-[13px] leading-[15px] font-bold tracking-normal text-cl-on-night-72">
                  Appeared in searches
                </div>
                <div className="mt-1 font-sans text-[14px] leading-[16px] font-bold text-cl-paper">
                  ▲ 18%
                </div>
              </div>
              <div className="min-w-0 border-r border-b border-r-cl-on-night-14 border-b-cl-on-night-14 px-5 py-5.5">
                <div className="text-[52px] leading-[52px] font-normal tracking-[-0.03em] text-cl-sky tabular-nums">
                  87
                </div>
                <div className="mt-2.5 font-sans text-[13px] leading-[15px] font-bold tracking-normal text-cl-on-night-72">
                  Profile views
                </div>
                <div className="mt-1 font-sans text-[14px] leading-[16px] font-bold text-cl-paper">
                  ▲ 9%
                </div>
              </div>
              <div className="min-w-0 border-b border-b-cl-on-night-14 px-5 py-5.5">
                <div className="text-[52px] leading-[52px] font-normal tracking-[-0.03em] text-cl-sky tabular-nums">
                  41
                </div>
                <div className="mt-2.5 font-sans text-[13px] leading-[15px] font-bold tracking-normal text-cl-on-night-72">
                  Recommended as a match
                </div>
                <div className="mt-1 font-sans text-[14px] leading-[16px] font-bold text-cl-paper">
                  ▲ 26%
                </div>
              </div>
            </div>
            <div className="px-5 pt-1.5 pb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 border-b border-b-cl-on-night-14 px-0 py-4">
                <span className="text-[15px] leading-[22px] text-cl-paper">
                  <strong className="text-[22px] font-extrabold text-cl-sky-strong">#4</strong> of
                  37 in Food Suppliers, Quezon City
                </span>
                <span className="text-[14px] leading-[20px] text-cl-on-night-82">
                  Next: reply to Maple Bay Grocers today
                </span>
              </div>
              <div className="mx-0 mt-4 mb-1.5 font-sans text-[13px] leading-[15px] font-bold tracking-normal text-cl-on-night-72">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Suggested connections
              </div>
              <div className="cl-mrow flex items-center gap-3.5 border-b border-b-cl-on-night-14 px-0 py-3 [transition-delay:0.7s]">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-[4px] border border-cl-on-night-14 bg-cl-night-chip font-sans text-[12px] font-bold tracking-normal text-cl-paper">
                  MB
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-[22px] text-cl-paper">Maple Bay Grocers</div>
                  <div className="text-[13px] leading-[19px] text-cl-on-night-72">
                    Customer, Quezon City, stocks Filipino specialty foods
                  </div>
                </div>
                <span className="font-sans text-[12px] font-bold tracking-normal whitespace-nowrap text-cl-sky-strong">
                  92 fit
                </span>
              </div>
              <div className="cl-mrow flex items-center gap-3.5 border-b border-b-cl-on-night-14 px-0 py-3 [transition-delay:0.82s]">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-[4px] border border-cl-on-night-14 bg-cl-night-chip font-sans text-[12px] font-bold tracking-normal text-cl-paper">
                  PP
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-[22px] text-cl-paper">
                    Pacific Pack Solutions
                  </div>
                  <div className="text-[13px] leading-[19px] text-cl-on-night-72">
                    Supplier, Pasig City, food-grade packaging
                  </div>
                </div>
                <span className="font-sans text-[12px] font-bold tracking-normal whitespace-nowrap text-cl-sky-strong">
                  88 fit
                </span>
              </div>
              <div className="cl-mrow flex items-center gap-3.5 px-0 py-3 [transition-delay:0.94s]">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-[4px] border border-cl-on-night-14 bg-cl-night-chip font-sans text-[12px] font-bold tracking-normal text-cl-paper">
                  NL
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-[22px] text-cl-paper">
                    Northline Logistics
                  </div>
                  <div className="text-[13px] leading-[19px] text-cl-on-night-72">
                    Vendor, Valenzuela City, cold-chain freight
                  </div>
                </div>
                <span className="font-sans text-[12px] font-bold tracking-normal whitespace-nowrap text-cl-sky-strong">
                  81 fit
                </span>
              </div>
            </div>
            <div className="px-5 pt-0 pb-3.5 text-right font-sans text-[13px] leading-[15px] font-bold tracking-normal text-cl-on-night-72">
              Example data
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-start gap-x-18 gap-y-10 px-5 py-0">
          <div className="min-w-0 flex-[1_1_360px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Who’s interested, by name.
            </h2>
            <p className="mx-0 mt-0 mb-6 text-[18px] leading-[28px]">
              Every signal shows the company behind it. Nothing is blurred, and it’s free.
            </p>
            <ul className="m-0 list-none border-b border-b-cl-rule p-0">
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>
                  Companies that found you in search, and which of your tags they searched
                </span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Companies that viewed your profile</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Companies that messaged you in ComMail</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Companies that were recommended your company</span>
              </li>
            </ul>
          </div>
          <div className="cl-card min-w-0 flex-[1_1_380px] border border-cl-rule bg-cl-surface p-7">
            <div className="mb-2 font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
              <span
                className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                aria-hidden="true"
              ></span>
              Who found you this week
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-t-cl-sunken px-0 py-3.5">
              <span className="min-w-0">
                <span className="block text-[16px] leading-[22px] text-cl-ink">
                  Maple Bay Grocers
                </span>
                <span className="block text-[13px] leading-[19px] text-cl-muted">
                  Grocery retail, Quezon City
                </span>
              </span>
              <span className="font-sans text-[14px] font-bold tracking-normal whitespace-nowrap text-cl-accent-strong">
                Search: snacks
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-t-cl-sunken px-0 py-3.5">
              <span className="min-w-0">
                <span className="block text-[16px] leading-[22px] text-cl-ink">
                  Pacific Pack Solutions
                </span>
                <span className="block text-[13px] leading-[19px] text-cl-muted">
                  Food-grade packaging, Pasig City
                </span>
              </span>
              <span className="font-sans text-[14px] font-bold tracking-normal whitespace-nowrap text-cl-accent-strong">
                Viewed profile
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-t-cl-sunken px-0 py-3.5">
              <span className="min-w-0">
                <span className="block text-[16px] leading-[22px] text-cl-ink">
                  Northline Logistics
                </span>
                <span className="block text-[13px] leading-[19px] text-cl-muted">
                  Cold-chain freight, Valenzuela City
                </span>
              </span>
              <span className="font-sans text-[14px] font-bold tracking-normal whitespace-nowrap text-cl-accent-strong">
                Recommended
              </span>
            </div>
            <div className="border-t border-t-cl-sunken pt-2.5 text-right font-sans text-[13px] text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
              Example data
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec pt-0">
        <div className="cl-in mx-auto my-0 max-w-[1200px] px-5 py-0">
          <div className="mb-10 max-w-[700px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Climb by being active.
            </h2>
            <p className="m-0 text-[18px] leading-[28px]">
              Search shows the most relevant companies first. Among them, the active ones rank
              higher, so every action today brings more views tomorrow.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
            <div className="cl-card min-w-0 border border-cl-rule bg-cl-surface p-7">
              <h3 className="mx-0 mt-0 mb-3 text-[22px] leading-[28px] font-normal text-cl-ink">
                What raises your rank
              </h3>
              <ul className="m-0 list-none border-b border-b-cl-rule p-0">
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Act on your daily lead list</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Keep your profile fresh with new products, projects or photos</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Reply to ComMail within a day</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Post an ask, or answer someone else’s</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Confirm meetings and deals with the other company</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Post a testimonial after a deal</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Invite partners who join</span>
                </li>
              </ul>
            </div>
            <div className="cl-card min-w-0 border border-cl-accent-strong bg-cl-accent-tint p-7">
              <h3 className="mx-0 mt-0 mb-3 text-[22px] leading-[28px] font-normal text-cl-ink">
                Fair for everyone
              </h3>
              <ul className="m-0 list-none border-b border-b-cl-rule p-0">
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>
                    Relevance always comes first: an inactive packaging company still shows up in a
                    packaging search
                  </span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>
                    New companies get the same 30-day boost, so they can be found right away
                  </span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>Meetings and deals count only when both companies confirm</span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>
                    Daily limits stop anyone climbing by spamming, and unusual spikes are reviewed
                  </span>
                </li>
                <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[15px] leading-[25px] text-cl-ink-2">
                  <span
                    className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                    aria-hidden="true"
                  ></span>
                  <span>
                    Your score covers the last 30 days, so it reflects how you use ComLinked now
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="cl-dark cl-rings-bottom-8 px-0 pt-32 pb-28 text-cl-paper">
        <div className="cl-in cl-cta-pad mx-auto my-0 max-w-[1200px] px-5 py-0">
          <h2 className="cl-hxl mx-0 mt-0 mb-18 max-w-[16em] font-normal tracking-[-0.035em] text-balance text-cl-paper">
            See who’s <span className="not-italic">finding your company.</span>
          </h2>
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-t border-t-cl-on-night-24 pt-8">
            <ul className="m-0 max-w-[560px] flex-[1_1_360px] list-none border-b border-b-cl-on-night-14 p-0 font-sans text-[12px] leading-[18px] font-bold tracking-normal text-cl-on-night-82">
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Interest signals with company names
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Your rank in your industry’s searches
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                The next step worth the most
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                className="cl-btn inline-flex h-14 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-ink no-underline"
                href={paths.marketing.join}
              >
                Join ComLinked free
              </Link>
              <Link
                className="cl-btn cl-btn-od inline-flex h-14 items-center justify-center border border-cl-on-night-50 bg-transparent px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-paper no-underline"
                href={paths.marketing.howItWorks}
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

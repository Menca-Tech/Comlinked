import Link from "next/link";

import { paths } from "@/paths";

export function HomeContent() {
  return (
    <>
      <section className="cl-dark cl-rings-top-right text-cl-paper">
        <div className="cl-hero-pad mx-auto my-0 flex max-w-[1200px] flex-wrap items-center gap-16 px-5 pt-22 pb-26">
          <div className="min-w-0 flex-[1.15_1_460px]">
            <h1 className="cl-h1 mx-0 mt-6 mb-7 font-normal tracking-[-0.025em] text-balance text-cl-paper">
              Your first business leads{" "}
              <span className="text-cl-sky not-italic">within 24 hours.</span>
            </h1>
            <p className="mx-0 mt-0 mb-8 max-w-[32em] text-[19px] leading-[30px] text-cl-on-night-78">
              Claim your company’s free profile and meet 3 matched companies on your first day, each
              with a reason to talk.
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2.5 p-0 font-sans text-[12px] leading-[18px] font-bold tracking-normal text-cl-on-night-80">
              <li>
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Free for every company
              </li>
              <li>
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                3 matched companies on day one
              </li>
              <li>
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Connections stay with your company
              </li>
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                className="cl-btn inline-flex h-13 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-6.5 py-0 font-sans text-[15px] font-bold text-cl-ink no-underline"
                href="#join"
              >
                Join ComLinked free
              </a>
              <Link
                className="cl-btn cl-btn-od inline-flex h-13 items-center justify-center border border-cl-on-night-50 bg-transparent px-6.5 py-0 font-sans text-[15px] font-bold text-cl-paper no-underline"
                href={paths.marketing.howItWorks}
              >
                See how it works
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-[0.85_1_380px]">
            <div
              className="ml-auto max-w-[560px] rounded-[16px] border border-cl-on-night-14 bg-cl-night-raised px-6 pt-5.5 pb-2"
              role="group"
              aria-label="Example of your first day on ComLinked"
            >
              <div className="flex items-baseline justify-between gap-3 pb-3.5">
                <span className="text-[18px] leading-[24px] font-extrabold text-cl-paper">
                  Your first day
                </span>
                <span className="text-[13px] text-cl-on-night-72">Example</span>
              </div>
              <div className="mb-2 flex items-center gap-2.5 rounded-[10px] bg-cl-ring-20 px-3.5 py-3 text-[14px] leading-[20px] text-cl-paper">
                <span
                  className="cl-ring-sky-strong inline-block h-[11px] w-[11px] flex-none rounded-full"
                  aria-hidden="true"
                ></span>
                <span>
                  <strong>Luntian Foods Inc.</strong> viewed your profile today
                </span>
              </div>
              <div className="px-0 pt-2.5 pb-1.5 text-[14px] leading-[20px] font-bold text-cl-on-night-82">
                3 matched companies
              </div>
              <ul className="m-0 list-none p-0">
                <li className="flex gap-3.5 border-t border-t-cl-on-night-14 px-0 py-4">
                  <span
                    className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border border-cl-on-night-14 bg-cl-night-chip text-[13px] font-extrabold text-cl-paper"
                    aria-hidden="true"
                  >
                    MB
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
                      <span className="text-[16px] leading-[22px] font-bold text-cl-paper">
                        Maple Bay Grocers
                      </span>
                      <span className="text-[13px] leading-[22px] text-cl-on-night-72">
                        Grocery retail, Quezon City
                      </span>
                    </div>
                    <p className="mx-0 mt-1 mb-3 text-[14px] leading-[21px] text-cl-on-night-82">
                      Why meet: Stocks Filipino snacks and is looking for new suppliers.
                    </p>
                    <div className="flex flex-wrap gap-2" aria-hidden="true">
                      <span className="inline-flex h-8 items-center rounded-full border border-cl-sky-strong bg-cl-sky-strong px-3.5 py-0 text-[13px] font-bold text-cl-ink">
                        Connect
                      </span>
                      <span className="inline-flex h-8 items-center rounded-full border border-cl-on-night-50 bg-transparent px-3.5 py-0 text-[13px] font-bold text-cl-paper">
                        Message
                      </span>
                      <span className="inline-flex h-8 items-center rounded-full border border-[transparent] bg-transparent px-3.5 py-0 text-[13px] font-bold text-cl-on-night-72">
                        Skip
                      </span>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3.5 border-t border-t-cl-on-night-14 px-0 py-4">
                  <span
                    className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border border-cl-on-night-14 bg-cl-night-chip text-[13px] font-extrabold text-cl-paper"
                    aria-hidden="true"
                  >
                    PP
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
                      <span className="text-[16px] leading-[22px] font-bold text-cl-paper">
                        Pacific Pack Solutions
                      </span>
                      <span className="text-[13px] leading-[22px] text-cl-on-night-72">
                        Packaging, Pasig City
                      </span>
                    </div>
                    <p className="mx-0 mt-1 mb-3 text-[14px] leading-[21px] text-cl-on-night-82">
                      Why meet: Makes food-grade packaging for products like yours.
                    </p>
                    <div className="flex flex-wrap gap-2" aria-hidden="true">
                      <span className="inline-flex h-8 items-center rounded-full border border-cl-sky-strong bg-cl-sky-strong px-3.5 py-0 text-[13px] font-bold text-cl-ink">
                        Connect
                      </span>
                      <span className="inline-flex h-8 items-center rounded-full border border-cl-on-night-50 bg-transparent px-3.5 py-0 text-[13px] font-bold text-cl-paper">
                        Message
                      </span>
                      <span className="inline-flex h-8 items-center rounded-full border border-[transparent] bg-transparent px-3.5 py-0 text-[13px] font-bold text-cl-on-night-72">
                        Skip
                      </span>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3.5 border-t border-t-cl-on-night-14 px-0 py-4">
                  <span
                    className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border border-cl-on-night-14 bg-cl-night-chip text-[13px] font-extrabold text-cl-paper"
                    aria-hidden="true"
                  >
                    NL
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
                      <span className="text-[16px] leading-[22px] font-bold text-cl-paper">
                        Northline Logistics
                      </span>
                      <span className="text-[13px] leading-[22px] text-cl-on-night-72">
                        Cold-chain freight, Valenzuela City
                      </span>
                    </div>
                    <p className="mx-0 mt-1 mb-3 text-[14px] leading-[21px] text-cl-on-night-82">
                      Why meet: Delivers chilled goods across Metro Manila.
                    </p>
                    <div className="flex flex-wrap gap-2" aria-hidden="true">
                      <span className="inline-flex h-8 items-center rounded-full border border-cl-sky-strong bg-cl-sky-strong px-3.5 py-0 text-[13px] font-bold text-cl-ink">
                        Connect
                      </span>
                      <span className="inline-flex h-8 items-center rounded-full border border-cl-on-night-50 bg-transparent px-3.5 py-0 text-[13px] font-bold text-cl-paper">
                        Message
                      </span>
                      <span className="inline-flex h-8 items-center rounded-full border border-[transparent] bg-transparent px-3.5 py-0 text-[13px] font-bold text-cl-on-night-72">
                        Skip
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec">
        <div className="cl-in mx-auto my-0 max-w-[1200px] px-5 py-0">
          <div className="mb-11 max-w-[700px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              When people leave, <span className="not-italic">relationships shouldn’t.</span>
            </h2>
            <p className="m-0 text-[18px] leading-[28px]">
              On personal networks, connections belong to the employee. On ComLinked, they belong to
              the company, and any authorized representative can pick them up.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
            <div className="cl-card cl-pad min-w-0 border border-cl-rule bg-cl-surface p-8">
              <span className="mb-4.5 inline-block rounded-full border border-cl-rule px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-muted">
                Personal networks
              </span>
              <h3 className="mx-0 mt-0 mb-2 text-[24px] leading-[28px] font-normal tracking-[-0.015em] text-cl-ink">
                Your sales lead resigns
              </h3>
              <p className="mx-0 mt-0 mb-6 text-[16px] leading-[25px]">
                Their 400 supplier and client contacts go with them. Your company starts over.
              </p>
              <svg className="block h-auto w-full" aria-hidden="true" viewBox="0 0 300 90">
                <g
                  className="cl-brk [stroke:var(--color-cl-rule)]"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                >
                  <line x1="60" y1="45" x2="160" y2="20" />
                  <line x1="60" y1="45" x2="160" y2="70" />
                  <line x1="60" y1="45" x2="250" y2="45" />
                </g>
                <rect
                  className="[fill:var(--color-cl-sunken)] [stroke:var(--color-cl-grey)]"
                  rx="18"
                  x="42"
                  y="27"
                  width="36"
                  height="36"
                  strokeWidth="1.5"
                />
                <rect
                  className="cl-lost [fill:var(--color-cl-surface)] [stroke:var(--color-cl-grey)]"
                  rx="10"
                  x="150"
                  y="10"
                  width="20"
                  height="20"
                  strokeWidth="1.5"
                />
                <rect
                  className="cl-lost [fill:var(--color-cl-surface)] [stroke:var(--color-cl-grey)]"
                  rx="10"
                  x="150"
                  y="60"
                  width="20"
                  height="20"
                  strokeWidth="1.5"
                />
                <rect
                  className="cl-lost [fill:var(--color-cl-surface)] [stroke:var(--color-cl-grey)]"
                  rx="10"
                  x="240"
                  y="35"
                  width="20"
                  height="20"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="cl-card cl-pad min-w-0 border border-cl-rule bg-cl-surface p-8">
              <span className="mb-4.5 inline-block rounded-full border border-cl-accent px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-accent-strong">
                ComLinked
              </span>
              <h3 className="mx-0 mt-0 mb-2 text-[24px] leading-[28px] font-normal tracking-[-0.015em] text-cl-ink">
                Your sales lead resigns
              </h3>
              <p className="mx-0 mt-0 mb-6 text-[16px] leading-[25px]">
                Every company connection stays on your profile. Assign a new rep and keep selling.
              </p>
              <svg className="block h-auto w-full" aria-hidden="true" viewBox="0 0 300 90">
                <g className="[stroke:var(--color-cl-sky)]" strokeWidth="2" strokeLinecap="square">
                  <line className="cl-drw" x1="60" y1="45" x2="160" y2="20" />
                  <line
                    className="cl-drw [transition-delay:0.65s]"
                    x1="60"
                    y1="45"
                    x2="160"
                    y2="70"
                  />
                  <line
                    className="cl-drw [transition-delay:0.8s]"
                    x1="60"
                    y1="45"
                    x2="250"
                    y2="45"
                  />
                </g>
                <rect
                  className="[fill:var(--color-cl-accent)]"
                  rx="20"
                  x="40"
                  y="25"
                  width="40"
                  height="40"
                />
                <rect
                  className="[fill:var(--color-cl-surface)] [stroke:var(--color-cl-sky)]"
                  rx="10"
                  x="150"
                  y="10"
                  width="20"
                  height="20"
                  strokeWidth="2"
                />
                <rect
                  className="[fill:var(--color-cl-surface)] [stroke:var(--color-cl-sky)]"
                  rx="10"
                  x="150"
                  y="60"
                  width="20"
                  height="20"
                  strokeWidth="2"
                />
                <rect
                  className="[fill:var(--color-cl-surface)] [stroke:var(--color-cl-sky)]"
                  rx="10"
                  x="240"
                  y="35"
                  width="20"
                  height="20"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec cl-dark cl-rings-bottom-left text-cl-paper">
        <div className="cl-in mx-auto my-0 max-w-[1200px] px-5 py-0">
          <h2 className="cl-h2 mx-0 mt-0 mb-12 max-w-[14em] font-normal tracking-[-0.025em] text-balance text-cl-paper">
            One network, <span className="not-italic">three ways in.</span>
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-10 gap-y-0">
            <div className="flex min-w-0 flex-col border-t border-t-cl-on-night-24 px-0 pt-8 pb-2">
              <h3 className="mx-0 mt-4.5 mb-3.5 text-[34px] leading-[36px] font-normal tracking-[-0.02em] text-cl-paper">
                Leads today, and every morning.
              </h3>
              <p className="mx-0 mt-0 mb-6 flex-1 text-[16px] leading-[25px] text-cl-on-night-78">
                Claim your profile, meet 3 matches on your first day, then get a fresh lead list
                each morning.
              </p>
              <Link
                className="cl-navl self-start border-b border-b-cl-sky px-0 py-2.5 font-sans text-[12px] font-bold tracking-normal text-cl-sky-strong no-underline"
                href={paths.marketing.howItWorks}
              >
                See how it works
              </Link>
            </div>
            <div className="flex min-w-0 flex-col border-t border-t-cl-on-night-24 px-0 pt-8 pb-2">
              <h3 className="mx-0 mt-4.5 mb-3.5 text-[34px] leading-[36px] font-normal tracking-[-0.02em] text-cl-paper">
                See who’s interested, by name.
              </h3>
              <p className="mx-0 mt-0 mb-6 flex-1 text-[16px] leading-[25px] text-cl-on-night-78">
                Who searched for you, viewed you or messaged you, plus where you rank in search.
              </p>
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-[56px] leading-[52px] tracking-[-0.03em] text-cl-sky">
                  312
                </span>
                <span className="font-sans text-[13px] text-[14px] leading-[16px] font-bold tracking-normal text-cl-on-night-72">
                  appeared in searches
                  <br />
                  example data
                </span>
              </div>
              <Link
                className="cl-navl self-start border-b border-b-cl-sky px-0 py-2.5 font-sans text-[12px] font-bold tracking-normal text-cl-sky-strong no-underline"
                href={paths.marketing.comDash}
              >
                Explore ComDash
              </Link>
            </div>
            <div className="flex min-w-0 flex-col border-t border-t-cl-on-night-24 px-0 pt-8 pb-2">
              <h3 className="mx-0 mt-4.5 mb-3.5 text-[34px] leading-[36px] font-normal tracking-[-0.02em] text-cl-paper">
                A network for your members.
              </h3>
              <p className="mx-0 mt-0 mb-6 flex-1 text-[16px] leading-[25px] text-cl-on-night-78">
                Chambers bring their members on board with a pilot: member import, intros and
                announcements.
              </p>
              <Link
                className="cl-navl self-start border-b border-b-cl-sky px-0 py-2.5 font-sans text-[12px] font-bold tracking-normal text-cl-sky-strong no-underline"
                href={paths.marketing.forChambers}
              >
                See the chamber pilot
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-start gap-14 px-5 py-0">
          <div className="min-w-0 flex-[0.85_1_340px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              What your company profile <span className="not-italic">shows</span>
            </h2>
            <p className="mx-0 mt-0 mb-6 text-[18px] leading-[28px]">
              One profile for the whole company: what you offer, what you’re looking for, and your
              products and services. ComLinked turns what you’re looking for into tags, so the right
              companies find you.
            </p>
            <p className="m-0 border-t border-t-cl-rule pt-4.5 text-[16px] leading-[25px]">
              <span className="mb-1.5 block font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-accent-strong">
                ComMail
              </span>
              Message other companies inside ComLinked. Every message is also sent to your company’s
              registered email, so nothing gets missed.
            </p>
          </div>
          <div
            className="cl-card min-w-0 flex-[1.15_1_440px] border border-cl-rule bg-cl-surface"
            aria-label="Example company profile"
          >
            <div className="flex flex-wrap items-center gap-4 border-b border-b-cl-rule p-6">
              <div className="grid h-14 w-14 flex-none place-items-center rounded-[4px] bg-cl-night font-sans text-[15px] font-bold tracking-normal text-cl-paper">
                KF
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[24px] leading-[28px] tracking-[-0.015em] text-cl-ink">
                  Kalayaan Foods Inc.
                </div>
                <div className="text-[14px] leading-[20px] text-cl-muted">
                  Food manufacturing, Quezon City
                </div>
              </div>
              <span className="inline-block rounded-full border border-cl-accent px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-accent-strong">
                ✓ Verified
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
              <div className="border-r border-b border-r-cl-rule border-b-cl-rule px-6 py-5">
                <div className="mb-2.5 font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
                  What we offer
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-block rounded-full border border-cl-rule px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-ink-2">
                    Filipino snacks
                  </span>
                  <span className="inline-block rounded-full border border-cl-rule px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-ink-2">
                    Frozen foods
                  </span>
                  <span className="inline-block rounded-full border border-cl-rule px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-ink-2">
                    Private label
                  </span>
                </div>
              </div>
              <div className="border-b border-b-cl-rule px-6 py-5">
                <div className="mb-2.5 font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
                  What we’re looking for
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-block rounded-full border border-cl-accent px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-accent-strong">
                    Grocery retailers
                  </span>
                  <span className="inline-block rounded-full border border-cl-accent px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-accent-strong">
                    Cold-chain freight
                  </span>
                  <span className="inline-block rounded-full border border-cl-accent px-3 py-[5px] font-sans text-[13px] leading-[14px] font-bold tracking-normal text-cl-accent-strong">
                    Packaging
                  </span>
                </div>
              </div>
            </div>
            <div className="border-b border-b-cl-rule px-6 py-5">
              <div className="mb-2.5 font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
                Products and services
              </div>
              <div className="text-[15px] leading-[23px] text-cl-ink-2">
                Banana chips, ube spreads, frozen lumpia, and private-label manufacturing for
                retailers.
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="mb-2.5 flex justify-between font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
                <span>Profile strength</span>
                <span className="text-cl-accent-strong">80%</span>
              </div>
              <div className="h-1.5 bg-cl-sunken">
                <div className="h-1.5 w-[80%] bg-cl-accent-strong"></div>
              </div>
              <div className="mt-2.5 text-[14px] leading-[20px] text-cl-ink-2">
                Next step: add your top 3 products, +15%
              </div>
            </div>
            <div className="px-6 pt-0 pb-3.5 text-right font-sans text-[13px] text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted">
              Example data
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec pt-0">
        <div className="cl-in mx-auto my-0 max-w-[1200px] px-5 py-0">
          <div className="mb-9 max-w-[700px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Real companies <span className="not-italic">only.</span>
            </h2>
            <p className="m-0 text-[18px] leading-[28px]">
              ComLinked is a network of companies, so every profile, connection and message is tied
              to a real business.
            </p>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-10 p-0">
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6">
              <span
                className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                aria-hidden="true"
              ></span>
              <span>
                <span className="mb-1 block text-[20px] leading-[26px] tracking-[-0.01em] text-cl-ink">
                  Companies only
                </span>
                <span className="block text-[15px] leading-[23px]">
                  No personal profiles, multi-level marketing or one-person sellers.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6">
              <span
                className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                aria-hidden="true"
              ></span>
              <span>
                <span className="mb-1 block text-[20px] leading-[26px] tracking-[-0.01em] text-cl-ink">
                  Verified when claimed
                </span>
                <span className="block text-[15px] leading-[23px]">
                  A company that claims its profile gets a Verified badge.{" "}
                  <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">
                    [CONFIRM: how claims are verified]
                  </span>
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6">
              <span
                className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                aria-hidden="true"
              ></span>
              <span>
                <span className="mb-1 block text-[20px] leading-[26px] tracking-[-0.01em] text-cl-ink">
                  Both sides agree
                </span>
                <span className="block text-[15px] leading-[23px]">
                  A connection is made only when an authorized rep on each side accepts it.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6">
              <span
                className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                aria-hidden="true"
              ></span>
              <span>
                <span className="mb-1 block text-[20px] leading-[26px] tracking-[-0.01em] text-cl-ink">
                  Chamber groups stay separate
                </span>
                <span className="block text-[15px] leading-[23px]">
                  Each chamber’s network is kept apart from the others.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-t-cl-rule px-0 py-6">
              <span
                className="font-sans text-[18px] leading-[26px] font-bold text-cl-accent-strong"
                aria-hidden="true"
              >
                ?
              </span>
              <span>
                <span className="mb-1 block text-[20px] leading-[26px] tracking-[-0.01em] text-cl-ink">
                  Your data is protected
                </span>
                <span className="block text-[15px] leading-[23px]">
                  <span className="bg-cl-slot px-1 py-0 text-cl-slot-ink">
                    [CONFIRM: how company data is protected, including from scraping]
                  </span>
                </span>
              </span>
            </li>
          </ul>
        </div>
      </section>
      <section className="cl-sec pt-0" id="free">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-start gap-x-18 gap-y-8 px-5 py-0">
          <div className="min-w-0 flex-[0.8_1_320px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Free for every company.
            </h2>
            <p className="mx-0 mt-0 mb-7 text-[18px] leading-[28px]">
              Every feature is open to every company. No tiers, no paywall, and company names are
              never hidden.
            </p>
            <a
              className="cl-btn inline-flex h-13 items-center justify-center border border-cl-accent-strong bg-cl-accent-strong px-6.5 py-0 font-sans text-[15px] font-bold text-cl-surface no-underline"
              href="#join"
            >
              Join ComLinked free
            </a>
            <p className="mx-0 mt-5 mb-0 text-[16px] leading-[25px]">
              Running a chamber or association?{" "}
              <Link href={paths.marketing.chamberPilot}>See the chamber pilot</Link>.
            </p>
          </div>
          <div className="min-w-0 flex-[1.2_1_420px]">
            <ul className="m-0 list-none border-b border-b-cl-rule p-0">
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Your company profile, pre-built from public information</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>3 matched companies on day one, and 5 new leads every morning</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>ComDash: who found you, viewed you and messaged you, by name</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>ComMail, with ready-made templates for intros and quotes</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>The AI Assistant, which drafts for you and never sends on its own</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>The Asks board, to post what your company needs</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="cl-sec pt-0">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-start gap-x-18 gap-y-10 px-5 py-0">
          <div className="min-w-0 flex-[1_1_360px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Claim your free profile.
            </h2>
            <p className="mx-0 mt-0 mb-6 text-[18px] leading-[28px]">
              Your company may already have a profile waiting, built from its website and public
              listings. Claim it, or create one in about two minutes.
            </p>
            <ul className="m-0 list-none border-b border-b-cl-rule p-0">
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Your first 3 matches appear as soon as you finish</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Every feature is free for every company</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Connections stay with your company, not the person</span>
              </li>
            </ul>
          </div>
          <div
            className="cl-pad max-w-[520px] min-w-0 flex-[1_1_380px] scroll-mt-22 border border-cl-rule bg-cl-surface p-9 text-cl-ink-2"
            id="join"
          >
            <div>
              <h2 className="mx-0 mt-0 mb-2 text-[30px] leading-[32px] font-normal tracking-[-0.02em] text-cl-ink">
                Put your company on the map
              </h2>
              <p className="mx-0 mt-0 mb-7 text-[15px] leading-[22px] text-cl-muted">
                Create your company profile in about two minutes.
              </p>
              <div className="mb-4.5 flex flex-col gap-2">
                <label
                  className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                  htmlFor="company"
                >
                  Company name
                </label>
                <input
                  className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                  id="company"
                  name="company"
                  autoComplete="organization"
                  placeholder="e.g. Kalayaan Foods Inc."
                />
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-3">
                <div className="mb-4.5 flex flex-col gap-2">
                  <label
                    className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                    htmlFor="fname"
                  >
                    Your name
                  </label>
                  <input
                    className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                    id="fname"
                    name="fname"
                    autoComplete="name"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-2">
                  <label
                    className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                    htmlFor="role"
                  >
                    Your role
                  </label>
                  <select
                    className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                    id="role"
                    name="role"
                  >
                    <option>Owner / CEO</option>
                    <option>Sales lead</option>
                    <option>Procurement</option>
                    <option>Marketing</option>
                    <option>Other authorized rep</option>
                  </select>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-2">
                <label
                  className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                  htmlFor="email"
                >
                  Work email
                </label>
                <input
                  className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@yourcompany.com"
                />
              </div>
              <div className="mb-4.5 flex flex-col gap-2">
                <label
                  className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
                  htmlFor="chamber"
                >
                  Chamber or association (optional)
                </label>
                <select
                  className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
                  id="chamber"
                  name="chamber"
                >
                  <option value="">Not a member yet</option>
                  <option>[PILOT CHAMBER]</option>
                  <option>Other chamber or association</option>
                </select>
              </div>
              <label
                className="mx-0 mt-1.5 mb-6 flex cursor-pointer items-start gap-3 text-[14px] leading-[21px] text-cl-ink-2"
                htmlFor="auth"
              >
                <input
                  className="mx-0 mt-0.5 mb-0 h-4.5 w-4.5 flex-none cursor-pointer accent-cl-accent"
                  id="auth"
                  type="checkbox"
                />
                <span>
                  I’m authorized to connect my company with other companies on its behalf.
                </span>
              </label>
              <p className="mx-0 mt-[-8px] mb-5 text-[13px] leading-[19px] text-cl-muted">
                Your profile, and which companies view it, are visible to other companies on
                ComLinked.
              </p>
              <button
                className="cl-btn flex h-13 w-full cursor-pointer items-center justify-center rounded-[8px] border border-cl-accent-strong bg-cl-accent-strong tracking-normal text-cl-surface [font:700_15px_var(--font-text)]"
                type="button"
              >
                Agree &amp; join
              </button>
              <p className="mx-0 mt-3.5 mb-0 text-center text-[13px] leading-[19px] text-cl-muted">
                By joining you agree to the ComLinked <a href="#">User Agreement</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>
              <div className="mx-0 my-5.5 flex items-center gap-3.5 font-sans text-[14px] font-bold tracking-normal text-cl-muted">
                <span className="h-[1px] flex-1 bg-cl-rule"></span>
                or
                <span className="h-[1px] flex-1 bg-cl-rule"></span>
              </div>
              <button
                className="cl-btn cl-btn-o flex h-13 w-full cursor-pointer items-center justify-center rounded-[8px] border border-cl-ink bg-transparent tracking-normal text-cl-ink [font:700_15px_var(--font-text)]"
                type="button"
              >
                Claim an existing company profile
              </button>
              <p className="mx-0 mt-5 mb-0 text-center text-[14px] leading-[20px]">
                Already on ComLinked? <Link href={paths.auth.signIn}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="cl-sec pt-0">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap gap-x-14 gap-y-6 px-5 py-0">
          <h2 className="cl-h2 mx-0 mt-0 mb-4 flex-[0.6_1_280px] font-normal tracking-[-0.025em] text-balance text-cl-ink">
            Questions from <span className="not-italic">companies</span>
          </h2>
          <div className="min-w-0 flex-[1.4_1_480px] border-b border-b-cl-rule">
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                Who can join?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                Companies only: their owners and authorized representatives. No personal profiles,
                multi-level marketing or one-person sellers.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                Is it really free?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                Yes. Every feature is open to every company, with no paywall. The names of companies
                interested in you are shown, not blurred.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                What happens on my first day?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                You claim your profile and meet 3 matched companies, each with a reason to talk. If
                no one has found you yet, a community manager makes an introduction.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                Does the AI send messages for me?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                No. With the AI Assistant on, it drafts intros, replies and follow-ups; nothing is
                sent until you tap Send. Turn it off at any time.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                What happens when our rep leaves?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                Your connections stay with your company profile. Assign another authorized rep and
                keep selling.
              </p>
            </details>
            <details className="cl-faq border-t border-t-cl-rule">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                How is this different from LinkedIn?
                <span
                  className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px]">
                LinkedIn connects people, so connections leave with them. ComLinked connects
                companies, so the relationships your company built stay with it.
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="cl-dark cl-rings-bottom-8 px-0 pt-32 pb-28 text-cl-paper">
        <div className="cl-in cl-cta-pad mx-auto my-0 max-w-[1200px] px-5 py-0">
          <h2 className="cl-hxl mx-0 mt-0 mb-18 max-w-[16em] font-normal tracking-[-0.035em] text-balance text-cl-paper">
            Build connections <span className="not-italic">your company keeps.</span>
          </h2>
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-t border-t-cl-on-night-24 pt-8">
            <ul className="m-0 max-w-[560px] flex-[1_1_360px] list-none border-b border-b-cl-on-night-14 p-0 font-sans text-[12px] leading-[18px] font-bold tracking-normal text-cl-on-night-82">
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Create your profile in about two minutes
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Connections stay with your company
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Free to join
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                className="cl-btn inline-flex h-14 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-ink no-underline"
                href="#join"
              >
                Join ComLinked free
              </a>
              <Link
                className="cl-btn cl-btn-od inline-flex h-14 items-center justify-center border border-cl-on-night-50 bg-transparent px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-paper no-underline"
                href={paths.marketing.chamberPilot}
              >
                Talk to us about a chamber pilot
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

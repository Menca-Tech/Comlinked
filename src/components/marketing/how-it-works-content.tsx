import Link from "next/link";

import { paths } from "@/paths";

export function HowItWorksContent() {
  return (
    <>
      <section className="cl-dark cl-rings-top-right text-cl-paper">
        <div className="cl-hero-pad mx-auto my-0 max-w-[1200px] px-5 pt-24 pb-26">
          <h1 className="cl-h1 mx-0 mt-6 mb-7 max-w-[15em] font-normal tracking-[-0.025em] text-balance text-cl-paper">
            First leads today.{" "}
            <span className="text-cl-sky not-italic">Fresh leads every morning.</span>
          </h1>
          <p className="m-0 max-w-[34em] text-[19px] leading-[30px] text-cl-on-night-80">
            Claim your company’s profile, meet your first matches today, and come back each morning
            to new ones.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              className="cl-btn inline-flex h-13 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-6 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-ink no-underline"
              href={paths.marketing.join}
            >
              Find your company
            </Link>
            <Link
              className="cl-btn cl-btn-od inline-flex h-13 items-center justify-center border border-cl-on-night-50 bg-transparent px-6 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-paper no-underline"
              href={paths.marketing.comDash}
            >
              See ComDash
            </Link>
          </div>
        </div>
      </section>
      <section className="cl-sec">
        <div className="cl-in mx-auto my-0 max-w-[1200px] border-b border-b-cl-rule px-5 py-0">
          <div className="mb-2 max-w-[700px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              Your first day
            </h2>
            <p className="m-0 text-[18px] leading-[28px]">
              Everything here happens on the day you claim your profile.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-4 border-t border-t-cl-rule px-0 py-11">
            <div className="min-w-0">
              <div className="mb-3 overflow-hidden">
                <span className="cl-pop0 font-sans text-[24px] leading-[30px] font-extrabold text-cl-accent-strong">
                  01
                </span>
              </div>
              <h3 className="mx-0 mt-0 mb-2.5 text-[30px] leading-[34px] font-normal tracking-[-0.02em] text-cl-ink">
                Claim your profile
              </h3>
              <p className="m-0 text-[18px] leading-[28px]">
                A personal link by email or SMS. One tap to claim and confirm.
              </p>
            </div>
            <ul className="m-0 min-w-0 list-none [align-self:end] border-b border-b-cl-sunken p-0">
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>
                  We pre-build your profile from your website, Facebook page or public listings.
                </span>
              </li>
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Sign in with Google, Facebook, an email link or your mobile number.</span>
              </li>
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>A strength meter shows your next step, like adding your top 3 products.</span>
              </li>
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Not listed yet? Create your profile in about two minutes.</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-4 border-t border-t-cl-rule px-0 py-11">
            <div className="min-w-0">
              <div className="mb-3 overflow-hidden">
                <span className="cl-pop0 font-sans text-[24px] leading-[30px] font-extrabold text-cl-accent-strong">
                  02
                </span>
              </div>
              <h3 className="mx-0 mt-0 mb-2.5 text-[30px] leading-[34px] font-normal tracking-[-0.02em] text-cl-ink">
                Meet 3 matched companies
              </h3>
              <p className="m-0 text-[18px] leading-[28px]">
                Right after you claim, 3 companies that fit you, each with a one-line reason to
                meet.
              </p>
            </div>
            <ul className="m-0 min-w-0 list-none [align-self:end] border-b border-b-cl-sunken p-0">
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Connect, message or skip each one.</span>
              </li>
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Every skip teaches ComLinked what fits you better.</span>
              </li>
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Connections belong to your company, not to the person who made them.</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-4 border-t border-t-cl-rule px-0 py-11">
            <div className="min-w-0">
              <div className="mb-3 overflow-hidden">
                <span className="cl-pop0 font-sans text-[24px] leading-[30px] font-extrabold text-cl-accent-strong">
                  03
                </span>
              </div>
              <h3 className="mx-0 mt-0 mb-2.5 text-[30px] leading-[34px] font-normal tracking-[-0.02em] text-cl-ink">
                See who’s interested
              </h3>
              <p className="m-0 text-[18px] leading-[28px]">
                ComDash shows who found you, viewed you or messaged you, by company name.
              </p>
            </div>
            <ul className="m-0 min-w-0 list-none [align-self:end] border-b border-b-cl-sunken p-0">
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>
                  No interest yet? A community manager hand-picks an introduction for you.
                </span>
              </li>
              <li className="flex gap-3 border-t border-t-cl-sunken px-0 py-2.5 text-[16px] leading-[25px]">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>
                  Post on the Asks board, like “Looking for a packaging supplier in QC”, and
                  matching companies are notified.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="cl-sec cl-dark cl-rings-top-right text-cl-paper">
        <div className="cl-in mx-auto my-0 max-w-[1200px] px-5 py-0">
          <div className="mb-10 max-w-[700px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-paper">
              Every day after
            </h2>
            <p className="m-0 text-[18px] leading-[28px] text-cl-on-night-82">
              Each step feeds the next, so the more you use ComLinked, the more companies find you.
            </p>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-7 gap-y-0 p-0">
            <li className="min-w-0 border-t border-t-cl-on-night-24 px-0 py-6">
              <h3 className="mx-0 mt-0 mb-2 text-[22px] leading-[28px] font-normal text-cl-paper">
                Your morning digest
              </h3>
              <p className="m-0 text-[15px] leading-[23px] text-cl-on-night-82">
                Every morning at 8:00: new leads, who viewed you, and how your rank changed.
              </p>
            </li>
            <li className="min-w-0 border-t border-t-cl-on-night-24 px-0 py-6">
              <h3 className="mx-0 mt-0 mb-2 text-[22px] leading-[28px] font-normal text-cl-paper">
                Act on today’s leads
              </h3>
              <p className="m-0 text-[15px] leading-[23px] text-cl-on-night-82">
                5 new matched companies. Connect, message or skip, in a few taps.
              </p>
            </li>
            <li className="min-w-0 border-t border-t-cl-on-night-24 px-0 py-6">
              <h3 className="mx-0 mt-0 mb-2 text-[22px] leading-[28px] font-normal text-cl-paper">
                Talk and close
              </h3>
              <p className="m-0 text-[15px] leading-[23px] text-cl-on-night-82">
                ComMail with templates for intros and quotes. Confirm “We met” and “We did business”
                together.
              </p>
            </li>
            <li className="min-w-0 border-t border-t-cl-on-night-24 px-0 py-6">
              <h3 className="mx-0 mt-0 mb-2 text-[22px] leading-[28px] font-normal text-cl-paper">
                Share the win
              </h3>
              <p className="m-0 text-[15px] leading-[23px] text-cl-on-night-82">
                Both companies post a short testimonial, and can share it to Facebook, LinkedIn or
                Viber.
              </p>
            </li>
            <li className="min-w-0 border-t border-t-cl-on-night-24 px-0 py-6">
              <h3 className="mx-0 mt-0 mb-2 text-[22px] leading-[28px] font-normal text-cl-paper">
                Your rank rises
              </h3>
              <p className="m-0 text-[15px] leading-[23px] text-cl-on-night-82">
                Activity lifts your place in search, which brings more views tomorrow.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section className="cl-sec">
        <div className="cl-in mx-auto my-0 flex max-w-[1200px] flex-wrap items-center gap-x-18 gap-y-10 px-5 py-0">
          <div className="min-w-0 flex-[1_1_360px]">
            <h2 className="cl-h2 mx-0 mt-0 mb-4 font-normal tracking-[-0.025em] text-balance text-cl-ink">
              AI drafts. You decide.
            </h2>
            <p className="mx-0 mt-0 mb-6 text-[18px] leading-[28px]">
              One switch turns the AI Assistant on or off. When it’s on, it writes a draft for you.
              Nothing is sent until you tap Send.
            </p>
            <ul className="m-0 list-none border-b border-b-cl-rule p-0">
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Introduce yourself to a match</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Suggest a reply to a ComMail</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Draft a polite follow-up after 3 days</span>
              </li>
              <li className="flex items-baseline gap-3 border-t border-t-cl-rule px-0 py-3.5 text-[16px] leading-[25px] text-cl-ink-2">
                <span
                  className="cl-ring-accent mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                <span>Polish your profile, asks and testimonials</span>
              </li>
            </ul>
            <p className="mx-0 mt-5 mb-0 text-[15px] leading-[23px] text-cl-muted">
              With it off, every screen works the same, with ready-made templates instead of drafts.
              It uses only your two companies’ profiles and the message thread.
            </p>
          </div>
          <div
            className="cl-card min-w-0 flex-[1_1_380px] border border-cl-rule bg-cl-surface p-7"
            aria-label="Example AI draft"
          >
            <div className="flex items-center justify-between gap-4 border-b border-b-cl-sunken pb-4.5">
              <span className="font-bold text-cl-ink">AI Assistant</span>
              <span
                className="inline-flex h-7.5 w-13 items-center justify-end rounded-full bg-cl-accent-strong p-[3px]"
                role="img"
                aria-label="On"
              >
                <span className="h-6 w-6 rounded-full bg-cl-surface"></span>
              </span>
            </div>
            <div className="px-0 pt-4 pb-2 text-[14px] leading-[20px] text-cl-muted">
              To Maple Bay Grocers
            </div>
            <div className="rounded-[8px] border border-cl-grey px-4 py-3.5 text-[16px] leading-[25px] text-cl-ink">
              <span className="mb-2 inline-block rounded-full bg-cl-accent-tint px-2.5 py-0.5 text-[13px] font-bold text-cl-accent-strong">
                AI draft
              </span>
              <br />
              Hi, we noticed Maple Bay stocks Filipino specialty foods. Kalayaan Foods makes banana
              chips and ube spreads, and we’d like to talk about supplying your stores.
            </div>
            <div className="mt-4 flex gap-2.5">
              <span className="inline-flex h-11 items-center rounded-full bg-cl-accent-strong px-5.5 py-0 text-[15px] font-bold text-cl-surface">
                Send
              </span>
              <span className="inline-flex h-11 items-center rounded-full border border-cl-ink px-5.5 py-0 text-[15px] font-bold text-cl-ink">
                Edit
              </span>
            </div>
            <div className="mt-3.5 text-right text-[13px] text-cl-muted">Example</div>
          </div>
        </div>
      </section>
      <section className="cl-dark cl-rings-bottom-8 px-0 pt-32 pb-28 text-cl-paper">
        <div className="cl-in cl-cta-pad mx-auto my-0 max-w-[1200px] px-5 py-0">
          <h2 className="cl-hxl mx-0 mt-0 mb-18 max-w-[16em] font-normal tracking-[-0.035em] text-balance text-cl-paper">
            Your first leads <span className="not-italic">are a day away.</span>
          </h2>
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-t border-t-cl-on-night-24 pt-8">
            <ul className="m-0 max-w-[560px] flex-[1_1_360px] list-none border-b border-b-cl-on-night-14 p-0 font-sans text-[12px] leading-[18px] font-bold tracking-normal text-cl-on-night-82">
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Claim or create in about two minutes
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                3 matched companies on day one
              </li>
              <li className="flex gap-3 border-t border-t-cl-on-night-14 px-0 py-3">
                <span
                  className="cl-ring-sky mr-2 inline-block h-[11px] w-[11px] flex-none rounded-full align-[-1px]"
                  aria-hidden="true"
                ></span>
                Nothing sent without your approval
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                className="cl-btn inline-flex h-14 items-center justify-center border border-cl-sky-strong bg-cl-sky-strong px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-ink no-underline"
                href={paths.marketing.join}
              >
                Find your company
              </Link>
              <Link
                className="cl-btn cl-btn-od inline-flex h-14 items-center justify-center border border-cl-on-night-50 bg-transparent px-7 py-0 font-sans text-[13px] font-bold tracking-normal text-cl-paper no-underline"
                href={paths.marketing.comDash}
              >
                Explore ComDash
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

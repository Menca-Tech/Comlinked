import Image from "next/image";
import Link from "next/link";

import { DemoNotice } from "@/components/demo-notice";
import { paths } from "@/paths";

export function Footer() {
  return (
    <>
      <footer className="border-t border-t-cl-rule bg-cl-paper text-cl-ink-2">
        <div className="mx-auto my-0 max-w-[1200px] px-5 pt-16 pb-0">
          <div className="flex flex-wrap gap-x-16 gap-y-12 border-b border-b-cl-rule pb-12">
            <div className="max-w-[380px] min-w-0 flex-[1_1_300px]">
              <Link className="inline-block" href={paths.home} aria-label="ComLinked home">
                <Image
                  className="block h-7.5 w-auto"
                  src="/assets/comlinked-logo.png"
                  alt="ComLinked"
                  width="150"
                  height="30"
                  loading="lazy"
                />
              </Link>
              <p className="mx-0 mt-4.5 mb-0 text-[18px] leading-[27px] tracking-[-0.01em] text-cl-ink">
                ComLinked connects companies, not individuals.
              </p>
            </div>
            <nav
              className="grid min-w-0 flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-8"
              aria-label="Footer"
            >
              <div className="min-w-0">
                <h2 className="mx-0 mt-0 mb-3 font-sans text-[14px] leading-[16px] font-bold font-normal tracking-normal text-cl-muted">
                  Product
                </h2>
                <ul className="m-0 list-none p-0">
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.howItWorks}
                    >
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.comDash}
                    >
                      ComDash
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.free}
                    >
                      What’s free
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.product.dash}
                    >
                      Sign in
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-0">
                <h2 className="mx-0 mt-0 mb-3 font-sans text-[14px] leading-[16px] font-bold font-normal tracking-normal text-cl-muted">
                  For chambers
                </h2>
                <ul className="m-0 list-none p-0">
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.chamberPilot}
                    >
                      Chamber pilot
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.chamberHow}
                    >
                      How it works for chambers
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.chamberFaq}
                    >
                      Chamber questions
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-0">
                <h2 className="mx-0 mt-0 mb-3 font-sans text-[14px] leading-[16px] font-bold font-normal tracking-normal text-cl-muted">
                  Company
                </h2>
                <ul className="m-0 list-none p-0">
                  <li>
                    <Link
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href={paths.marketing.chamberPilot}
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-0">
                <h2 className="mx-0 mt-0 mb-3 font-sans text-[14px] leading-[16px] font-bold font-normal tracking-normal text-cl-muted">
                  Legal
                </h2>
                <ul className="m-0 list-none p-0">
                  <li>
                    <a
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href="#"
                    >
                      User Agreement
                    </a>
                  </li>
                  <li>
                    <a
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href="#"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      className="cl-navl inline-block px-0 py-1.5 text-[15px] leading-[22px] text-cl-ink-2 no-underline"
                      href="#"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-0 pt-5.5 pb-7 font-sans text-[14px] leading-[17px] font-bold tracking-normal text-cl-muted">
            <span>© 2026 Rimenca Inc., Toronto, Ontario</span>{" "}
            <DemoNotice className="m-0 font-normal" />
            <span>Company-to-company network</span>{" "}
            <a className="cl-navl px-0 py-2 text-cl-muted no-underline" href="#top">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

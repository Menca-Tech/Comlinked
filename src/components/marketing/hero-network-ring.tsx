import type { CSSProperties } from "react";
import { headers } from "next/headers";

import { EXAMPLE_MATCHES } from "@/components/marketing/home/example-matches";
import { ExampleTag } from "@/components/marketing/section";

type RingStyle = CSSProperties & { "--ring-index": number };

interface RingCompany {
  name: string;
  shortName: string;
  initials: string;
  part: "centre" | "match" | "connection";
  x: number;
  y: number;
  onPhone: boolean;
}

const COMPANIES: RingCompany[] = [
  {
    name: "Kalayaan Foods",
    shortName: "Kalayaan",
    initials: "KF",
    part: "centre",
    x: 50,
    y: 50,
    onPhone: true,
  },
  {
    ...EXAMPLE_MATCHES.maple,
    part: "match",
    x: 50,
    y: 15,
    onPhone: true,
  },
  {
    ...EXAMPLE_MATCHES.pack,
    part: "match",
    x: 79,
    y: 66,
    onPhone: true,
  },
  {
    ...EXAMPLE_MATCHES.northline,
    part: "match",
    x: 21,
    y: 66,
    onPhone: true,
  },
  {
    name: "Luntian Foods",
    shortName: "Luntian",
    initials: "LF",
    part: "connection",
    x: 14,
    y: 25,
    onPhone: false,
  },
  {
    name: "Kainan Catering",
    shortName: "Kainan",
    initials: "KC",
    part: "connection",
    x: 86,
    y: 25,
    onPhone: false,
  },
  {
    name: "Hilaga Spice Traders",
    shortName: "Hilaga",
    initials: "HS",
    part: "connection",
    x: 50,
    y: 88,
    onPhone: false,
  },
];

const ofPart = (part: RingCompany["part"]) => COMPANIES.filter((c) => c.part === part);
const CENTRE = { x: 50, y: 50 };
const namesOf = (part: RingCompany["part"]) =>
  ofPart(part)
    .map((c) => c.name)
    .join(", ");
const RING_LABEL = `Example Network Ring: ${namesOf("centre")} at the centre, connected to its first-day Matches ${namesOf("match")}, with its Connections ${namesOf("connection")} around them.`;

/**
 * Arms the sequence before first paint, so the finished drawing never flashes and then
 * vanishes. It is an inline script rather than a client component because hydration runs
 * after paint. React does not run inline scripts on client-side navigation, so returning
 * to the page shows the finished drawing.
 */
const RING_ARM_SCRIPT = `(function(){var r=document.currentScript.previousElementSibling;if(!window.IntersectionObserver||matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.dataset.ring="armed";var o=new IntersectionObserver(function(e){if(e.some(function(i){return i.isIntersecting})){r.dataset.ring="playing";o.disconnect()}},{threshold:.35});o.observe(r)})()`;

/** One Company at the centre with its first-day Matches. Finished unless the script arms it. */
export async function HeroNetworkRing() {
  const nonce = (await headers()).get("x-nonce");
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <ExampleTag className="absolute top-0 right-0 z-[1] text-cl-on-night-82" />
      <div
        className="cl-nr"
        data-network-ring
        role="img"
        aria-label={RING_LABEL}
        suppressHydrationWarning
      >
        <svg className="cl-nr-lines" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="cl-nr-orbit" cx={CENTRE.x} cy={CENTRE.y} r="35" />
          <circle className="cl-nr-orbit cl-nr-orbit-outer" cx={CENTRE.x} cy={CENTRE.y} r="42" />
          {ofPart("match").map((match, index) => {
            const style: RingStyle = { "--ring-index": index };
            return (
              <line
                key={match.name}
                className="cl-nr-line"
                data-ring-part="line"
                style={style}
                x1={CENTRE.x}
                y1={CENTRE.y}
                x2={match.x}
                y2={match.y}
                pathLength={1}
              />
            );
          })}
        </svg>
        {(["centre", "match", "connection"] as const).flatMap((part) =>
          ofPart(part).map((company, index) => {
            const style: RingStyle = {
              left: `${company.x}%`,
              top: `${company.y}%`,
              "--ring-index": index,
            };
            return (
              <div
                key={company.name}
                className="cl-nr-node"
                data-ring-part={part}
                data-ring-phone={company.onPhone}
                style={style}
              >
                <span className="cl-nr-chip">{company.initials}</span>
                <span className="cl-nr-name cl-nr-full">{company.name}</span>
                <span className="cl-nr-name cl-nr-short">{company.shortName}</span>
              </div>
            );
          }),
        )}
      </div>
      {nonce ? (
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: RING_ARM_SCRIPT }}
        />
      ) : null}
    </div>
  );
}

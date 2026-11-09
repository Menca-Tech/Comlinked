"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { cn } from "@/lib/utils";
import type { RingNode } from "@/services/comlinked";
import { act, networkRing } from "@/services/comlinked";

interface Geometry {
  cx: number;
  cy: number;
  radii: Record<1 | 2 | 3, number>;
  center: number;
  spreads: Record<1 | 2 | 3, number>;
}

function useSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

// Laptop: the rings run off the right of the page and companies sit on the visible side.
// Phone: the rings form an arc across the top and run off both edges.
function geometry(w: number, h: number, desktop: boolean): Geometry {
  if (desktop) {
    const scale = Math.min(1, w / 893);
    return {
      cx: w - 230 * scale,
      cy: h / 2,
      radii: { 1: 150 * scale, 2: 255 * scale, 3: 360 * scale },
      center: 180,
      spreads: { 1: 360, 2: 110, 3: 78 },
    };
  }
  const scale = Math.min(1, w / 390);
  return {
    cx: w / 2,
    cy: 330,
    radii: { 1: 120 * scale, 2: 205 * scale, 3: 290 * scale },
    center: -90,
    spreads: { 1: 160, 2: 100, 3: 64 },
  };
}

function angleFor(tier: 1 | 2 | 3, index: number, count: number, g: Geometry) {
  const spread = g.spreads[tier];
  if (spread === 360) return -90 + (360 / count) * index;
  if (count === 1) return g.center;
  // On a laptop the list reads top to bottom; on a phone, left to right.
  const direction = g.center === 180 ? -1 : 1;
  return g.center - (direction * spread) / 2 + ((direction * spread) / (count - 1)) * index;
}

function positions(nodes: RingNode[], g: Geometry) {
  const counts = { 1: 0, 2: 0, 3: 0 };
  nodes.forEach((n) => counts[n.tier]++);
  const seen = { 1: 0, 2: 0, 3: 0 };
  return nodes.map((node) => {
    const angle = (angleFor(node.tier, seen[node.tier]++, counts[node.tier], g) * Math.PI) / 180;
    const r = g.radii[node.tier];
    return {
      node,
      x: g.cx + r * Math.cos(angle),
      y: g.cy + r * Math.sin(angle),
      fromX: g.cx + (r + 70) * Math.cos(angle),
      fromY: g.cy + (r + 70) * Math.sin(angle),
    };
  });
}

const DESCRIBE: Record<RingNode["status"], string> = {
  connected: "Connection",
  open: "Lead today",
  pending: "Connection Request sent",
  message: "Lead today, message started",
};

/** Your company at the centre, with Connections and today's Leads around it by degree. */
export function NetworkRing({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (node: RingNode) => void;
}) {
  const S = useSimulation();
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const [ref, { w, h }] = useSize();
  const { nodes, more } = networkRing();
  const leads = nodes.filter((n) => n.tier !== 1).length;
  const g = geometry(w, h, desktop);
  const placed = w ? positions(nodes, g) : [];
  const transition = reduce ? { duration: 0 } : { duration: 0.2, ease: "easeOut" as const };
  return (
    <div
      className="dv2-ring"
      ref={ref}
      role="group"
      aria-label={`Your network: ${nodes.length - leads} recent Connections and ${leads} Leads today`}
    >
      {w ? (
        <>
          <svg aria-hidden="true">
            <circle className="dv2-disc" cx={g.cx} cy={g.cy} r={g.radii[1] * 0.42} />
            <circle className="dv2-orbit t1" cx={g.cx} cy={g.cy} r={g.radii[1]} />
            <circle className="dv2-orbit t2" cx={g.cx} cy={g.cy} r={g.radii[2]} />
            <circle className="dv2-orbit t3" cx={g.cx} cy={g.cy} r={g.radii[3]} />
            <AnimatePresence initial={false}>
              {placed
                .filter((p) => p.node.tier === 1)
                .map((p) => (
                  <motion.line
                    key={p.node.company.id}
                    className="dv2-spoke"
                    x1={g.cx}
                    y1={g.cy}
                    initial={reduce ? false : { x2: g.cx, y2: g.cy, opacity: 0 }}
                    animate={{ x2: p.x, y2: p.y, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={transition}
                  />
                ))}
            </AnimatePresence>
          </svg>
          <span
            className="a-mono dv2-center"
            style={{ transform: `translate(${g.cx}px, ${g.cy}px)` }}
            aria-hidden="true"
          >
            {S.me.ini}
          </span>
          {more > 0 ? (
            <button
              type="button"
              className="dv2-more"
              style={{ transform: `translate(${g.cx + 42}px, ${g.cy - 22}px)` }}
              onClick={() => act.nav("company")}
            >
              +{more} connections
            </button>
          ) : null}
          <AnimatePresence initial={false}>
            {placed.map(({ node, x, y, fromX, fromY }) => {
              const c = node.company;
              const label = desktop ? c.name : c.name.split(" ")[0];
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  className={cn("dv2-node", `is-${node.status}`)}
                  aria-label={`${c.name}, ${DESCRIBE[node.status]}`}
                  aria-current={c.id === selected ? "true" : undefined}
                  initial={reduce ? false : { x: fromX, y: fromY, opacity: 0, scale: 0.85 }}
                  animate={{ x, y, opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={transition}
                  onClick={() => onSelect(node)}
                >
                  <span className={`a-mono deg${node.tier}`} aria-hidden="true">
                    {c.ini}
                  </span>
                  <span className="dv2-name">
                    <span>{label}</span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}

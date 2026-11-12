"use client";

import { useEffect } from "react";

import { NextActionPanel } from "@/components/product/comdash/next-action";
import { SummaryCards } from "@/components/product/comdash/summary-cards";
import { markDashSeen } from "@/services/comlinked";

// L2 D2 D4: ComDash's Overview tab, the prototype's Next action and four summary cards.
export function ComDash() {
  useEffect(() => markDashSeen(), []);
  return (
    <div className="cd-overview">
      <NextActionPanel />
      <SummaryCards />
    </div>
  );
}

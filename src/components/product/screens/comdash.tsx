"use client";

import { useEffect } from "react";

import { AlertsPanel } from "@/components/product/comdash/alerts-panel";
import { FoundYouAs } from "@/components/product/comdash/found-you-as";
import { IndustryPanel } from "@/components/product/comdash/industry-panel";
import { InterestFunnel } from "@/components/product/comdash/interest-funnel";
import { InterestedCompanies } from "@/components/product/comdash/interested-companies";
import { NextActionPanel } from "@/components/product/comdash/next-action";
import { SearchTermsPanel } from "@/components/product/comdash/search-terms";
import { SummaryCards } from "@/components/product/comdash/summary-cards";
import { TopNumbers } from "@/components/product/comdash/top-numbers";
import { VisibilityChart } from "@/components/product/comdash/visibility-chart";
import { markDashSeen } from "@/services/comlinked";

// L2 D2 D4: ComDash's Overview tab. Each panel reads its own data from the service seam.
export function ComDash() {
  useEffect(() => markDashSeen(), []);
  return (
    <div className="cd-overview">
      <TopNumbers />
      <div className="cd-row2">
        <VisibilityChart />
        <InterestFunnel />
      </div>
      <div className="cd-row3">
        <InterestedCompanies />
        <aside className="cd-rail" aria-label="Insights">
          <AlertsPanel />
          <FoundYouAs />
          <IndustryPanel />
          <SearchTermsPanel />
        </aside>
      </div>
      <NextActionPanel />
      <SummaryCards />
    </div>
  );
}

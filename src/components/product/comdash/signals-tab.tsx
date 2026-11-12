import { Suspense } from "react";

import { AlertsPanel } from "@/components/product/comdash/alerts-panel";
import { FoundYouAs } from "@/components/product/comdash/found-you-as";
import { IndustryPanel } from "@/components/product/comdash/industry-panel";
import { InterestFunnel } from "@/components/product/comdash/interest-funnel";
import { InterestedCompanies } from "@/components/product/comdash/interested-companies";
import { SearchTermsPanel } from "@/components/product/comdash/search-terms";
import { SignalDrawer } from "@/components/product/comdash/signal-drawer";
import { TopNumbers } from "@/components/product/comdash/top-numbers";
import { VisibilityChart } from "@/components/product/comdash/visibility-chart";

/** The Interest Signals tab, in the prototype's order: numbers, trends, companies and insights. */
export function SignalsTab() {
  return (
    <div className="cd-signals">
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
      <Suspense>
        <SignalDrawer />
      </Suspense>
    </div>
  );
}

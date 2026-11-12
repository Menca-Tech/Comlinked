import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AlertsPanel } from "@/components/product/comdash/alerts-panel";
import { FoundYouAs } from "@/components/product/comdash/found-you-as";
import { IndustryPanel } from "@/components/product/comdash/industry-panel";
import { InterestFunnel } from "@/components/product/comdash/interest-funnel";
import { InterestedCompanies } from "@/components/product/comdash/interested-companies";
import { SearchTermsPanel } from "@/components/product/comdash/search-terms";
import { TopNumbers } from "@/components/product/comdash/top-numbers";
import { VisibilityChart } from "@/components/product/comdash/visibility-chart";
import { act, getState } from "@/services/comlinked";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Interest Signals for a company with no signals yet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    act.demoNew();
    act.claimNext();
    act.claimConfirm("yes");
    act.claimFinish();
    getState().signals = [];
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows zero tiles with no change lines", () => {
    const { container } = render(<TopNumbers />);
    expect(container.querySelectorAll(".cd-tile")).toHaveLength(6);
    expect(container.querySelectorAll(".cd-d")).toHaveLength(0);
  });

  it("shows calm empty states on the chart, funnel, table and rail", () => {
    const { container } = render(
      <>
        <VisibilityChart />
        <InterestFunnel />
        <InterestedCompanies />
        <AlertsPanel />
        <FoundYouAs />
        <IndustryPanel />
        <SearchTermsPanel />
      </>,
    );
    expect(container.querySelector(".cd-chart")).toBeNull();
    expect(screen.getByText(/Your visibility appears here/)).toBeInTheDocument();
    expect(screen.getByText(/The funnel fills/)).toBeInTheDocument();
    expect(screen.getByText(/No interested companies yet/)).toBeInTheDocument();
    expect(screen.getByText(/^Nothing yet\./)).toBeInTheDocument();
    expect(screen.getByText(/No searches yet\. You’ll see what companies/)).toBeInTheDocument();
    expect(screen.getByText(/An industry shows here once 3/)).toBeInTheDocument();
    expect(screen.getByText(/No searches yet\. The words companies use/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows no percentage on a funnel step of 0", () => {
    getState().signals = [{ co: "sari", type: "search", detail: "snacks", day: getState().day }];
    const { container } = render(<InterestFunnel />);
    expect(container.querySelectorAll(".cd-fstep")).toHaveLength(5);
    expect(screen.queryByText(/of previous/)).not.toBeInTheDocument();
  });
});

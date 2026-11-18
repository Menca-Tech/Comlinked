import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { InterestSignalsCard, SummaryCards } from "@/components/product/comdash/summary-cards";
import { comDashTabs } from "@/components/product/comdash/tabs";
import { act, getState, openStop } from "@/services/comlinked";

describe("the Overview's Interest Signals card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    act.demoNew();
    act.claimNext();
    act.claimConfirm("yes");
    act.claimFinish();
  });

  it("shows zeros, a calm line in place of the day bars, and no Hot companies when nothing is interested", () => {
    getState().signals = [];
    render(<InterestSignalsCard />);
    expect(screen.getByText("No Hot companies yet")).toBeInTheDocument();
    expect(screen.getByText("0 Hot")).toBeInTheDocument();
    expect(screen.getByText("No search appearances or recommendations yet.")).toBeInTheDocument();
    expect(screen.queryByRole("figure")).toBeNull();
    expect(screen.queryByText(/^Day \d+$/)).toBeNull();
  });

  it("draws one bar for each day since the claim, names the first and last, and says the same in words", () => {
    act.morning("14");
    render(<InterestSignalsCard />);
    const days = getState().day - getState().joined + 1;
    const chart = within(screen.getByRole("figure"));
    // The bars are a picture, hidden from assistive technology: the sentence says the same.
    expect(chart.getAllByRole("listitem", { hidden: true })).toHaveLength(days);
    expect(chart.getByText(`Day ${getState().joined}`)).toBeInTheDocument();
    expect(chart.getByText(`Day ${getState().day}`)).toBeInTheDocument();
    expect(
      chart.getByText(
        new RegExp(`search appearances and recommendations over ${days} days since you claimed`),
      ),
    ).toBeInTheDocument();
  });

  it("links each Hot company to its timeline drawer", () => {
    render(<InterestSignalsCard />);
    expect(screen.getByRole("link", { name: "Luntian Foods Inc." })).toHaveAttribute(
      "href",
      "/app/dash/signals?company=luntian",
    );
  });
});

describe("ComDash and the after-MVP previews switch", () => {
  const cardTitles = () => screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

  beforeEach(() => vi.useFakeTimers());

  it("shows five tabs and four Overview cards in the full Demo", () => {
    act.demoActive();
    render(<SummaryCards />);
    expect(cardTitles()).toEqual(["Interest Signals", "AI Lead Agent", "Connections", "Profile"]);
    expect(comDashTabs().map((t) => t.label)).toEqual([
      "Overview",
      "Interest Signals",
      "AI Lead Agent",
      "Connections",
      "Profile",
    ]);
  });

  it("shows four tabs and three Overview cards in the Pilot Preview, until the switch is on", () => {
    openStop(4);
    const { unmount } = render(<SummaryCards />);
    expect(cardTitles()).toEqual(["Interest Signals", "Connections", "Profile"]);
    expect(comDashTabs().map((t) => t.label)).toEqual([
      "Overview",
      "Interest Signals",
      "Connections",
      "Profile",
    ]);
    unmount();
    act.toggleLaterItem("previews");
    render(<SummaryCards />);
    expect(cardTitles()).toContain("AI Lead Agent");
    expect(comDashTabs().map((t) => t.label)).toContain("AI Lead Agent");
  });
});
